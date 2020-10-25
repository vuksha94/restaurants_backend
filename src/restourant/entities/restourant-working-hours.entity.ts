import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Restourant } from "./restourant.entity";
import { DayOfWeek } from "src/utility/entities/day-of-week.entity";

@Index("restourant_id", ["restourantId"], {})
@Index("day_of_week_id", ["dayOfWeekId"], {})
@Entity("restourant_working_hours", { schema: "restourants" })
export class RestourantWorkingHours {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "restourant_id" })
  restourantId: number;

  @Column("int", { name: "day_of_week_id" })
  dayOfWeekId: number;

  @Column("time", { name: "opening_time" })
  openingTime: string;

  @Column("time", { name: "closing_time" })
  closingTime: string;

  @Column("tinyint", { name: "is_working", width: 1, default: () => "'1'" })
  isWorking: boolean;

  @ManyToOne(
    () => Restourant,
    (restourant) => restourant.restourantWorkingHours,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "restourant_id", referencedColumnName: "id" }])
  restourant: Restourant;

  @ManyToOne(() => DayOfWeek, (dayOfWeek) => dayOfWeek.restourantWorkingHours, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "day_of_week_id", referencedColumnName: "id" }])
  dayOfWeek: DayOfWeek;
}
