import { NestFactory } from '@nestjs/core';
import { AppModule } from './domain/app.module';
import * as morgan from 'morgan';
import * as hpp from 'hpp';
import helmet from 'helmet';
import { RedisClient } from './util/redis/redis';
import { SuccessResInterceptor } from './common/interceptor/SuccessResInterceptor';
import * as Sentry from '@sentry/node';
import { SlackInterceptor } from './common/interceptor/SlackInterceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { GlobalExceptionFilter } from './common/filter/GlobalException';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    Sentry.init({
      dsn: process.env.SENTRY_DSN,
    });

    app.enableCors();
    app.use(helmet());
    app.use(hpp());
    app.use(morgan('combined'));
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new SlackInterceptor());
    app.useGlobalInterceptors(new SuccessResInterceptor());

    if (process.env.NODE_ENV === 'dev') {
      const config = new DocumentBuilder()
        .setTitle('looknote api swagger')
        .setDescription('looknote API test server')
        .setVersion('0.1.16')
        .addBearerAuth({
          type: 'http',
          scheme: 'bearer',
          name: 'JWT',
          in: 'header',
        })
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);
    }

    await RedisClient.connect();
    RedisClient.on('error', (error) => {
      console.log(error);
    });

    const adminConfig: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    await admin.initializeApp({
      credential: admin.credential.cert(adminConfig),
      databaseURL: process.env.FIREBASE_DATABASE,
    });

    await app.listen(process.env.PORT);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
