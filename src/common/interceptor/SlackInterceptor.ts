import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { IncomingWebhook } from '@slack/client';
import { of } from 'rxjs';
import * as Sentry from '@sentry/minimal';

@Injectable()
export class SlackInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        Sentry.captureException(error);
        const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK);
        (async () => {
          try {
            await webhook.send({
              attachments: [
                {
                  color: 'danger',
                  text: process.env.NODE_ENV === 'dev' ? '🎈dev' : '🚨prod',
                  fields: [
                    {
                      title: `Request Message: ${error.message}`,
                      value: error.stack,
                      short: false,
                    },
                  ],
                  ts: Math.floor(new Date().getTime() / 1000).toString(),
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        })();
        context.switchToHttp().getResponse().statusCode = error.status
          ? error.status
          : 500;
        return of({
          statusCode: error.status ? error.status : 500,
          success: false,
          error: true,
          timestamp: new Date().toISOString(),
          data: error.status
            ? error.message
            : process.env.NODE_ENV === 'dev'
            ? error.message
            : 'internal server error',
        });
      }),
    );
  }
}
