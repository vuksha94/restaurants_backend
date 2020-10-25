import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Restourant } from "src/restourant/entities/restourant.entity";

@Index("Email_Unique", ["email"], { unique: true })
@Entity("manager", { schema: "restourants" })
export class Manager {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "email", unique: true, length: 64 })
  email: string;

  @Column("varchar", { name: "password", length: 256 })
  password: string;

  @Column("varchar", { name: "name", length: 32 })
  name: string;

  @Column("varchar", { name: "last_name", length: 32 })
  lastName: string;

  @OneToMany(() => Restourant, (restourant) => restourant.manager)
  restourants: Restourant[];
}
