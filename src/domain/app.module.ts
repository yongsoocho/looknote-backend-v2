import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { MyNoteModule } from './mynote/mynote.module';
import { UserModule } from './user/user.module';
import { RavenModule } from 'nest-raven';
import { ConfigModule } from '@nestjs/config';
import { CoinModule } from './coin/coin.module';
import { FcmModule } from './fcm/fcm.module';

@Module({
  imports: [
    MyNoteModule,
    PostModule,
    UserModule,
    CoinModule,
    FcmModule,
    RavenModule,
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
