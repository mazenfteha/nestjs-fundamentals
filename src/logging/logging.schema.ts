import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema({ timestamps: true, versionKey: false })
export class LoggingMessage {
    @Prop({ required: true })
    method: string;

    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    userAgent: string;

    @Prop({ required: true })
    ip: string;

    @Prop({ required: true, type: Object })
    user: {
        id: string;
        email: string;
    };

    @Prop({ required: true })
    context: string;

    @Prop({ required: true })
    handler: string;
}

export const LoggingMessageSchema = SchemaFactory.createForClass(LoggingMessage);