import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager } from './entities/manager.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/api-response/api-response';

@Injectable()
export class ManagerService {
    constructor(
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>
    ) { }

    async findByEmail(email: string): Promise<Manager> {
        return await this.managerRepository.findOne({
            where: { email: email },
            relations: ["restourants"]
        });
    }
    async insertManager(managerToInsert: Manager): Promise<Manager> {
        return await this.managerRepository.save(managerToInsert);
    }

    async getManagersRestourant(id: string): Promise<ApiResponse> {
        const manager = await this.managerRepository.findOne({
            where: { id: id },
            relations: ["restourants"]
        });
        const apiResponse = new ApiResponse();
        apiResponse.data = manager.restourants.length ? manager.restourants[0] : null;
        return Promise.resolve(apiResponse);
    }
}
