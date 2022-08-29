import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwtDecode from 'jwt-decode';

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const payload: any = jwtDecode(
      context.switchToHttp().getRequest().get('Authorization').split(' ')[1],
    );
    if (!payload.manager_id) {
      throw new HttpException(
        `manager access only: ${JSON.stringify(payload)}`,
        HttpStatus.FORBIDDEN,
      );
    }
    if (!payload.admin) {
      throw new HttpException(
        `manager access only: ${JSON.stringify(payload)}`,
        HttpStatus.FORBIDDEN,
      );
    }
    context.switchToHttp().getRequest().manager = payload;
    return true;
  }
}
