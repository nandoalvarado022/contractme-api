import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UserService } from "src/entities/user/user.service";
import * as bcryptjs from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../common/emails/mail.service";
import { spanishMessages } from "src/common/constants/messages";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register({ email, name, lastname, password }: RegisterDto) {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException(spanishMessages.auth.USER_ALREADY_EXISTS);
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    return this.userService.registerUser({
      email,
      name,
      password: hashedPassword,
      lastname,
    });
  }

  async passwordForgotten({ email }) {
    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new BadRequestException(spanishMessages.auth.USER_NOT_FOUND);
      }

      const tempPassword = Math.random().toString(36).slice(-6);
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(tempPassword, salt);

      await this.userService.updatePassword(user.email, hashedPassword);

      const fullName = user.last_name
        ? `${user.name} ${user.last_name}`
        : user.name;

      await this.mailService.sendEmailBrevo(
        user.email,
        fullName,
        "password_remember",
        { name: fullName, tempPassword },
      );

      return { message: spanishMessages.auth.TEMP_PASSWORD_SENT };
    } catch (error) {
      return {
        message: error.message,
        code: error.status || 500,
      };
    }
  }

  async login({ email, password }) {
    const userBd = await this.userService.findByEmailWithPassword(email);
    if (!userBd) {
      throw new UnauthorizedException(spanishMessages.auth.EMAIL_WRONG);
    }

    const isPasswordValid = await bcryptjs.compare(password, userBd.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(spanishMessages.auth.PASSWORD_WRONG);
    }

    const payload = { email: userBd.email, role: userBd.role };
    const token = await this.jwtService.signAsync(payload);

    const fullName = userBd.last_name
      ? `${userBd.name} ${userBd.last_name}`
      : userBd.name;

    return {
      email,
      message: `${spanishMessages.auth.WELCOME} ${fullName}`,
      token,
      uid: userBd.uid,
      status: spanishMessages.common.SUCCESS,
      statusCode: 200,
    };
  }

  async changePassword({
    email,
    currentPassword,
    newPassword,
  }: ChangePasswordDto) {
    const user = await this.userService.findByEmailWithPassword(email);

    if (!user) {
      throw new BadRequestException(spanishMessages.auth.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcryptjs.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        spanishMessages.auth.CURRENT_PASSWORD_WRONG,
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    await this.userService.updatePassword(user.email, hashedPassword);

    return {
      message: spanishMessages.auth.PASSWORD_CHANGED,
      status: spanishMessages.common.SUCCESS,
      statusCode: 200,
    };
  }
}
