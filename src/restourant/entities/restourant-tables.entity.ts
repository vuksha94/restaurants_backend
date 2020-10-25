import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Restourant } from "./restourant.entity";
import { Reservation } from "src/reservations/entities/reservation.entity";
import { TableDesc } from "src/utility/entities/table-desc.entity";


@Index("restourant_table_unique", ["restourantId", "tableNumber"], {
  unique: true,
})
@Index("description_id", ["descriptionId"], {})
@Entity("restourant_tables", { schema: "restourants" })
export class RestourantTables {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "restourant_id" })
  restourantId: number;

  @Column("int", { name: "table_number" })
  tableNumber: number;

  @Column("int", { name: "description_id" })
  descriptionId: number;

  @Column("tinyint", { name: "capacity" })
  capacity: number;

  @Column("tinyint", { name: "max_hours_available", width: 1 })
  maxHoursAvailable: number;

  @OneToMany(() => Reservation, (reservation) => reservation.table)
  reservations: Reservation[];

  @ManyToOne(() => Restourant, (restourant) => restourant.restourantTables, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "restourant_id", referencedColumnName: "id" }])
  restourant: Restourant;

  @ManyToOne(() => TableDesc, (tableDesc) => tableDesc.restourantTables, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "description_id", referencedColumnName: "id" }])
  description: TableDesc;
}
