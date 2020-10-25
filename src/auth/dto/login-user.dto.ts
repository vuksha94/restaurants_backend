import * as Validator from 'class-validator';
export class LoginUserDto {
  @Validator.IsNotEmpty()
  @Validator.IsEmail()
  email: string;

  @Validator.IsNotEmpty()
  @Validator.Length(4, 32)
  password: string;
}
