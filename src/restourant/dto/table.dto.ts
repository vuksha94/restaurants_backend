import * as Validator from 'class-validator'

export class Table {
    @Validator.IsNotEmpty()
    //@Validator.IsInt()
    restourantId: number;

    @Validator.IsNotEmpty()
    //@Validator.IsInt()
    tableNumber: number;

    @Validator.IsNotEmpty()
    //@Validator.IsInt()
    descriptionId: number;

    @Validator.IsNotEmpty()
    //@Validator.IsInt()
    capacity: number;

    @Validator.IsNotEmpty()
    //@Validator.IsInt()
    maxHoursAvailable: number;
}