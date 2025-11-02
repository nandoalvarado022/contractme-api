import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/entities/user/user.service';
import * as bcryptjs from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../common/emails/mail.service';
import { spanishMessages } from 'src/common/constants/messages';

var StatsD = require('hot-shots');
var dogstatsd = new StatsD();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  async register({ email, name, password }: RegisterDto) {
    const start = Date.now();
    try {
      const user = await this.userService.findOneByEmail(email);

      if (user) {
        throw new BadRequestException('User already exists');
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      dogstatsd.increment('services.user.register');

      // Enviando correo de bienvenida
      await this.mailService.sendEmailBrevo(
        email,
        name,
        'welcome',
        { name }
      );

      const registerResp = await this.userService.registerUser({
        email,
        name,
        password: hashedPassword
      });

      const durationMs = Date.now() - start;
      dogstatsd.increment('services.user.register.success');
      dogstatsd.histogram('services.user.register.duration', durationMs, [
        'repository:user',
        'operation:register',
        'status:success',
      ]);

      return registerResp;
    } catch (error) {
      const durationMs = Date.now() - start;
      dogstatsd.increment('services.user.register.error');
      dogstatsd.histogram('services.user.register.duration', durationMs, [
        'repository:user',
        'operation:register',
        'status:error',
      ]);
      throw error;
    }
  }

  async passwordForgotten({ email }) {
    const start = Date.now();
    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new BadRequestException(spanishMessages.auth.USER_NOT_FOUND);
      }
      dogstatsd.increment('services.user.passwordForgotten');

      const tempPassword = Math.random().toString(36).slice(-6);
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(tempPassword, salt);

      await this.userService.updatePassword(user.email, hashedPassword);

      await this.mailService.sendEmailBrevo(
        user.email,
        user.name,
        'password_remember',
        { name: user.name, tempPassword }
      );

      const durationMs = Date.now() - start;
      dogstatsd.increment('services.user.passwordForgotten.success');
      dogstatsd.histogram('services.user.passwordForgotten.duration', durationMs, [
        'repository:user',
        'operation:passwordForgotten',
        'status:success',
      ]);

      return { message: spanishMessages.auth.TEMP_PASSWORD_SENT };
    } catch (error) {
      const durationMs = Date.now() - start;
      dogstatsd.increment('services.user.passwordForgotten.error');
      dogstatsd.histogram('services.user.passwordForgotten.duration', durationMs, [
        'repository:user',
        'operation:passwordForgotten',
        'status:error',
      ]);

      return {
        message: error.message,
        code: error.status || 500,
      }
    }
  }

  async login({ email, password }) {
    dogstatsd.increment('services.user.login');
    const start = Date.now();
    const userBd = await this.userService.findByEmailWithPassword(email);
    if (!userBd) {
      throw new UnauthorizedException('email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, userBd.password);
    if (!isPasswordValid) {
      dogstatsd.increment('services.user.login.error');
      throw new UnauthorizedException('password is wrong');
    }

    const payload = { email: userBd.email, role: userBd.role };
    const token = await this.jwtService.signAsync(payload);
    dogstatsd.increment('services.user.login.success');
    const durationMs = Date.now() - start;

    dogstatsd.histogram('services.user.login.duration', durationMs, [
      'repository:user',
      'operation:login',
    ]);

    return {
      email,
      message: `Bienvenido ${userBd.name}`,
      token,
      uid: userBd.uid,
      status: 'success',
      statusCode: 200,
    };
  }
}
