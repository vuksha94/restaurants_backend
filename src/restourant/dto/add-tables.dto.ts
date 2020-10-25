import { Table } from "./table.dto";
import * as Validator from "class-validator";

export class AddTablesDto {
    @Validator.ArrayNotEmpty()
    @Validator.ValidateNested({ each: true })
    tables: Table[];
}