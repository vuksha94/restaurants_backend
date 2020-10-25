import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RestourantTables } from "src/restourant/entities/restourant-tables.entity";

@Index("Description_Unique", ["description"], { unique: true })
@Entity("table_desc", { schema: "restourants" })
export class TableDesc {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "description", unique: true, length: 32 })
  description: string;

  @OneToMany(
    () => RestourantTables,
    (restourantTables) => restourantTables.description
  )
  restourantTables: RestourantTables[];
}
