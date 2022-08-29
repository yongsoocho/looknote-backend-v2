import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { decodedAppleIdToken, UserSelect } from '../../common/type/user.type';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { RedisClient } from '../../util/redis/redis';
import { mailer } from '../../util/mailer/mailer';
import { JwtUserType } from 'src/common/type/user.type';
import { emailRegex, nicknameRegex } from '../../common/regex/regex';
import jwtDecode from 'jwt-decode';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FcmService } from '../fcm/fcm.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly http: HttpService,
    private readonly fcmService: FcmService,
  ) {}

  async localUserJoin(createUserBody) {
    if (!emailRegex.test(createUserBody.email)) {
      throw new HttpException('email is not valid', HttpStatus.FORBIDDEN);
    }
    if (!nicknameRegex.test(createUserBody.nickname)) {
      throw new HttpException('nickname is not valid', HttpStatus.FORBIDDEN);
    }
    const isLocalUserInUse = await this.checkEmailIsInUse(
      createUserBody.email,
      'LOCAL',
    );
    if (isLocalUserInUse == 'inUse') {
      throw new HttpException('in use email', HttpStatus.CONFLICT);
    }
    const hash = await bcrypt.hash(createUserBody.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        ...createUserBody,
        password: hash,
        date_of_birth: createUserBody.date_of_birth
          ? Number(createUserBody.date_of_birth)
          : 19000101,
        coin: {
          create: {},
        },
      },
      select: UserSelect,
    });
    return {
      user: newUser,
      access_token: this.jwtService.sign(newUser),
    };
  }

  async loginWithApple(id_token: string) {
    const decoded_id_token: decodedAppleIdToken = await jwtDecode(id_token);
    if (
      decoded_id_token.email_verified === 'false' ||
      !decoded_id_token.email_verified
    ) {
      if (process.env.NODE_ENV === 'dev') {
        throw new HttpException(
          JSON.stringify(decoded_id_token),
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new HttpException(
          'apple token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const [user] = await this.prisma.user.findMany({
      where: {
        email: decoded_id_token.email,
        provider: 'APPLE',
      },
      select: UserSelect,
    });
    if (!user) {
      return 'user not found';
    }
    if (!user.active) {
      return 'user who have already left';
    }
    return {
      user,
      access_token: this.jwtService.sign(user),
    };
  }

  async joinWithApple(id_token: string, createSocialUserBody) {
    delete createSocialUserBody.id_token;
    const decoded_id_token: decodedAppleIdToken = await jwtDecode(id_token);
    if (
      decoded_id_token.email_verified === 'false' ||
      !decoded_id_token.email_verified
    ) {
      if (process.env.NODE_ENV === 'dev') {
        throw new HttpException(
          JSON.stringify(decoded_id_token),
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new HttpException(
          'apple token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    await this.checkEmailIsInUse(decoded_id_token.email, 'APPLE');
    const newUser = await this.prisma.user.create({
      data: {
        email: decoded_id_token.email,
        ...createSocialUserBody,
        date_of_birth: createSocialUserBody.date_of_birth
          ? Number(createSocialUserBody.date_of_birth)
          : 19000101,
        name: createSocialUserBody.name
          ? createSocialUserBody.name
          : '알수없음',
        provider: 'APPLE',
        sns_id: decoded_id_token.sub,
        coin: {
          create: {},
        },
      },
      select: UserSelect,
    });
    return {
      user: newUser,
      access_token: this.jwtService.sign(newUser),
    };
  }

  async loginWithKakao(access_token: string) {
    const data: any = await this.http
      .get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: `Bearer ${access_token}`,
        },
      })
      .pipe(
        map((res) => res.data),
        catchError(() => {
          throw new HttpException(
            `cannot get kakao profile`,
            HttpStatus.BAD_REQUEST,
          );
        }),
      )
      .toPromise();
    const [exUser] = await this.prisma.user.findMany({
      where: {
        email: data.kakao_account.email,
        provider: 'KAKAO',
      },
      select: UserSelect,
    });
    if (!exUser) {
      return 'user not found';
    }
    if (!exUser.active) {
      return 'user who have already left';
    }
    return {
      user: exUser,
      access_token: this.jwtService.sign(exUser),
    };
  }

  async joinWithKakao(access_token, createSocialUserBody) {
    delete createSocialUserBody.access_token;
    const data: any = await this.http
      .get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: `Bearer ${access_token}`,
        },
      })
      .pipe(
        map((res) => res.data),
        catchError(() => {
          throw new HttpException(
            'cannot get kakao profile',
            HttpStatus.BAD_REQUEST,
          );
        }),
      )
      .toPromise();
    await this.checkEmailIsInUse(data.kakao_account.email, 'KAKAO');
    const newUser = await this.prisma.user.create({
      data: {
        ...createSocialUserBody,
        email: data.kakao_account.email,
        name: data.kakao_account.name ? data.kakao_account.name : '알수없음',
        sns_id: String(data.id),
        date_of_birth: createSocialUserBody.date_of_birth
          ? Number(createSocialUserBody.date_of_birth)
          : 19000101,
        provider: 'KAKAO',
        coin: {
          create: {},
        },
      },
      select: UserSelect,
    });
    return {
      user: newUser,
      access_token: this.jwtService.sign(newUser),
    };
  }

  async localUserLogin(localLoginBody) {
    const [user] = await this.prisma.user.findMany({
      where: {
        email: localLoginBody.email,
        provider: 'LOCAL',
      },
      include: {
        coin: true,
      },
    });
    if (!user.active) {
      throw new HttpException(
        'user who have already left',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const isMatched = await bcrypt.compare(
      localLoginBody.password,
      user.password,
    );
    if (!isMatched) {
      throw new HttpException('invalid password', HttpStatus.NOT_FOUND);
    }
    delete user.password;
    delete user.sns_id;
    return {
      user,
      access_token: this.jwtService.sign(user),
    };
  }

  async localUserTokenReLogin(user: JwtUserType) {
    const exUser = await this.prisma.user.findUnique({
      where: {
        user_id: Number(user.user_id),
      },
      select: UserSelect,
    });
    return {
      user: exUser,
      access_token: this.jwtService.sign(exUser),
    };
  }

  async checkEmailIsInUse(email: string, provider) {
    const exUser = await this.prisma.user.findMany({
      where: {
        email,
        provider,
      },
    });
    if (!exUser.length) {
      return 'available';
    }
    throw new HttpException('inUse', HttpStatus.CONFLICT);
  }

  async checkNicknameIsInUse(nickname: string) {
    const exUser = await this.prisma.user.findUnique({
      where: {
        nickname,
      },
    });
    if (!exUser) {
      return 'available';
    } else {
      throw new HttpException('inUse', HttpStatus.CONFLICT);
    }
  }

  async sendEmailCode(email: string) {
    const isEmailInUsed = await this.checkEmailIsInUse(email, 'LOCAL');
    if (isEmailInUsed === 'inUse') {
      throw new HttpException('rejected', HttpStatus.CONFLICT);
    } else {
      const secreteCode = v4().slice(0, 6);
      const exCode = await RedisClient.get(`${email}_join_code`);
      if (exCode) {
        RedisClient.set(`${email}_join_code`, secreteCode);
        mailer(
          { code: secreteCode },
          {
            to: email,
            subject: '[LookNote] 재요청하신 인증번호를 안내드립니다.',
          },
        );
        return 'fulfilled';
      } else {
        RedisClient.set(`${email}_join_code`, secreteCode);
        mailer(
          { code: secreteCode },
          {
            to: email,
            subject: '[LookNote] 요청하신 인증번호를 안내드립니다.',
          },
        );
        return 'fulfilled';
      }
    }
  }

  async checkEmailCode(email: string, code: string) {
    const exCode = await RedisClient.get(`${email}_join_code`);
    if (exCode !== code) {
      throw new HttpException('rejected', HttpStatus.FORBIDDEN);
    }
    return 'fulfilled';
  }

  async sendPasswordCode(email) {
    const secreteCode = v4().slice(0, 6);
    const exCode = await RedisClient.get(`${email}_password_code`);
    if (exCode) {
      RedisClient.set(`${email}_password_code`, secreteCode);
      mailer(
        { code: secreteCode },
        {
          to: email,
          subject: '[LookNote] 재요청하신 인증번호를 안내드립니다.',
        },
      );
      return 'fulfilled';
    }
    RedisClient.set(`${email}_password_code`, secreteCode);
    mailer(
      { code: secreteCode },
      {
        to: email,
        subject: '[LookNote] 요청하신 인증번호를 안내드립니다.',
      },
    );
    return 'fulfilled';
  }

  async checkPasswordCode(email, code) {
    const exCode = await RedisClient.get(`${email}_password_code`);
    if (exCode !== code) {
      throw new HttpException('rejected', HttpStatus.FORBIDDEN);
    }
    return 'fulfilled';
  }

  async patchNewPassword(email, password, code) {
    const result = await this.checkPasswordCode(email, code);
    if (result !== 'fulfilled') {
      throw new HttpException('rejected', HttpStatus.FORBIDDEN);
    }
    const hash = await bcrypt.hash(password, 10);
    this.prisma.user.updateMany({
      where: {
        email,
        provider: 'LOCAL',
      },
      data: {
        password: hash,
      },
    });
    return 'fulfilled';
  }

  async SubmitApplicationForWithdrawal(
    reason: string,
    user_id: number,
    provider: string,
    user: JwtUserType,
  ) {
    if (process.env.NODE_ENV === 'dev') {
      return this.prisma.user.deleteMany({
        where: {
          user_id: user_id ? Number(user_id) : Number(user.user_id),
          provider: user_id ? provider : user.provider,
        },
      });
    }
    const [_, quit] = await Promise.all([
      this.prisma.user.update({
        where: {
          user_id: Number(user.user_id),
        },
        data: {
          active: false,
        },
      }),
      this.prisma.quit.create({
        data: {
          user_id: Number(user.user_id),
          reason,
          email: user.email,
        },
      }),
    ]);
    return quit;
  }

  async changeUserMetaData(patchUserBody, user: JwtUserType) {
    const updatedUser = await this.prisma.user.update({
      where: {
        user_id: Number(user.user_id),
      },
      data: {
        ...patchUserBody,
      },
      select: UserSelect,
    });
    return {
      user: updatedUser,
      access_token: this.jwtService.sign(updatedUser),
    };
  }

  async getUserReportList(user: JwtUserType) {
    const report = await this.prisma.report.findMany({
      where: {
        user_id: Number(user.user_id),
      },
    });
    return report.map((element) => element.post_id);
  }

  async submitReport(post_id: number, user: JwtUserType) {
    await this.prisma.report.create({
      data: {
        post_id,
        user_id: Number(user.user_id),
      },
    });
    return this.getUserReportList(user);
  }

  async userSearchWithNickname(nickname) {
    return this.prisma.user.findUnique({
      where: {
        nickname,
      },
      select: {
        user_id: true,
        nickname: true,
      },
    });
  }

  async setFcmToken(device_token, user: JwtUserType) {
    return this.fcmService.setUserIdAndFcmToken(
      Number(user.user_id),
      device_token,
    );
  }

  async getTestUser() {
    if (process.env.NODE_ENV === 'dev') {
      return this.prisma.user.findMany({});
    }
    return 'fulfilled';
  }
}
