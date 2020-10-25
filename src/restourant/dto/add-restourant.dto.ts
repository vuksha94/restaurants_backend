import * as Validator from 'class-validator'
export class AddRestourant {
    @Validator.IsNotEmpty()
    @Validator.MaxLength(32)
    name: string;

    description?: string;

    @Validator.IsNotEmpty()
    @Validator.MaxLength(64)
    address: string;

    //@Validator.IsNumberString()
    @Validator.IsNotEmpty()
    cityId: number;

    photo?: string;
}