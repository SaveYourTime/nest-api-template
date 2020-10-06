import {
  IsEmail,
  IsString,
  IsPhoneNumber,
  IsISO8601,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Gender } from '../gender.enum';
import { Marriage } from '../marriage.enum';
import { Education } from '../education.enum';

export class UserProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  nickName?: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsPhoneNumber('TW')
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsISO8601()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsEnum(Marriage)
  @IsOptional()
  marriage?: Marriage;

  @IsEnum(Education)
  @IsOptional()
  education?: Education;
}
