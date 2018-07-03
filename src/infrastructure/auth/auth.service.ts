import { Injectable } from '@nestjs/common';
// import { UsersService } from '../users/users.service';
import { JwtPayload } from './interface/jwt-payload.interface';
import * as jwt from 'jsonwebtoken';
import { ConstsService } from '../../consts/consts.service';

@Injectable()
export class AuthService {
    // constructor(private readonly usersService: UsersService) {}
    constructor(private readonly constsService: ConstsService) {}

    async login(user: JwtPayload): Promise<string> {
        if (this.validateUser(user)) {
            return jwt.sign(user, 'secretKey', {expiresIn: 3600});
        }
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        // return await this.usersService.findOneByToken(token);
        let pass = await this.constsService.getPassword()
        if (payload && payload.password === pass) {
            return await {username: 'admin', password: pass};
        }else{
            return false
        }
    }
}
