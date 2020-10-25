import * as Validator from "class-validator";
import { NonWorkingDayDto } from "./non-working-day.dto";

export class AddNonWorkingDaysDto {
    @Validator.ArrayNotEmpty()
    @Validator.ValidateNested({ each: true })
    nonWorkingDays: NonWorkingDayDto[]
}