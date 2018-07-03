import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {JwtStrategy} from './jwt.strategy';
import {AuthController} from './auth.controller';
import { ConstsModule } from '../../consts/consts.module';

@Module({
    imports: [ConstsModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
