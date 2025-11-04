import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
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

  async register({ email, name, password }: RegisterDto) {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException("User already exists");
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    return this.userService.registerUser({
      email,
      name,
      password: hashedPassword,
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

      await this.mailService.sendEmailBrevo(
        user.email,
        user.name,
        "password_remember",
        { name: user.name, tempPassword },
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
      throw new UnauthorizedException("email is wrong");
    }

    const isPasswordValid = await bcryptjs.compare(password, userBd.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("password is wrong");
    }

    const payload = { email: userBd.email, role: userBd.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      email,
      message: `Bienvenido ${userBd.name}`,
      token,
      uid: userBd.uid,
      status: "success",
      statusCode: 200,
    };
  }
}
