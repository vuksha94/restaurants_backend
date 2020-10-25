import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Reservation } from "src/reservations/entities/reservation.entity";

@Index("description", ["description"], { unique: true })
@Index("code", ["code"], { unique: true })
@Entity("reservation_status", { schema: "restourants" })
export class ReservationStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "description", unique: true, length: 20 })
  description: string;

  @Column("tinyint", { name: "code", unique: true, width: 1 })
  code: number;

  @OneToMany(() => Reservation, (reservation) => reservation.status)
  reservations: Reservation[];
}
