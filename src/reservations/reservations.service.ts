import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/api-response/api-response';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { AddReservation } from './dto/add-reservation.dto';
import { ReservationStatus } from 'src/utility/entities/reservation-status.entity';
import { response } from 'express';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        @InjectRepository(ReservationStatus)
        private readonly reservationStatusRepository: Repository<ReservationStatus>
    ) { }

    async findAllReservations(userId: number, statusCode?: number): Promise<ApiResponse> {
        const apiResponse = new ApiResponse();
        console.log(userId)
        if (statusCode !== undefined) {
            const reservationStatusWithCode = await this.reservationStatusRepository.findOne({ where: { code: statusCode } });
            if (!reservationStatusWithCode) {
                apiResponse.status = 'error';
                apiResponse.statusCode = -3201;
                apiResponse.message = "Status code is invalid!";
                return Promise.resolve(apiResponse);
            }
            apiResponse.data = await getRepository(Reservation)
                .createQueryBuilder("reservation")
                .innerJoinAndSelect("reservation.status", "status")
                .innerJoin("reservation.table", "table")
                .innerJoin("table.restourant", "restourant", "restourant.managerId = :id", { id: userId })
                .where("reservation.statusId = :id", { id: reservationStatusWithCode.id })
                .getMany();
            console.log(reservationStatusWithCode.id);
        } else {
            apiResponse.data = await getRepository(Reservation)
                .createQueryBuilder("reservation")
                .innerJoinAndSelect("reservation.status", "status")
                .innerJoinAndSelect("reservation.table", "table")
                .innerJoinAndSelect("table.restourant", "restourant", "restourant.managerId = :id", { id: userId })
                .getMany();
        }

        return Promise.resolve(apiResponse);
    }

    async updateReservation(id: number, code: number): Promise<ApiResponse> {
        const apiResponse = new ApiResponse();
        const reservationToUpdate = await this.reservationRepository.findOne(id);
        if (!reservationToUpdate) {
            apiResponse.status = 'error';
            apiResponse.statusCode = -3202;
            apiResponse.message = "Reservation with id:" + id + " doesn't exist!";
            return Promise.resolve(apiResponse);
        }
        const reservationStatusWithCode = await this.reservationStatusRepository.findOne({ where: { code: code } });
        reservationToUpdate.statusId = reservationStatusWithCode.id;
        const updatedReservation = await this.reservationRepository.save(reservationToUpdate);
        apiResponse.data = updatedReservation;
        return Promise.resolve(apiResponse);
    }

    async addReservation(addReservation: AddReservation): Promise<ApiResponse> {
        const apiResponse = new ApiResponse();
        try {
            const reservationToAdd = new Reservation();
            reservationToAdd.tableId = addReservation.tableId;
            reservationToAdd.name = addReservation.name;
            reservationToAdd.lastName = addReservation.lastName;
            reservationToAdd.phone = addReservation.phone;
            reservationToAdd.email = addReservation.email;
            reservationToAdd.fromTime = addReservation.fromTime;
            reservationToAdd.untillTime = addReservation.untillTime;
            reservationToAdd.reservationDate = addReservation.reservationDate;
            const defaultReservationStatus = await this.reservationStatusRepository.findOne({ where: { code: 0 } });
            reservationToAdd.statusId = defaultReservationStatus.id;
            const addedReservation = await this.reservationRepository.save(reservationToAdd);
            apiResponse.data = addedReservation;
        }
        catch (err) {
            apiResponse.status = 'error';
            apiResponse.statusCode = -3200;
            apiResponse.message = err.message;
        }
        finally {
            return Promise.resolve(apiResponse);
        }
    }
}
