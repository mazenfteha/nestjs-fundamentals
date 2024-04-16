import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator';
import { CreateBookMarkDto, EditBookMarkDto } from './dto';
import { LoggingInterceptor } from 'src/Interceptors/logging.Interceptor';

@UseInterceptors(LoggingInterceptor)
@UseGuards(JwtGuard)
@Controller('api/v1/bookmarks')
export class BookmarkController {
    constructor(private bookmarkService : BookmarkService){}

    @Post()
    createBookmark(
        @GetUser('id') userId: number,
        @Body() dto: CreateBookMarkDto
    ){
        return this.bookmarkService.createBookmark(userId, dto)
    }

    @Get()
    getBookMarks(@GetUser('id') userId: number){
        return this.bookmarkService.getBookMarks(userId)
    }

    @Get(':id')
    getBookMarksById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId:number
    ){
        return this.bookmarkService.getBookMarksById(userId, bookmarkId)
    }

    @Patch(':id')
    editBookMarksById(
        @GetUser('id') userId: number,
        @Body() dto: EditBookMarkDto,
        @Param('id', ParseIntPipe) bookmarkId:number
    ){
        return this.bookmarkService.editBookMarksById(userId, bookmarkId ,dto)
    }

    @Delete(':id')
    deleteBookMarksById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId:number
    ){
        return this.bookmarkService.deleteBookMarksById(userId, bookmarkId)
    }

}
