import { InternalServerErrorException } from '@nestjs/common';
import * as S3 from 'aws-sdk/clients/s3';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';

const { AWS_BUCKET_NAME = 'bucket-temp' } = process.env;

const s3 = new S3({ apiVersion: '2006-03-01', region: process.env.AWS_REGION });

s3.listBuckets((err, data) => {
  if (err) {
    throw new InternalServerErrorException(err);
  } else {
    const hasBucket = data.Buckets.find((bucket) => bucket.Name === AWS_BUCKET_NAME);
    if (!hasBucket) {
      s3.createBucket({ Bucket: AWS_BUCKET_NAME }, (err) => {
        if (err) {
          throw new InternalServerErrorException(err);
        } else {
          const readOnlyAnonUserPolicy = {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'AddPerm',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${AWS_BUCKET_NAME}/*`],
              },
            ],
          };

          const bucketPolicyParams = {
            Bucket: AWS_BUCKET_NAME,
            Policy: JSON.stringify(readOnlyAnonUserPolicy),
          };

          s3.putBucketPolicy(bucketPolicyParams, (err) => {
            if (err) {
              throw new InternalServerErrorException(err);
            }
          });
        }
      });
    }
  }
});

export const uploadToS3 = (
  file: Express.Multer.File,
  path = '',
): Promise<S3.ManagedUpload.SendData> => {
  const name = `${uuid()}${extname(file.originalname)}`;
  const Key = join(path, name);
  const uploadParams = { Bucket: AWS_BUCKET_NAME, Key, Body: file.buffer };

  const uploadPromise = s3.upload(uploadParams).promise();

  return uploadPromise;
};
