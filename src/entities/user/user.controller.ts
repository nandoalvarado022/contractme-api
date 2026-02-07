import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserId } from 'src/common/decorators';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  // @Get()
  // getUser(@Param('uid') uid: number) {
  //   return this.userService.getUser(null);
  // }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of all users in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      example: {
        data: [
          {
            uid: 1,
            name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            document_type: 'cc',
            document_number: '123456789',
            picture: 'https://example.com/pic.jpg',
            birth_date: '1990-01-01',
            role: 'user',
            created_at: '2025-12-09T10:00:00.000Z',
          },
        ],
        total: 1,
      },
    },
  })
  getUsers(@UserId() uid: number) {
    return this.userService.getUsers(uid);
  }

  @Get(':uid?')
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Retrieves a specific user by their unique identifier. If no UID is provided, returns all users.',
  })
  @ApiParam({
    name: 'uid',
    type: Number,
    required: false,
    description: 'User unique identifier',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    schema: {
      example: {
        uid: 1,
        name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        document_type: 'cc',
        document_number: '123456789',
        picture: 'https://example.com/pic.jpg',
        birth_date: '1990-01-01',
        role: 'user',
        created_at: '2025-12-09T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  getUser(@Param('uid') uid: number) {
    const params: any = {};
    if (uid) params.uid = uid;
    return this.userService.getUser(params);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Create new user',
    description:
      "Creates a new user with complete profile information including education, experience, and references. A default password 'contractme' is assigned.",
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User data with optional education, experience and references',
    examples: {
      basicUser: {
        summary: 'Basic user',
        value: {
          name: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          document_type: 'cc',
          document_number: '123456789',
          picture: 'https://example.com/pic.jpg',
          birth_date: '1990-01-01',
          role: 'user',
        },
      },
      completeUser: {
        summary: 'User with education and references',
        value: {
          name: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          document_type: 'cc',
          document_number: '123456789',
          picture: 'https://example.com/pic.jpg',
          birth_date: '1990-01-01',
          role: 'user',
          education: [
            {
              institution: 'University',
              degree: 'Bachelor',
              field: 'Computer Science',
              startDate: '2010-01-01',
              endDate: '2014-12-31',
            },
          ],
          reference: [
            {
              name: 'Jane Smith',
              phone: '+0987654321',
              relationship: 'Manager',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User created successfully',
    schema: {
      example: {
        data: {
          uid: 1,
          name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          created_at: '2025-12-09T10:00:00.000Z',
        },
        message: 'Usuario guardado con éxito',
        status: 'success',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  async createUser(@Body() formData /*: CreateUserDto*/) {
    // TODO: Hacer DTO
    try {
      return await this.userService.createUser(formData);
    } catch (error) {
      console.error('Error creating user:', error);
      return { status: 'error', message: error.message };
    }
  }

  @Put('/edit/:id')
  @ApiOperation({
    summary: 'Update user',
    description:
      "Updates an existing user's information including education, experience, and references",
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'User ID to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User data to update (partial update supported)',
    examples: {
      updateBasicInfo: {
        summary: 'Update basic information',
        value: {
          name: 'John',
          lastName: 'Smith',
          phone: '+1234567890',
          picture: 'https://example.com/new-pic.jpg',
        },
      },
      updateWithEducation: {
        summary: 'Update with education',
        value: {
          name: 'John',
          lastName: 'Smith',
          education: [
            {
              institution: 'New University',
              degree: 'Master',
              field: 'Data Science',
              startDate: '2015-01-01',
              endDate: '2017-12-31',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      example: {
        data: {
          uid: 1,
          name: 'John',
          last_name: 'Smith',
          email: 'john@example.com',
          updated_at: '2025-12-09T10:00:00.000Z',
        },
        message: 'Usuario editado con éxito',
        status: 'success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message: 'Usuario no encontrado',
        status: 'error',
      },
    },
  })
  async editUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ) {
    try {
      return await this.userService.updateUser(id, user);
    } catch (error) {
      console.error('Error editing user:', error);
      return { status: 'error', message: error.message };
    }
  }

  @Post('auth/register')
  @ApiOperation({
    summary: 'Register new user (auth)',
    description:
      'Registers a new user through authentication service with email and password',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Registration data',
    examples: {
      register: {
        summary: 'Register new user',
        value: {
          name: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'securePassword123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User registered successfully',
    schema: {
      example: {
        data: {
          uid: 1,
          name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
        },
        message: 'Usuario registrado con éxito',
        status: 'success',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
  })
  async saveUser(@Body() formData: RegisterDto) {
    try {
      return await this.authService.register(formData);
    } catch (error) {
      console.error('Error saving user:', error);
      return { status: 'error', message: error.message };
    }
  }
}
