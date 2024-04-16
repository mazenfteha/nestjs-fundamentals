import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { LoggingService } from "src/logging/logging.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);
    constructor(private readonly loggingService: LoggingService){}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const userAgent = request.get('user-agent') || '';
        const userId = request.user.id || 'unknown';
        const userEmail = request.user.email
        const { ip, method, path: url } = request;
        
        const logMessage = {
            method,
            url,
            userAgent,
            ip,
            user: {
                id: userId,
                email: userEmail
            },
            context: context.getClass().name,
            handler: context.getHandler().name
        };

        this.logger.log(JSON.stringify(logMessage, null, 2));

        // Save log entry to MongoDB
        this.loggingService.createLogEntry(logMessage).catch(err => {
            this.logger.error('Failed to save log entry', err);
        });
        
        return next.handle()
    }
}