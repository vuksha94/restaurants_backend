import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from './entities/manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Manager])],
  providers: [ManagerService],
  controllers: [ManagerController],
  exports: [TypeOrmModule, ManagerService]
})
export class ManagerModule { }
