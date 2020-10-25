import * as Validator from 'class-validator';

export class RegisterUserDto {
    @Validator.IsNotEmpty()
    @Validator.MinLength(1)
    @Validator.MaxLength(32)
    name: string;

    @Validator.IsNotEmpty()
    @Validator.MinLength(1)
    @Validator.MaxLength(32)
    lastName: string;

    @Validator.IsNotEmpty()
    @Validator.IsEmail()
    email: string;

    @Validator.IsNotEmpty()
    password: string;

    @Validator.IsNotEmpty()
    confirmPassword: string;

}