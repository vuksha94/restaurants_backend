import { Controller, Post, Body, Get, Query, Param, Req } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { AddReservation } from './dto/add-reservation.dto';
import { ApiResponse } from 'src/api-response/api-response';
import { JwtSecret } from 'config/jwt.secret';
import { JwtDataDto } from 'src/middlewares/dto/jwt-data.dto';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @Get('find')
    findAllReservations(@Req() req: Request, @Query('statusCode') statusCode: number): Promise<ApiResponse> {
        // get manager id
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.toString().split(' ')[1];
        const data = jwt.verify(token, JwtSecret) as JwtDataDto;
        return this.reservationsService.findAllReservations(data.jwtData.id, statusCode);
    }

    @Post('add')
    addReservation(
        @Body() addReservation: AddReservation
    ): Promise<ApiResponse> {
        return this.reservationsService.addReservation(addReservation);
    }

    @Get('confirm/:id')
    confirmReservation(@Param('id') id: number): Promise<ApiResponse> {
        return this.reservationsService.updateReservation(id, 1);
    }

    @Get('reject/:id')
    rejectReservation(@Param('id') id: number): Promise<ApiResponse> {
        return this.reservationsService.updateReservation(id, 2);
    }
}
