import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
  imports: [LoggingModule],
  controllers: [BookmarkController],
  providers: [BookmarkService]
})
export class BookmarkModule {}
