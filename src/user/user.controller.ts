import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { AuthService } from "src/auth/auth.service"
import { UpdateUserDto } from "./dtos/update-user.dto"
import { RegisterDto } from "src/auth/dto/register.dto"
import { CreateUserDto } from "./dtos/create-user.dto"

@Controller("users")
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  // @Get()
  // getUser(@Param('uid') uid: number) {
  //   return this.userService.getUser(null);
  // }

  @Get()
  getUsers() {
    return this.userService.getUsers()
  }

  @Get(":uid?")
  getUser(@Param("uid") uid: number) {
    const params: any = {}
    if (uid) params.uid = uid
    return this.userService.getUser(params)
  }

  @Post("/create")
  async createUser(@Body() formData: CreateUserDto) {
    try {
      return await this.userService.createUser(formData)
    } catch (error) {
      console.error("Error creating user:", error)
      return { status: "error", message: error.message }
    }
  }

  @Put("/edit/:id")
  async editUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() user: UpdateUserDto
  ) {
    try {
      return await this.userService.updateUser(id, user)
    } catch (error) {
      console.error("Error editing user:", error)
      return { status: "error", message: error.message }
    }
  }

  @Post("auth/register")
  async saveUser(@Body() formData: RegisterDto) {
    try {
      return await this.authService.register(formData)
    } catch (error) {
      console.error("Error saving user:", error)
      return { status: "error", message: error.message }
    }
  }
}
