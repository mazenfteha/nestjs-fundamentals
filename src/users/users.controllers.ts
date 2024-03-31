/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe, } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './users.entity';
import { v4 as uuid } from 'uuid'


@Controller('api/v1/users')
export class UsersController {
    private users: UserEntity[] = []
    @Get()
    find(): UserEntity[] {
        return this.users;
    }

    @Get('/:id')
    findOne(@Param("id", ParseUUIDPipe) id : string) {
        const user : UserEntity = this.users.find((user) => user.id === id);
        return user;
    }
    @UsePipes(ValidationPipe)
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        // DTO => data transefer object
        const newUser : UserEntity = {
            ...createUserDto,
            id: uuid(),
        }
        this.users.push(newUser)
        return newUser;
    }

    @Patch('/:id')
    update(@Param('id', ParseUUIDPipe) id : string, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
        // 1) find the user
        const index = this.users.findIndex((user) => user.id === id )
        //2) update the element
        this.users[index] = {
            ...this.users[index],
            ...updateUserDto,
        }
        return this.users[index];
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id',ParseUUIDPipe) id : string) {
        this.users = this.users.filter((user) => user.id !== id )
    }
    
}