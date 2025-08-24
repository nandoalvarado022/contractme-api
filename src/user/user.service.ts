/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { loginDto } from "src/types/user";
import bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUser(params) {
    const userFound = await this.userRepository.findOne({
      where: params,
    });

    return userFound;
  }

  async login(params: loginDto) {
    const userFound = await this.userRepository.findOne({
      where: params,
    });

    return userFound;
  }

  async registerUser(params) {
    const emailFound = await this.userRepository.findOne({
      where: {
        email: params.email,
      },
    });

    if (emailFound) {
      return {
        code: 400,
        message: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(params.password, 10);
    params.password = hashedPassword;
    const newUser = this.userRepository.create(params);
    return newUser;
  }
}
