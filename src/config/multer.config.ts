import { BadRequestException } from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { diskStorage } from 'multer';

const { UPLOAD_FILE_PATH = './upload', MAX_FILE_SIZE = 52428800 } = process.env;

const storage = diskStorage({
  destination: UPLOAD_FILE_PATH,
  filename: (req, file, callback) => {
    const name = `${uuid()}${extname(file.originalname)}`;
    callback(null, name);
  },
});

export const MulterConfig: MulterModuleOptions = {
  storage,
  limits: { fileSize: +MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return cb(null, true);
    }
    const error = new BadRequestException(`Unsupported file type ${extname(file.originalname)}`);
    cb(error, false);
  },
};
