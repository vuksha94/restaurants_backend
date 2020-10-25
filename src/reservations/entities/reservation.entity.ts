import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RestourantTables } from "src/restourant/entities/restourant-tables.entity";
import { ReservationStatus } from "src/utility/entities/reservation-status.entity";

@Index("table_id", ["tableId"], {})
@Index("status_id", ["statusId"], {})
@Entity("reservation", { schema: "restourants" })
export class Reservation {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "table_id" })
  tableId: number;

  @Column("varchar", { name: "name", length: 32 })
  name: string;

  @Column("varchar", { name: "last_name", length: 32 })
  lastName: string;

  @Column("varchar", { name: "phone", length: 20 })
  phone: string;

  @Column("varchar", { name: "email", length: 32 })
  email: string;

  @Column("int", { name: "status_id" })
  statusId: number;

  @Column("time", { name: "from_time" })
  fromTime: string;

  @Column("time", { name: "untill_time" })
  untillTime: string;

  @Column("date", { name: "reservation_date" })
  reservationDate: string;

  @ManyToOne(
    () => RestourantTables,
    (restourantTables) => restourantTables.reservations,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "table_id", referencedColumnName: "id" }])
  table: RestourantTables;

  @ManyToOne(
    () => ReservationStatus,
    (reservationStatus) => reservationStatus.reservations,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "status_id", referencedColumnName: "id" }])
  status: ReservationStatus;
}
