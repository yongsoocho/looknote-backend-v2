import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { FcmController } from './fcm.controller';

@Module({
  imports: [PrismaModule],
  controllers: [FcmController],
  providers: [FcmService],
  exports: [FcmService],
})
export class FcmModule {}
