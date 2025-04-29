import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get(':uid')
  getUser(@Param('uid') uid: number) {
    return this.userService.getUser(uid);
  }

  // @Post('login')
  // login(@Body() formData) {
  //   return this.userService.login(formData);
  // }
  
}
