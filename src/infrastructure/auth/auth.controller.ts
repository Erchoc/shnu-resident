import { Get, Post, Controller, UseGuards, Logger, Body } from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtPayload} from './interface/jwt-payload.interface';
import { AuthGuard} from '@nestjs/passport';

@Controller('user')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() user: JwtPayload): Promise<any> {
        let token = await this.authService.login(user)
        return {token:token,roles:['管理员']}
    }

    @Get('info')
    @UseGuards(AuthGuard('bearer'))
    info(): any {
        return {name: 'admin', avatar: 'http://shnu.edu.cn/tpl/login/user/logo.png', roles: ['管理员'], };
    }

    @Post('logout')
    logout(): boolean {
        return true;
    }

}
