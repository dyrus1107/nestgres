import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthenticationDto } from './create-authentication.dto';

export class RegisterDto {
  name: string;
  email: string;
  password: string;
}
