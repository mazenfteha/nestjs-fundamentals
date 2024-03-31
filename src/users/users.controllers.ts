/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe, } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './users.entity';
import { UserService } from './user.service';



@Controller('api/v1/users')
export class UsersController {

    constructor(private readonly userService: UserService){}

    @Get()
    find(): UserEntity[] {
        return this.userService.findUsers()
    }

    @Get('/:id')
    findOne(@Param("id", ParseUUIDPipe) id : string) {
        return this.userService.findUserById(id)
    }


    @UsePipes(ValidationPipe)
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }

    @Patch('/:id')
    update(@Param('id', ParseUUIDPipe) id : string,
            @Body(ValidationPipe) updateUserDto: UpdateUserDto
        ) {
            return this.userService.updateUser(id, updateUserDto)
        }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id',ParseUUIDPipe) id : string) {
        return this.userService.deleteUser(id)
    }
    
}