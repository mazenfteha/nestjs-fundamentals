import { ForbiddenException, Injectable, } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwtPayload.types';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) { }


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
            const tokens = await this.signToken(user.id, user.email)
            await this.updateRtHash(user.id, tokens.refresh_token)
            return tokens;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
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
        if (!user) {
            throw new ForbiddenException(`User with this email ${email} does not exist`)
        }
        // compare password
        const isMatch = await argon.verify(
            user.hash,
            dto.password
        );
        if (!isMatch) {
            throw new ForbiddenException('Credentials inccorect')
        }
        const tokens = await this.signToken(user.id, user.email)
        await this.updateRtHash(user.id, tokens.refresh_token)
        return tokens;
    }

    async signToken(userId: number, email: string) {
        const jwtPayload: JwtPayload = {
            userId: userId,
            email: email
        }

        const accessTokenSecret = this.config.get('JWT_SECRET')
        const refreshTokenSecret = this.config.get('RT_SECRET')


        const [at, rt] = await Promise.all([
            this.jwt.signAsync(jwtPayload, {
                secret: accessTokenSecret,
                expiresIn: '15m',
            }),
            this.jwt.signAsync(jwtPayload, {
                secret: refreshTokenSecret,
                expiresIn: '7d',
            }),
        ]);


        return {
            access_token: at,
            refresh_token: rt,
        }
    }

    async updateRtHash(userId: number, refreshToken: string) {
        const hash = await argon.hash(refreshToken);
        await this.prisma.user.update({
            where:{
                id:userId
            },
            data:{
                hashedRt: hash
            }
        })
    }

    async logout(userId: number) {
        /*
        UPDATE "User"
        SET "hashedRt" = NULL
        WHERE "id" = userId AND "hashedRt" IS NOT NULL;
        */
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: {
                    not: null
                },
            },
            data: {
                hashedRt: null
            }
        })
        return {
            message: 'Successfully logged out'
        }
    }

    async refreshToken(userId: number , refreshToken: string) {
        //console.log(refreshToken) // ?
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        //console.log(userId)
        if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

        const isRtMatches = await argon.verify(user.hashedRt, refreshToken);
        //console.log(isRtMatches)
        if (!isRtMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.signToken(user.id, user.email)
        await this.updateRtHash(user.id, tokens.refresh_token)
        return tokens;
    }
}
