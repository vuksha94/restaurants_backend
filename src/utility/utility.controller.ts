import { Controller, Get } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { ApiResponse } from 'src/api-response/api-response';

@Controller('utility')
export class UtilityController {
    constructor(private utilityService: UtilityService) { }

    // get all cities
    @Get('cities')
    findAllCities(): Promise<ApiResponse> {
        return this.utilityService.findAllCities();
    }

    // get all days of week descriptions
    @Get('days-of-week-desc')
    findAllDaysOfWeekDesc(): Promise<ApiResponse> {
        return this.utilityService.findAllDaysOfWeekDesc();
    }

    // get all non working days descriptions
    @Get('non-working-days-desc')
    findAllNonWorkingDaysDesc(): Promise<ApiResponse> {
        return this.utilityService.findAllNonWorkingDaysDesc();
    }

    // get all reservation statuses descriptions
    @Get('reservation-status-desc')
    findAllReservationStatusDesc(): Promise<ApiResponse> {
        return this.utilityService.findAllReservationStatusDesc();
    }

    // get all table descriptions
    @Get('table-desc')
    findAllTableDesc(): Promise<ApiResponse> {
        return this.utilityService.findAllTableDesc();
    }
}
