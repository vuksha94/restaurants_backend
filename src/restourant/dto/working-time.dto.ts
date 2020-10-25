import * as Validator from "class-validator";
export class WorkingTime {
    @Validator.IsNotEmpty()
    //@Validator.IsInt()
    restourantId: number;

    @Validator.IsNotEmpty()
    //@Validator.IsInt()
    dayOfWeekId: number;

    @Validator.IsNotEmpty()
    openingTime: string;

    @Validator.IsNotEmpty()
    closingTime: string;

    isWorking?: boolean;
}