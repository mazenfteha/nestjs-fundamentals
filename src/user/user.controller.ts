import { Body, Controller, Get, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { LoggingInterceptor } from 'src/Interceptors/logging.Interceptor';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(LoggingInterceptor)
@UseGuards(JwtGuard)
@Controller('api/v1/users')
export class UserController {
    constructor(private userService: UserService){}
    @UseInterceptors(CacheInterceptor)
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    @Patch('me/edit')
    editUser(
        @GetUser('id') userId: number,
        @Body() dto: EditUserDto
    ){
        return this.userService.editUser(userId, dto)
    }
}
