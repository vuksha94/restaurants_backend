import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { DayOfWeek } from './entities/day-of-week.entity';
import { NonWorkingDaysDesc } from './entities/non-working-days-desc.entity';
import { ReservationStatus } from './entities/reservation-status.entity';
import { TableDesc } from './entities/table-desc.entity';
import { ApiResponse } from 'src/api-response/api-response';

@Injectable()
export class UtilityService {
    constructor(
        @InjectRepository(City)
        private readonly cityRepository: Repository<City>,
        @InjectRepository(DayOfWeek)
        private readonly dayOfWeekDescRepository: Repository<DayOfWeek>,
        @InjectRepository(NonWorkingDaysDesc)
        private readonly nonWorkingDaysDescRepository: Repository<NonWorkingDaysDesc>,
        @InjectRepository(ReservationStatus)
        private readonly reservationStatusRepository: Repository<ReservationStatus>,
        @InjectRepository(TableDesc)
        private readonly tableDescRepository: Repository<TableDesc>
    ) { }

    // get all cities
    async findAllCities(): Promise<ApiResponse> {
        const data = await this.cityRepository.find();
        const apiResponse = new ApiResponse();
        apiResponse.data = data;
        return Promise.resolve(apiResponse);
    }

    // get all days of week descriptions
    async findAllDaysOfWeekDesc(): Promise<ApiResponse> {
        const data = await this.dayOfWeekDescRepository.find();
        const apiResponse = new ApiResponse();
        apiResponse.data = data;
        return Promise.resolve(apiResponse);
    }

    // get all non working days descriptions
    async findAllNonWorkingDaysDesc(): Promise<ApiResponse> {
        const data = await this.nonWorkingDaysDescRepository.find();
        const apiResponse = new ApiResponse();
        apiResponse.data = data;
        return Promise.resolve(apiResponse);
    }

    // get all reservation statuses descriptions
    async findAllReservationStatusDesc(): Promise<ApiResponse> {
        const data = await this.reservationStatusRepository.find();
        const apiResponse = new ApiResponse();
        apiResponse.data = data;
        return Promise.resolve(apiResponse);
    }

    // get all table descriptions
    async findAllTableDesc(): Promise<ApiResponse> {
        const data = await this.tableDescRepository.find();
        const apiResponse = new ApiResponse();
        apiResponse.data = data;
        return Promise.resolve(apiResponse);
    }
}
