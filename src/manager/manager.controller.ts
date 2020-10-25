import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse } from 'src/api-response/api-response';
import { ManagerService } from './manager.service';

@Controller('manager')
export class ManagerController {
    constructor(private readonly managerService: ManagerService) { }

    // get restourant of manager with id
    @Get('restourant/:id')
    getManagersRestourant(@Param('id') id: string): Promise<ApiResponse> {
        return this.managerService.getManagersRestourant(id);
    }
}
