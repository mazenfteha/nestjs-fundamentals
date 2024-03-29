/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';


@Controller('api/v1/users')
export class UsersController {
    @Get()
    find(): string[] {
        return ["Mazen", "Mohamed", "Fteha"];
    }

    @Get('/:username')
    findOne(@Param() username : string): string {
        return username;
    }

    @Post()
    create(@Body() userData: CreateUserDto):CreateUserDto {
        // DTO => data transefer object
        return userData;
    }

    @Patch('/:username')
    update(@Param() username : string, @Body() updateUserDto: UpdateUserDto) {
        return updateUserDto ;
    }

    @Delete('/:username')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param() username : string): string {
        return `Delete User ${username}`;
    }
    
}