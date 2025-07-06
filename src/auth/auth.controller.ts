import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuditLogService } from 'src/audit_logs/audit.service';
import { UserEntity } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly auditLogService: AuditLogService
    ) { }

    @Post('register')
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
    async login(
        @Body()
        loginDto,
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
}
