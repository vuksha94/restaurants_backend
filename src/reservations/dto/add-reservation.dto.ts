import * as Validator from "class-validator";

export class AddReservation {
    @Validator.IsNotEmpty()
    @Validator.IsInt()
    tableId: number;

    @Validator.IsNotEmpty()
    @Validator.MaxLength(32)
    name: string;

    @Validator.IsNotEmpty()
    @Validator.MaxLength(32)
    lastName: string;

    @Validator.IsNotEmpty()
    @Validator.MaxLength(20)
    phone: string;

    @Validator.IsNotEmpty()
    @Validator.MaxLength(32)
    email: string;

    @Validator.IsNotEmpty()
    fromTime: string;

    @Validator.IsNotEmpty()
    untillTime: string;

    @Validator.IsNotEmpty()
    reservationDate: string;

}