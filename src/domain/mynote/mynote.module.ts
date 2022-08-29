import { Module } from '@nestjs/common';
import { MyNoteController } from './mynote.controller';
import { MyNoteService } from './mynote.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { FcmModule } from '../fcm/fcm.module';
import { CoinModule } from '../coin/coin.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [PrismaModule, FcmModule, CoinModule, PostModule],
  controllers: [MyNoteController],
  providers: [MyNoteService],
  exports: [MyNoteService],
})
export class MyNoteModule {}
