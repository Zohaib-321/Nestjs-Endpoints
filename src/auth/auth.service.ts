import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UsersService } from 'src/users/services/users/users.service';

export class AuthService {
  constructor(private userService: UsersService) {}

  async signPayload(payload: any) {
    const token = sign(payload, 'secretKey', { expiresIn: '12h' });
    return token;
  }

  async validateUser(payload: any) {
    return await this.userService.findbypayload(payload);
  }
}
