import { ForbiddenException, Injectable,} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(private prisma : PrismaService){}


    async signup(dto: AuthDto) {
        try {
            // generate the password hash
            const hash = await argon.hash(dto.password)
            // save the new user in db
            const user = await this.prisma.user.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    hash: hash
                }
            })
            delete user.hash
            //return the saved user
            return user;
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002') {
                    throw new ForbiddenException('Email is alredy in use')
                }
            }
            throw error
        }
    }

    async signin(dto: LoginDto) {
        // find the user by email
        const email = dto.email
        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        })
        // if user does not throw exception
        if(!user) {
            throw new ForbiddenException(`User with this email ${email} does not exist`)
        }
        // compare password
        const isMatch = await argon.verify(
            user.hash, 
            dto.password
            );
        if(!isMatch){
            throw new ForbiddenException('Credentials inccorect')
        }
        delete user.hash
        return user
        // send back the user
    }
}
