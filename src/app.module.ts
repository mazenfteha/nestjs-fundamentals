import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggingMiddleware } from './middlewares/logging.middleware';

@Module({
  imports: [
        ConfigModule.forRoot({
          isGlobal: true
        }),
        AuthModule,
        UserModule,
        BookmarkModule,
        PrismaModule,
      ],
  providers:[Logger]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*')
  }
}
