import * as SES from 'aws-sdk/clients/ses';
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';

interface Mailer {
  from?: string;
  to: string[];
  cc?: string[];
  subject: string;
  content: string;
  reply?: string[];
}

export const mailer = ({
  from = 'service@api.com',
  to,
  cc,
  subject,
  content,
  reply,
}: Mailer): Promise<PromiseResult<SES.SendEmailResponse, AWSError>> => {
  const params = {
    Destination: { CcAddresses: cc, ToAddresses: to },
    Message: {
      Subject: { Charset: 'UTF-8', Data: subject },
      Body: { Html: { Charset: 'UTF-8', Data: content } },
    },
    Source: from,
    ReplyToAddresses: reply,
  };

  const sendPromise = new SES({ apiVersion: '2010-12-01', region: process.env.AWS_REGION })
    .sendEmail(params)
    .promise();

  return sendPromise;
};
