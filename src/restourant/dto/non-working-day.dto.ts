import * as Validator from "class-validator";

export class NonWorkingDayDto {
    @Validator.IsNotEmpty()
    //@Validator.IsInt()
    restourantId: number;

    @Validator.IsNotEmpty()
    @Validator.IsDateString()
    date: string;

    @Validator.IsNotEmpty()
    //@Validator.IsInt()
    descriptionId: number;

    userDescription?: string;
}