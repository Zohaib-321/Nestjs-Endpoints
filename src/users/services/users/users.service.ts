import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/user';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from 'src/users/dto/user_update.dto';
import { Logindto } from 'src/users/dto/login.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createuserdto: CreateUserDto) {
    const { email } = createuserdto;

    const user = await this.findbyemail(email);

    if (user) {
      throw new HttpException(
        'User with email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = await this.userRepository.create(createuserdto);

    return this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: Logindto) {
    const { email, password } = loginUserDto;
    const emailMatch = await this.findbyemail(email);
    if (!emailMatch) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    // const userPass = await this.userRepository.findOne({
    //   where: { password: password },
    // });

    const passMatch = await bcrypt.compare(password, emailMatch.password);
    if (!passMatch) {
      throw new HttpException('Unauhtorized', HttpStatus.UNAUTHORIZED);
    }

    return { emailMatch, passMatch };
  }

  async findbypayload(payload: any) {
    const { email } = payload;

    const user = await this.userRepository.findOne({ where: { email: email } });
    return user;
  }

  async updateUser(id: number, updateuserdto: UpdateUserDto) {
    await this.userRepository.update(id, updateuserdto);
    const updatedUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException(
      `User Not found with given ID: ${id}`,
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserbyId(id: number) {
    const check = await this.userRepository.findOne({
      where: { id: id },
    });
    if (check) {
      return check;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async getUser() {
    return this.userRepository.find();
  }
  // async getUser(query: object) {
  //   return this.userRepository.findOne(query);
  // }

  async deleteUser(id: number) {
    const deletedUser = await this.userRepository.delete(id);
    if (deletedUser.affected) {
      return 'User Deleted';
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  // async getUserbyemail(email: string) {
  //   const userEmail = await this.userRepository.findOne({
  //     where: { email: email },
  //   });
  //   if (!userEmail) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }
  //   return userEmail;
  // }

  async findbyemail(email: string) {
    const userEmail = await this.userRepository.findOne({
      where: { email: email },
    });
    return userEmail;
  }
}
