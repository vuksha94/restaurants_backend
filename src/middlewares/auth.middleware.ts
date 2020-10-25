import {
  NestMiddleware,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtSecret } from 'config/jwt.secret';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { JwtDataDto } from './dto/jwt-data.dto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }
    const token = authorizationHeader.toString().split(' ')[1];
    try {
      const data = jwt.verify(token, JwtSecret) as JwtDataDto;

      if (data.jwtData.ip !== req.ip) {
        throw new HttpException('Token not valid', HttpStatus.UNAUTHORIZED);
      }
      if (data.jwtData.ua !== req.headers['user-agent']) {
        throw new HttpException('Token not valid', HttpStatus.UNAUTHORIZED);
      }
    } catch (err) {
      throw new HttpException('Token not valid', HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
