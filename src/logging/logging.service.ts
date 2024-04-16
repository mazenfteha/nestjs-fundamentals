import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoggingMessage } from "./logging.schema";

@Injectable()
export class LoggingService {
    constructor(@InjectModel(LoggingMessage.name) private loggingUserModel: Model<LoggingMessage>) { }

    async createLogEntry(logEntry: LoggingMessage): Promise<LoggingMessage> {
        const newLogEntry = new this.loggingUserModel(logEntry);
        return newLogEntry.save();
    }
}