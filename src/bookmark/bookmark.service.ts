import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookMarkDto, EditBookMarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService){}

    async createBookmark(userId: number, dto: CreateBookMarkDto){
        try {
            const bookmark = await this.prisma.bookmark.create({
                data: {
                    userId,
                    title: dto.title,
                    description: dto.description,
                    link: dto.link
                }
            })
            const message = 'Bookmark successfully created'
            return { message, bookmark };
            
        } catch (error) {
            throw error
        }
    }


    async getBookMarks(userId: number){
        return await this.prisma.bookmark.findMany({
            where: {
                userId,
            }
        })
    }


    async getBookMarksById(userId: number, bookmarkId: number){
        return await this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId,
            }
        })
    }


    async editBookMarksById(userId: number, bookmarkId: number,dto: EditBookMarkDto){
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            }
        })

        if(!bookmark || bookmark.userId !== userId) throw new ForbiddenException('Access denied');

        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: {
                ...dto,
            },
        })
    }


    async deleteBookMarksById(userId: number, bookmarkId: number){
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            }
        })

        if(!bookmark || bookmark.userId !== userId) throw new ForbiddenException('Access denied');

        await this.prisma.bookmark.delete({
            where: {
                id: bookmarkId,
            }
        })

        return 'Bookmark has been successfully deleted'
    }
}
