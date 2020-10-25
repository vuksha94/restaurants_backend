import { JwtDataUserDto } from 'src/auth/dto/jwt-data-user.dto';

export class JwtDataDto {
  jwtData: JwtDataUserDto;
  iat: number;
  exp: number;
}
