import { Injectable } from '@nestjs/common';
import { UserEntity } from './users.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { v4 as uuid } from 'uuid'

@Injectable()
export class UserService {
    private users: UserEntity[] = []

    findUsers(): UserEntity[] {
        return this.users;
    }

    findUserById(id: string): UserEntity {
        const user : UserEntity = this.users.find((user) => user.id === id);
        return user;
    }

    createUser(createUserDto: CreateUserDto): UserEntity {
                // DTO => data transefer object
                const newUser : UserEntity = {
                    ...createUserDto,
                    id: uuid(),
                }
                this.users.push(newUser)
                return newUser;
    }

    updateUser(id: string, updateUserDto: UpdateUserDto): UserEntity{
        // 1) find the user
        const index = this.users.findIndex((user) => user.id === id )
        //2) update the element
        this.users[index] = {
            ...this.users[index],
            ...updateUserDto,
        }
        return this.users[index];
    }

    deleteUser(id: string): void{
        this.users = this.users.filter((user) => user.id !== id )
    }
}
