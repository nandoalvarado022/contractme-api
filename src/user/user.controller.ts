import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  // @Get()
  // getUser(@Param('uid') uid: number) {
  //   return this.userService.getUser(null);
  // }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':uid?')
  getUser(@Param('uid') uid: number) {
    return this.userService.getUser(uid);
  }

  @Post('/create')
  async createUser(@Body() formData) {
    try {
      return await this.userService.postCreateUser(formData);
    } catch (error) {
      console.error('Error creating user:', error);
      return { status: 'error', message: error.message };
    }
  }

  @Post('/edit')
  async editUser(@Body() formData) {
    try {
      return await this.userService.postEditUser(formData);
    } catch (error) {
      console.error('Error editing user:', error);
      return { status: 'error', message: error.message };
    }
  }

  @Post('auth/register')
  async saveUser(@Body() formData) {
    try {
      return await this.authService.register(formData);
    } catch (error) {
      console.error('Error saving user:', error);
      return { status: 'error', message: error.message };
    }
  }
}
