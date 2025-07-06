import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import * as bcryptjs from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async register({ email, name, password }: RegisterDto) {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    return this.userService.create({
      email,
      name,
      password: hashedPassword
    });
  }

  async login({ email, password }) {
    const userBd = await this.userService.findByEmailWithPassword(email);
    if (!userBd) {
      throw new UnauthorizedException('email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, userBd.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is wrong');
    }

    const payload = { email: userBd.email, role: userBd.role };
    const token = await this.jwtService.signAsync(payload);

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
