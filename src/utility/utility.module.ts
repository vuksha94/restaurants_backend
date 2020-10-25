import { Module } from '@nestjs/common';
import { UtilityController } from './utility.controller';
import { UtilityService } from './utility.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableDesc } from './entities/table-desc.entity';
import { City } from './entities/city.entity';
import { DayOfWeek } from './entities/day-of-week.entity';
import { NonWorkingDaysDesc } from './entities/non-working-days-desc.entity';
import { ReservationStatus } from './entities/reservation-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City, DayOfWeek, NonWorkingDaysDesc, ReservationStatus, TableDesc])],
  controllers: [UtilityController],
  providers: [UtilityService],
  exports: [TypeOrmModule]
})
export class UtilityModule { }
