import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { postsMulterOption } from 'src/util/multer/multer';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { FcmModule } from '../fcm/fcm.module';
import { CoinModule } from '../coin/coin.module';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register(postsMulterOption),
    FcmModule,
    CoinModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
