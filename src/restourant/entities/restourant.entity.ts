import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RestourantTables } from "./restourant-tables.entity";
import { RestourantWorkingHours } from "./restourant-working-hours.entity";
import { Manager } from "src/manager/entities/manager.entity";
import { NonWorkingDays } from "./non-working-days.entity";
import { City } from "src/utility/entities/city.entity";

@Index("city_id", ["cityId"], {})
@Index("manager_id", ["managerId"], {})
@Index("name_unique", ["name"], { unique: true })
@Entity("restourant", { schema: "restourants" })
export class Restourant {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "manager_id" })
  managerId: number;

  @Column("varchar", { name: "name", length: 32 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("varchar", { name: "address", length: 64 })
  address: string;

  @Column("int", { name: "city_id" })
  cityId: number;

  @Column("varchar", { name: "photo", nullable: true, length: 128 })
  photo: string | null;

  @OneToMany(
    () => NonWorkingDays,
    (nonWorkingDays) => nonWorkingDays.restaurant
  )
  nonWorkingDays: NonWorkingDays[];

  @ManyToOne(() => Manager, (manager) => manager.restourants, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "manager_id", referencedColumnName: "id" }])
  manager: Manager;

  @ManyToOne(() => City, (city) => city.restourants, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "city_id", referencedColumnName: "id" }])
  city: City;

  @OneToMany(
    () => RestourantTables,
    (restourantTables) => restourantTables.restourant
  )
  restourantTables: RestourantTables[];

  @OneToMany(
    () => RestourantWorkingHours,
    (restourantWorkingHours) => restourantWorkingHours.restourant
  )
  restourantWorkingHours: RestourantWorkingHours[];
}
