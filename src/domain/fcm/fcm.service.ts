import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmService {
  constructor(private readonly prisma: PrismaService) {}

  async setUserIdAndFcmToken(user_id: number, device_token: string) {
    const payload = {};
    payload[user_id] = device_token;
    await admin
      .database()
      .ref(process.env.NODE_ENV === 'dev' ? 'test' : 'prod')
      .update(payload, (error) => {
        if (error) {
          throw new HttpException(
            'set user fcm token error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
    return 'fulfilled';
  }

  async getFcmToken(user_id: number): Promise<string> {
    const token = await admin
      .database()
      .ref(process.env.NODE_ENV === 'dev' ? 'test' : 'fcm_token')
      .child(`${user_id}`)
      .get();
    return token.val();
  }

  async sendPush(to: number, body) {
    const token = await this.getFcmToken(to);
    const message = {
      notification: {
        title: 'LookNote',
        body,
      },
      token,
    };
    return admin
      .messaging()
      .send(message)
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((error) => {
        if (error) {
          throw new HttpException(
            'send push fcm error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
  }

  async sendPushAll(body, manager) {
    const exManager = await this.prisma.manager.findUnique({
      where: {
        manager_id: Number(manager.manager_id),
      },
    });
    if (!exManager) {
      throw new HttpException(
        `manager unknown: ${JSON.stringify(manager)}`,
        HttpStatus.FORBIDDEN,
      );
    }
    const message = {
      notification: {
        title: 'LookNote',
        body,
      },
      topic: 'all',
    };
    return admin
      .messaging()
      .send(message)
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((error) => {
        console.log(error);
        throw new HttpException(
          'send push all fcm error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }
}
