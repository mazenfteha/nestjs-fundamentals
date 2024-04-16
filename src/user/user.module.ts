import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
  imports: [LoggingModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
