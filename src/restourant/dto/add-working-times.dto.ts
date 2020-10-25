import * as Validator from "class-validator";
import { WorkingTime } from "./working-time.dto";

export class AddWorkingTimesDto {
    @Validator.ArrayNotEmpty()
    workingTimes: WorkingTime[];
}