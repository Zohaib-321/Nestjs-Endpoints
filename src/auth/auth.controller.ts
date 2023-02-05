import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Logindto } from 'src/users/dto/login.dto';
import { UsersService } from 'src/users/services/users/users.service';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/users/dto/user.dto';
@Controller('auth')
export class AuthController {
  // define the auth and user service.
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}
  @Post('login')
  async login(@Body() userDTO: Logindto) {
    const user = await this.userService.loginUser(userDTO);

    const payload = {
      email: user.emailMatch,
    };
    //get a JWT authentication token from the payload
    const token = await this.authService.signPayload(payload);
    // return the user and the token
    return {
      user,
      token,
    };
  }
  @Post('create')
  @UsePipes(ValidationPipe)
  async createUsers(@Body() createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    createUserDto.password = hashedPassword;
    const user = await this.userService.createUser(createUserDto);

    const payload = {
      email: user.email,
    };
    const token = await this.authService.signPayload(payload);
    return {
      user,
      token,
    };
  }
}
