import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  // @Get()
  // getUser(@Param('uid') uid: number) {
  //   return this.userService.getUser(null);
  // }
  
  @Get(':uid?')
  getUser(@Param('uid') uid: number) {
    return this.userService.getUser(uid);
  }

  @Post('save')
  async login(@Body() formData) {
    try {
     await this.userService.postCreateUser(formData);
    } catch (error) {
      console.error('Error saving user:', error);
      return { status: 'error', message: 'Error al guardar el usuario' };
    }
  }  
}
