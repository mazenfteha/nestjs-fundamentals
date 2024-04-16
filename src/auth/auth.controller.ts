import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto';
import { GetCurrentUserId, GetUser } from './decorator';
import { JwtGuard } from './guard';
import { RtGuard } from './guard';
import { LoggingInterceptor } from 'src/Interceptors/logging.Interceptor';




@Controller('api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: LoginDto) {
        return this.authService.signin(dto);
    }
    @UseInterceptors(LoggingInterceptor)
    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@GetCurrentUserId() userId: number){
        return this.authService.logout(userId);
    }

    @UseInterceptors(LoggingInterceptor)
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(
        @GetCurrentUserId() userId: number,
        @GetUser('refreshToken') refreshToken: string,
    ) {
        return this.authService.refreshToken(userId, refreshToken);
    }
}
