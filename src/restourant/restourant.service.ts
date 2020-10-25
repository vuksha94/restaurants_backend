import { Injectable } from '@nestjs/common';
import { AddRestourant } from './dto/add-restourant.dto';
import { Restourant } from './entities/restourant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder, getRepository } from 'typeorm';
import { ApiResponse } from 'src/api-response/api-response';
import { AddTablesDto } from './dto/add-tables.dto';
import { RestourantTables } from './entities/restourant-tables.entity';
import { WorkingTime } from './dto/working-time.dto';
import { RestourantWorkingHours } from './entities/restourant-working-hours.entity';
import { AddWorkingTimesDto } from './dto/add-working-times.dto';
import { AddNonWorkingDaysDto } from './dto/add-non-working-days.dto';
import { NonWorkingDays } from './entities/non-working-days.entity';
import { getOpeningDetails } from 'src/_functions/check-times';
import { RestourantInfo } from './dto/restourant-info.dto';
import { DayOfWeek } from 'src/utility/entities/day-of-week.entity';
import { FindAvailableTablesDto } from './dto/find-available-tables.dto';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Injectable()
export class RestourantService {
    constructor(
        @InjectRepository(Restourant)
        private readonly restourantRepository: Repository<Restourant>,
        @InjectRepository(RestourantTables)
        private readonly restourantTablesRepository: Repository<RestourantTables>,
        @InjectRepository(RestourantWorkingHours)
        private readonly restourantWorkingHoursRepository: Repository<RestourantWorkingHours>,
        @InjectRepository(NonWorkingDays)
        private readonly restourantNonWorkingDaysRepository: Repository<NonWorkingDays>,
        @InjectRepository(DayOfWeek)
        private readonly dayOfWeekRepository: Repository<DayOfWeek>
    ) { }

    // get short info about all restaurants from city with :id
    async findAllRestourants(cityId?: number, restaurantId?: number): Promise<ApiResponse> {
        const apiResponse = new ApiResponse();
        let options: any = {
            // select: ["name", "address", "name", "address", "name", "address",],
            relations: ['city', 'nonWorkingDays', 'restourantTables', 'restourantWorkingHours']
        };
        if (restaurantId !== undefined) {
            options = { ...options, where: { id: restaurantId } };
        } else if (cityId !== undefined) {
            options = { ...options, where: { cityId: cityId } };
        }
        const daysOfWeek = await this.dayOfWeekRepository.find();
        const restourantsInfo = await this.restourantRepository.find(options);
        let response: RestourantInfo[] = [];
        const timeWithTimezone = new Date().toLocaleString();
        restourantsInfo.forEach(ri => {
            const restourantInfo = new RestourantInfo();
            restourantInfo.id = ri.id;
            restourantInfo.name = ri.name;
            restourantInfo.city = ri.city.name;
            restourantInfo.address = ri.address;
            restourantInfo.openingDetails = getOpeningDetails(
                new Date(timeWithTimezone),
                ri.restourantWorkingHours,
                ri.nonWorkingDays,
                daysOfWeek,
                false
            );
            restourantInfo.nonWorkingDays = ri.nonWorkingDays;
            restourantInfo.workingTimes = ri.restourantWorkingHours;
            restourantInfo.tables = ri.restourantTables;
            response = [...response, restourantInfo];
        })
        apiResponse.data = response;
        return Promise.resolve(apiResponse);
    }

    async findManagersRestaurant(id: number): Promise<Restourant> {
        return this.restourantRepository.findOne({ where: { managerId: id } });

    }

    async addRestourant(addRestourant: AddRestourant, managerId: number): Promise<ApiResponse> {
        const apiResponse = new ApiResponse();
        try {
            const restourantToAdd = new Restourant();
            restourantToAdd.managerId = managerId;
            restourantToAdd.name = addRestourant.name;
            restourantToAdd.address = addRestourant.address;
            restourantToAdd.description = addRestourant.description;
            restourantToAdd.cityId = addRestourant.cityId;

            const nameTaken = await this.restourantRepository.findOne({ where: { name: addRestourant.name } });
            if (nameTaken) {
                apiResponse.status = 'error';
                apiResponse.statusCode = -3101;
                apiResponse.message = 'Restourant name is already taken!';
            }
            else {
                const addedRestourant = await this.restourantRepository.save(restourantToAdd);
                apiResponse.data = addedRestourant; // success
            }
        }
        catch (err) {
            apiResponse.status = 'error';
            apiResponse.statusCode = -3100;
            apiResponse.message = err.message;
        }
        finally {
            return Promise.resolve(apiResponse);
        }
    }

    async findAvailableTables(findAvailableTablesDto: FindAvailableTablesDto): Promise<ApiResponse> {
        const apiResponse = new ApiResponse();

        // prvo proveriti da li restoran radi u datom vremenu
        const date = new Date(findAvailableTablesDto.reservationDate);
        const hh = parseInt(findAvailableTablesDto.fromTime.split(":")[0]);
        const mm = parseInt(findAvailableTablesDto.fromTime.split(":")[1]);

        const timeToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hh, mm);

        const daysOfWeek = await this.dayOfWeekRepository.find();
        const options: any = {
            relations: ['nonWorkingDays', 'restourantWorkingHours']
        };
        const restourantInfo = await this.restourantRepository.findOne(findAvailableTablesDto.restourantId, options);
        const openingDetails = getOpeningDetails(
            new Date(timeToCheck),
            restourantInfo.restourantWorkingHours,
            restourantInfo.nonWorkingDays,
            daysOfWeek,
            false
        );
        if (!openingDetails.isOpened) { // zatvoren
            apiResponse.data = {
                isOpened: false,
                message: "Restoran je u izabranom vrmenu zatvoren.",
                tables: []
            };
            return Promise.resolve(apiResponse);
        }

        const reservedTables = await getRepository(RestourantTables)
            // dohvataju se svi rezervisani stolovi u zeljenom trenutku rezervacije
            .createQueryBuilder("tables")
            .innerJoinAndSelect("tables.reservations", "reservation", "tables.restourantId = :id", { id: findAvailableTablesDto.restourantId })
            .where("reservation.statusId = :statusId", { statusId: 2 }) // odobrena
            .andWhere("reservation.fromTime <= :fromTime", { fromTime: findAvailableTablesDto.fromTime }) // nije odobrena
            .andWhere("reservation.untillTime >= :fromTime", { fromTime: findAvailableTablesDto.fromTime })
            .andWhere("reservation.reservationDate = :date", { date: findAvailableTablesDto.reservationDate })
            .select("tables.id")
            .getMany();

        let arrayWithIdsOfReservedTables = [];

        reservedTables.forEach(rt => arrayWithIdsOfReservedTables = [...arrayWithIdsOfReservedTables, rt.id]);
        console.log(arrayWithIdsOfReservedTables);
        if (arrayWithIdsOfReservedTables.length === 0) {
            arrayWithIdsOfReservedTables = ['asd']; // u slucaju da je prazan niz puca linija sa NOT IN()->zato stavljamo bilo sta sto ne moze nikada biti id
        }
        // dohvataju se svi raspolozivi stolovi u zeljenom trenutku
        const restourantTables = await getRepository(RestourantTables)
            .createQueryBuilder("tables")
            .innerJoinAndSelect("tables.description", "description")
            .where("tables.restourantId = :id", { id: findAvailableTablesDto.restourantId })
            .andWhere("tables.id NOT IN (:...reserved)", { reserved: arrayWithIdsOfReservedTables })
            .getMany();

        const reservedTablesLater = await getRepository(RestourantTables)
            // dohvataju se svi rezervisani stolovi koji imaju rezervaciju kasnije tog dana
            .createQueryBuilder("tables")
            .innerJoinAndSelect("tables.reservations", "reservation", "tables.restourantId = :id", { id: findAvailableTablesDto.restourantId })
            .where("reservation.statusId = :statusId", { statusId: 2 }) // odobrena
            .andWhere("reservation.fromTime > :fromTime", { fromTime: findAvailableTablesDto.fromTime }) // nije odobrena
            .andWhere("reservation.reservationDate = :date", { date: findAvailableTablesDto.reservationDate })
            .getMany();

        console.log(restourantTables);
        console.log(reservedTablesLater);

        // prolazak kroz sve slobodne stolove->prolazak kroz sve rezervisane kasnije->trazenje prve sledece rezervacije i po potrebi azuriranje maxHrsAvailable polja
        restourantTables.forEach(rt => {
            reservedTablesLater.forEach(rtl => {
                if (rt.id === rtl.id) {
                    const reservationFromTimeInMins = parseInt(findAvailableTablesDto.fromTime.split(":")[0]) * 60 + parseInt(findAvailableTablesDto.fromTime.split(":")[1]);
                    let fromTimeReservedTable: number = null; // vreme pocetka prve sledece rezervacije
                    // prodji kroz sve rezervacije datog stola i nadju najblizu ovoj rezervaciji po vremenu
                    rtl.reservations.forEach(res => {
                        const fromTimeReservedTableInMins = parseInt(res.fromTime.split(":")[0]) * 60 + parseInt(res.fromTime.split(":")[1]);
                        if (reservationFromTimeInMins < fromTimeReservedTableInMins && (!fromTimeReservedTable || fromTimeReservedTableInMins < fromTimeReservedTable)) {
                            fromTimeReservedTable = fromTimeReservedTableInMins;
                        }
                    });
                    if (fromTimeReservedTable !== null) {
                        const differnceInHrs = (fromTimeReservedTable - reservationFromTimeInMins) / 60;
                        console.log(differnceInHrs)
                        if (rt.maxHoursAvailable > differnceInHrs) {
                            rt.maxHoursAvailable = differnceInHrs;
                        }
                    }
                }
            })
        })
        apiResponse.data = {
            isOpened: true,
            tables: restourantTables
        };
        //apiResponse.data = restourantTables;
        return Promise.resolve(apiResponse);
    }

    async addTables(addTablesDto: AddTablesDto): Promise<ApiResponse> {
        const apiResponse = new ApiResponse();
        try {
            let tablesToAdd: RestourantTables[] = []; // tablesToAdd niz koji se ubacuje u bazu, pre toga ga je potrebno popuniti podacima
            addTablesDto.tables.forEach(table => { // punjenje niza tablesToAdd
                const newTable = new RestourantTables();
                newTable.restourantId = table.restourantId;
                newTable.tableNumber = table.tableNumber;
                newTable.capacity = table.capacity;
                newTable.descriptionId = table.descriptionId;
                newTable.maxHoursAvailable = table.maxHoursAvailable;
                tablesToAdd = [...tablesToAdd, newTable];
            });
            const addedTables = await this.restourantTablesRepository.save(tablesToAdd);
            apiResponse.data = addedTables; // success
        }
        catch (err) {
            apiResponse.status = 'error';
            apiResponse.statusCode = -3100;
            apiResponse.message = err.message;
        }
        finally {
            return Promise.resolve(apiResponse);
        }
    }

    async addWorkingTime(addWorkingTimesDto: AddWorkingTimesDto): Promise<ApiResponse> {
        const apiResponse = new ApiResponse();
        try {
            let workingHoursToAdd: RestourantWorkingHours[] = []; // workingHoursToAdd niz koji se ubacuje u bazu, pre toga ga je potrebno popuniti podacima
            addWorkingTimesDto.workingTimes.forEach(wt => { // punjenje niza workingHoursToAdd
                const newWorkingHour = new RestourantWorkingHours();
                newWorkingHour.restourantId = wt.restourantId;
                newWorkingHour.openingTime = wt.openingTime;
                newWorkingHour.closingTime = wt.closingTime;
                newWorkingHour.dayOfWeekId = wt.dayOfWeekId;
                if (wt.isWorking !== undefined) {
                    newWorkingHour.isWorking = wt.isWorking;
                }
                workingHoursToAdd = [...workingHoursToAdd, newWorkingHour];
            });
            const addedWorkingHours = await this.restourantWorkingHoursRepository.save(workingHoursToAdd);
            apiResponse.data = addedWorkingHours; // success
        }
        catch (err) {
            apiResponse.status = 'error';
            apiResponse.statusCode = -3100;
            apiResponse.message = err.message;
        }
        finally {
            return Promise.resolve(apiResponse);
        }
    }

    async addNonWorkingDays(addNonWorkingDaysDto: AddNonWorkingDaysDto): Promise<ApiResponse> {
        const apiResponse = new ApiResponse();
        try {
            let nonWorkingDaysToAdd: NonWorkingDays[] = []; // workingHoursToAdd niz koji se ubacuje u bazu, pre toga ga je potrebno popuniti podacima
            addNonWorkingDaysDto.nonWorkingDays.forEach(nwd => { // punjenje niza workingHoursToAdd
                const newNonWorkingDay = new NonWorkingDays();
                newNonWorkingDay.restaurantId = nwd.restourantId;
                newNonWorkingDay.descriptionId = nwd.descriptionId;
                newNonWorkingDay.date = nwd.date;
                if (nwd.userDescription != undefined) {
                    newNonWorkingDay.userDescription = nwd.userDescription;
                }
                nonWorkingDaysToAdd = [...nonWorkingDaysToAdd, newNonWorkingDay];
            });
            const addedNonWorkingDays = await this.restourantNonWorkingDaysRepository.save(nonWorkingDaysToAdd);
            apiResponse.data = addedNonWorkingDays; // success
        }
        catch (err) {
            apiResponse.status = 'error';
            apiResponse.statusCode = -3100;
            apiResponse.message = err.message;
        }
        finally {
            return Promise.resolve(apiResponse);
        }
    }
}
