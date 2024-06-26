import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import {
    ExtractJwt,
    Strategy,
} from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../types/jwtPayload.types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy,'jwt-refresh',) {
    constructor(
        config: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest:
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: config.get('RT_SECRET'),
                passReqToCallback: true,
        });
    }
    
    validate(req: Request, payload:JwtPayload){
    const refreshToken = req
        ?.get('authorization')
        ?.replace('Bearer', '')
        .trim();
        return {
            ...payload,
            refreshToken
        }
    }
}