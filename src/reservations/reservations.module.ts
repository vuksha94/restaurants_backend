import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationStatus } from 'src/utility/entities/reservation-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, ReservationStatus])],
  providers: [ReservationsService],
  controllers: [ReservationsController]
})
export class ReservationsModule { }
