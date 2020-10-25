import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ManagerModule } from 'src/manager/manager.module';
import { RestourantModule } from 'src/restourant/restourant.module';

@Module({
  imports: [ManagerModule, RestourantModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
