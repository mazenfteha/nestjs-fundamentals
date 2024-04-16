import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { LoggingMessage, LoggingMessageSchema } from "./logging.schema";
import { LoggingService } from "./logging.service";


@Module({
    imports:[
        MongooseModule.forFeature([{name: LoggingMessage.name, schema: LoggingMessageSchema}])
    ],
    providers: [LoggingService],
    exports: [LoggingService],
})

export class LoggingModule {}