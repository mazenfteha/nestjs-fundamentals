import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy, RtStrategy } from "./strategy";
import { LoggingModule } from "src/logging/logging.module";

@Module({
    imports:[JwtModule.register({}), LoggingModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RtStrategy]
})
export class AuthModule {}


