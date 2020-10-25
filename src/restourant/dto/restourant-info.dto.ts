import { NonWorkingDays } from "../entities/non-working-days.entity";
import { RestourantTables } from "../entities/restourant-tables.entity";
import { RestourantWorkingHours } from "../entities/restourant-working-hours.entity";

export class RestourantInfo {
    id: number
    name: string;
    description?: string;
    address: string;
    city: string;
    photo?: string;

    openingDetails: OpeningDetails | null; // null ako nisu ubacena u bazu radna vremena po danima
    workingTimes?: RestourantWorkingHours[];
    nonWorkingDays?: NonWorkingDays[];
    tables?: RestourantTables[];
}

export class OpeningDetails {
    isOpened: boolean;

    openingTime: string | null;
    openingDay: string | null;

    closingTime: string | null;
}