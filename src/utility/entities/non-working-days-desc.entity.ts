import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { NonWorkingDays } from "src/restourant/entities/non-working-days.entity";

@Index("Description_Unique", ["description"], { unique: true })
@Entity("non_working_days_desc", { schema: "restourants" })
export class NonWorkingDaysDesc {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "description", unique: true, length: 32 })
  description: string;

  @OneToMany(
    () => NonWorkingDays,
    (nonWorkingDays) => nonWorkingDays.description
  )
  nonWorkingDays: NonWorkingDays[];
}
