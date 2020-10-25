import { Controller, Body, Req, Post } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ManagerService } from 'src/manager/manager.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiResponse } from 'src/api-response/api-response';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtDataUserDto } from './dto/jwt-data-user.dto';
import { JwtSecret } from 'config/jwt.secret';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Manager } from 'src/manager/entities/manager.entity';
import { RestourantService } from 'src/restourant/restourant.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly managerService: ManagerService,
        private readonly restourantService: RestourantService,
    ) { }

    @Post('manager/login')
    async loginManager(
        @Body() loginUserDto: LoginUserDto,
        @Req() req: Request,
    ): Promise<ApiResponse> {
        const manager = await this.managerService.findByEmail(loginUserDto.email);
        const apiResponse = new ApiResponse();
        if (!manager) { // if no manager is found with email, send error ApiResponse
            apiResponse.status = 'error';
            apiResponse.statusCode = -3001;
            apiResponse.message = 'Wrong email!';
            return Promise.resolve(apiResponse);
        }
        const check = await bcrypt.compare(
            loginUserDto.password,
            manager.password
        );
        if (!check) { // if password isn't correct, send error ApiResponse
            apiResponse.status = 'error';
            apiResponse.statusCode = -3002;
            apiResponse.message = 'Wrong password!';
            return Promise.resolve(apiResponse);
        }

        const managersRestaurant = await this.restourantService.findManagersRestaurant(manager.id);
        // login succes -> create and send back JWT token
        const jwtData = new JwtDataUserDto();
        jwtData.id = manager.id;
        jwtData.email = manager.email;
        jwtData.ip = req.ip;
        jwtData.ua = req.headers['user-agent'];
        //jwtData.restaurantId = managersRestaurant ? managersRestaurant.id : null;
        const token = await jwt.sign({ jwtData }, JwtSecret, { expiresIn: '2d' });
        const responseData = new LoginResponseDto();
        responseData.id = manager.id;
        responseData.email = manager.email;
        responseData.token = token;
        responseData.restaurantId = managersRestaurant ? managersRestaurant.id : null;
        apiResponse.data = responseData;

        return Promise.resolve(apiResponse);
    }

    @Post('manager/register')
    async registerManager(
        @Body() registerUserDto: RegisterUserDto,
        @Req() req: Request,
    ): Promise<ApiResponse> {
        const apiResponse = new ApiResponse();
        try {
            if (registerUserDto.password !== registerUserDto.confirmPassword) {
                apiResponse.status = 'error';
                apiResponse.statusCode = -3003;
                apiResponse.message = 'Confirmed passwords aren\'t same!';
                return Promise.resolve(apiResponse);
            }

            const managerWithSameEmail = await this.managerService.findByEmail(registerUserDto.email);
            if (managerWithSameEmail) {
                apiResponse.status = 'error';
                apiResponse.statusCode = -3004;
                apiResponse.message = 'Email already taken!';
                return Promise.resolve(apiResponse);
            }

            const hash = bcrypt.hashSync(registerUserDto.password, 5);

            const managerToInsert = new Manager();
            managerToInsert.name = registerUserDto.name;
            managerToInsert.lastName = registerUserDto.lastName;
            managerToInsert.email = registerUserDto.email;
            managerToInsert.password = hash;
            const insertedManager = await this.managerService.insertManager(managerToInsert);
            const { id, name, lastName, email } = insertedManager;
            apiResponse.data = { id, name, lastName, email };
            return Promise.resolve(apiResponse);
        }
        catch {
            apiResponse.status = 'error';
            apiResponse.statusCode = -2000;
            apiResponse.message = 'Server error!';
            return Promise.resolve(apiResponse);
        }
    }

}
