import { Controller, Post, Body, Req, Get, Param, Query } from '@nestjs/common';
import { Restourant } from './entities/restourant.entity';
import { AddRestourant } from './dto/add-restourant.dto';
import { RestourantService } from './restourant.service';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtSecret } from 'config/jwt.secret';
import { JwtDataDto } from 'src/middlewares/dto/jwt-data.dto';
import { ApiResponse } from 'src/api-response/api-response';
import { AddTablesDto } from './dto/add-tables.dto';
import { AddWorkingTimesDto } from './dto/add-working-times.dto';
import { AddNonWorkingDaysDto } from './dto/add-non-working-days.dto';
import { FindAvailableTablesDto } from './dto/find-available-tables.dto';

@Controller('restourant')
export class RestourantController {
    constructor(private readonly restourantService: RestourantService) { }

    // get all restaurants [from city with 'cityId']
    @Get('find')
    findAllRestaurants(@Query('cityId') cityId: number): Promise<ApiResponse> {
        return this.restourantService.findAllRestourants(cityId);
    }

    @Get(':id')
    findRestaurant(@Param('id') id: number): Promise<ApiResponse> {
        return this.restourantService.findAllRestourants(0, id); // finds restaurant with given id
    }

    /*@Get('/manager/:id')
    findManagersRestaurants(@Param('id') id: number): Promise<ApiResponse> {
        return this.restourantService.findManagersRestaurant(id); // finds restaurant with given id
    }*/

    @Post('available-tables')
    findAvailableTables(@Body() findAvailableTablesDto: FindAvailableTablesDto): Promise<ApiResponse> {
        return this.restourantService.findAvailableTables(findAvailableTablesDto);
    }

    @Post('add')
    addRestourant(
        @Body() addRestourant: AddRestourant,
        @Req() req: Request
    ): Promise<ApiResponse> {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.toString().split(' ')[1]; // Bearer 'token'
        const managerData = jwt.verify(token, JwtSecret) as JwtDataDto;
        const managerId = managerData.jwtData.id;
        return this.restourantService.addRestourant(addRestourant, managerId);
    }

    @Post('tables/add')
    addTables(
        @Body() addTablesDto: AddTablesDto
    ): Promise<ApiResponse> {
        return this.restourantService.addTables(addTablesDto);
    }

    @Post('working-time/add')
    addWorkingTime(
        @Body() addWorkingTimesDto: AddWorkingTimesDto
    ): Promise<ApiResponse> {
        return this.restourantService.addWorkingTime(addWorkingTimesDto);
    }

    @Post('non-working-days/add')
    addNonWorkingDays(
        @Body() addNonWorkingDaysDto: AddNonWorkingDaysDto
    ): Promise<ApiResponse> {
        return this.restourantService.addNonWorkingDays(addNonWorkingDaysDto);
    }
}
