import { ForbiddenException, Injectable,} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma : PrismaService,
        private jwt: JwtService,
        private config: ConfigService
        ){}


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
            return this.signToken(user.id, user.email)
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
        return this.signToken(user.id, user.email)
    }

    async signToken(userId: number, email: string) : Promise<{access_token : string}>{
        const payload = {
            userId: userId,
            email: email
        }

        const secret = this.config.get('JWT_SECRET')
        const token = await this.jwt.signAsync(payload, {
            secret: secret,
            expiresIn: '15m'
        })

        return {
            access_token : token
        } 
    }
}
