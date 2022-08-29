import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { JwtStrategy } from 'src/util/jwt/jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';
import { userMulterOption } from '../../util/multer/multer';
import * as dotenv from 'dotenv';
import { HttpModule } from '@nestjs/axios';
import { FcmModule } from '../fcm/fcm.module';

dotenv.config();
@Module({
  imports: [
    PrismaModule,
    PassportModule,
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    MulterModule.register(userMulterOption),
    FcmModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
