import { Injectable } from '@nestjs/common';
// import { UsersService } from '../users/users.service';
import { JwtPayload } from './interface/jwt-payload.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    // constructor(private readonly usersService: UsersService) {}

    async login(user: JwtPayload): Promise<string> {
        if (this.validateUser(user)) {
            return jwt.sign(user, 'secretKey', {expiresIn: 3600});
        }
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        // return await this.usersService.findOneByToken(token);
        if (payload && payload.password === '12345') {
            return await {username: 'admin', password: '12345'};
        }else{
            return false
        }
    }
}
