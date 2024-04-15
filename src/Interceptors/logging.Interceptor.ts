import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger = new Logger(LoggingInterceptor.name)){}
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
        return next.handle()
    }
}