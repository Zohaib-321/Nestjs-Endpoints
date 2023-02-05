import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Put,
  Delete,
} from '@nestjs/common';
// import * as bcrypt from 'bcrypt';

// import { CreateUserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { UpdateUserDto } from 'src/users/dto/user_update.dto';
// import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService, // private authService: AuthService,
  ) {}

  @Put(':id')
  updateusers(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Get('get')
  @UsePipes(ValidationPipe)
  getUsers() {
    return this.userService.getUser();
  }
  @Get(':id')
  getUsersbyId(@Param('id') id: number) {
    return this.userService.getUserbyId(id);
  }
  @Delete(':id')
  deleteUsers(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
