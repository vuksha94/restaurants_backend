import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RestourantWorkingHours } from "src/restourant/entities/restourant-working-hours.entity";

@Index("Day_Name_Unique", ["name"], { unique: true })
@Index("Oridnal_Number_Unique", ["ordinalNumber"], { unique: true })
@Entity("day_of_week", { schema: "restourants" })
export class DayOfWeek {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", unique: true, length: 12 })
  name: string;

  @Column("tinyint", { name: "ordinal_number", unique: true, width: 1 })
  ordinalNumber: number;

  @OneToMany(
    () => RestourantWorkingHours,
    (restourantWorkingHours) => restourantWorkingHours.dayOfWeek
  )
  restourantWorkingHours: RestourantWorkingHours[];
}
