import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    if (!payload.user_id) {
      throw new HttpException(
        'user token is in valid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!payload.active) {
      throw new HttpException(
        'user token is in valid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return payload;
  }
}
