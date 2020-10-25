import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Restourant } from "src/restourant/entities/restourant.entity";

@Index("City_Name_Unique", ["name"], { unique: true })
@Entity("city", { schema: "restourants" })
export class City {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", unique: true, length: 32 })
  name: string;

  @OneToMany(() => Restourant, (restourant) => restourant.city)
  restourants: Restourant[];
}
