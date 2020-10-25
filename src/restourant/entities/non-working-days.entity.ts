import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { NonWorkingDaysDesc } from "src/utility/entities/non-working-days-desc.entity";
import { Restourant } from "./restourant.entity";

@Index("restaurant_id", ["restaurantId"], {})
@Index("description_id", ["descriptionId"], {})
@Entity("non_working_days", { schema: "restourants" })
export class NonWorkingDays {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "restaurant_id" })
  restaurantId: number;

  @Column("date", { name: "date" })
  date: string;

  @Column("int", { name: "description_id" })
  descriptionId: number;

  @Column("text", { name: "user_description", nullable: true })
  userDescription: string | null;

  @ManyToOne(() => Restourant, (restourant) => restourant.nonWorkingDays, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "restaurant_id", referencedColumnName: "id" }])
  restaurant: Restourant;

  @ManyToOne(
    () => NonWorkingDaysDesc,
    (nonWorkingDaysDesc) => nonWorkingDaysDesc.nonWorkingDays,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "description_id", referencedColumnName: "id" }])
  description: NonWorkingDaysDesc;

}
