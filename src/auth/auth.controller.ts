import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordForgottenDto } from './dto/password-forgotten.dto';
import { AuditLogService } from 'src/entities/audit_logs/audit.service';
import { UserEntity } from 'src/entities/user/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly auditLogService: AuditLogService
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description:
      'Creates a new user account with encrypted password and sends welcome email',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        uid: 1,
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        role: 'user',
        createdAt: '2025-12-09T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
    schema: {
      example: {
        message: 'El usuario ya existe',
        statusCode: 400,
      },
    },
  })
  register(
    @Body()
    registerDto: RegisterDto
  ) {
    this.auditLogService.createAuditLog({
      description: 'Usuario creado',
      table: 'users',
      data: JSON.stringify(registerDto),
      id: 0,
      user: null as unknown as UserEntity,
      created_at: new Date().toISOString(),
      user_compromised: null as unknown as UserEntity,
    });

    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates user and returns JWT token',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        email: 'juan.perez@example.com',
        message: 'Bienvenido Juan Pérez',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        uid: 1,
        status: 'success',
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        message: 'Email incorrecto',
        statusCode: 401,
      },
    },
  })
  async login(
    @Body()
    loginDto: LoginDto
  ) {
    await this.auditLogService.createAuditLog({
      description: `<span class="email">${loginDto.email}</span> inició sesión`,
      table: 'users',
      data: JSON.stringify(loginDto),
      id: 0,
      user: null as unknown as UserEntity,
      created_at: null as unknown as string,
      user_compromised: null as unknown as UserEntity,
    });

    return this.authService.login(loginDto);
  }

  @Post('password_forgotten')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description: "Sends a temporary password to user's email",
  })
  @ApiBody({ type: PasswordForgottenDto })
  @ApiResponse({
    status: 200,
    description: 'Temporary password sent successfully',
    schema: {
      example: {
        message: 'Contraseña temporal enviada al correo electrónico',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
    schema: {
      example: {
        message: 'Usuario no encontrado',
        code: 400,
      },
    },
  })
  async passwordForgotten(
    @Body()
    passwordForgottenDto: PasswordForgottenDto
  ) {
    await this.auditLogService.createAuditLog({
      description:
        'Solicitud de restablecimiento de contraseña para <span class="email">' +
        passwordForgottenDto.email +
        '</span>',
      table: 'users',
      data: JSON.stringify(passwordForgottenDto),
      id: 0,
      user: null as unknown as UserEntity,
      created_at: null as unknown as string,
      user_compromised: null as unknown as UserEntity,
    });

    return this.authService.passwordForgotten(passwordForgottenDto);
  }

  @Post('change_password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change user password',
    description:
      'Allows user to change their password by providing current and new password',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      example: {
        message: 'Contraseña actualizada correctamente',
        status: 'success',
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
    schema: {
      example: {
        message: 'Usuario no encontrado',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Current password is incorrect',
    schema: {
      example: {
        message: 'La contraseña actual es incorrecta',
        statusCode: 401,
      },
    },
  })
  async changePassword(
    @Body()
    changePasswordDto: ChangePasswordDto
  ) {
    await this.auditLogService.createAuditLog({
      description:
        'Cambio de contraseña para <span class="email">' +
        changePasswordDto.email +
        '</span>',
      table: 'users',
      data: JSON.stringify({ email: changePasswordDto.email }),
      id: 0,
      user: null as unknown as UserEntity,
      created_at: null as unknown as string,
      user_compromised: null as unknown as UserEntity,
    });

    return this.authService.changePassword(changePasswordDto);
  }
}
