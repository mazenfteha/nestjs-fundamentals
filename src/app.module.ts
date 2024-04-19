import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggingModule } from './logging/logging.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
        ConfigModule.forRoot({
          isGlobal: true
        }),
        AuthModule,
        UserModule,
        BookmarkModule,
        PrismaModule,
        MongooseModule.forRootAsync({
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('MONGODB_URI'),
          }),
          inject: [ConfigService],
        }),
        LoggingModule,
        CacheModule.register({
          isGlobal: true,
          ttl: 6 * 10000
        })
      ],
  providers:[Logger]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*')
  }
}
