/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { loginDto } from 'src/types/user';
import * as bcryptjs from 'bcryptjs'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  async getUser(params) {
    const userFound = await this.userRepository.findOne({
      where: params,
    });

    return userFound;
  }

  create(createUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findByEmailWithPassword(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['uid', 'name', 'email', 'password', 'role'],
    });
  }
}
