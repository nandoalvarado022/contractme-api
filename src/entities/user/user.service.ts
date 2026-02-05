import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLogService } from 'src/entities/audit_logs/audit.service';
import { AuditLogsEntity } from 'src/entities/audit_logs/audit.entity';
import { EducationService } from 'src/entities/education/education.service';
import { ExperienceService } from 'src/entities/experience/experience.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { ReferenceService } from 'src/entities/reference/reference.service';
import { Role } from 'src/common/enums/rol.enum';
import { spanishMessages } from 'src/common/constants/messages';
import { TransactionsService } from 'src/entities/transactions/transaction.service';
import { BalanceService } from '../balance/balance.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private auditLogService: AuditLogService,
    private educationService: EducationService,
    private experienceService: ExperienceService,
    private referenceService: ReferenceService,
    private transactionsService: TransactionsService,
    private readonly balanceService: BalanceService,
  ) {}

  async getUser(params = {}) {
    const userFound = await this.userRepository.findOne({
      where: params,
      select: [
        'name',
        'last_name',
        'birth_date',
        'email',
        'phone',
        'uid',
        'role',
        'picture',
        'document_number',
        'document_type',
      ],
    });

    return userFound;
  }

  async getUsers(uid: number) {
    const user = await this.userRepository.findOneBy({ uid });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isAdmin = user.role === Role.ADMIN;
    let usersFound: UserEntity[];
    if (!isAdmin) {
      usersFound = await this.userRepository.findBy({ created_by: { uid } });
      throw new NotFoundException('User not found');
    }
    usersFound = await this.userRepository.find();

    return {
      data: usersFound,
      total: usersFound.length,
    };
  }

  async createUser(body: CreateUserDto) {
    const defaultPassword = 'contractme';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const userDataToCreate = {
      ...body,
      last_name: body.lastName,
      password: hashedPassword,
      role: Role.USER,
    };

    const userToCreate = this.userRepository.create(userDataToCreate);
    const savedUser = await this.userRepository.save(userToCreate);

    await this.balanceService.createBalance(savedUser.uid);

    // Saving education
    if (body.education && body.education.length > 0) {
      for (const newEducationDto of body.education) {
        const educationData = { ...newEducationDto, uid: savedUser.uid };
        await this.educationService.createEducation(educationData);
      }
    }

    // Saving work experience
    // if (body.experience && body.experience.length > 0) {
    //   for (const newExperienceDto of body.experience) {
    //     const experienceData = { ...newExperienceDto, uid: savedUser.uid }
    //     await this.experienceService.createExperience(experienceData)
    //   }
    // }

    // Saving references
    if (body.reference && body.reference.length > 0) {
      for (const newReferenceDto of body.reference) {
        const referenceData = { ...newReferenceDto, uid: savedUser.uid };
        await this.referenceService.createReference(referenceData);
      }
    }

    // Creating the log
    const auditLog = new AuditLogsEntity();
    auditLog.description = 'Usuario creado';
    auditLog.table = 'users';
    const auditData = {
      uid: savedUser.uid,
      name: savedUser.name,
      lastName: savedUser.last_name,
      email: savedUser.email,
      created_at: savedUser.created_at,
    };
    auditLog.data = JSON.stringify(auditData);
    await this.auditLogService.createAuditLog(auditLog);

    return {
      data: savedUser,
      message: spanishMessages.user.USER_SAVED,
      status: spanishMessages.common.SUCCESS,
    };
  }

  async updateUser(uid: number, body: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        uid: uid,
      },
    });
    if (!userFound) {
      return {
        message: spanishMessages.user.USER_NOT_FOUND,
        status: spanishMessages.common.ERROR,
      };
    }

    const updateData = {
      ...body,
      ...(body.lastName !== undefined && { last_name: body.lastName }),
    };

    const updatedUser = this.userRepository.merge(userFound, updateData);
    await this.userRepository.save(updatedUser);

    // Updating education
    if (body.education && body.education.length > 0) {
      for (const newEducationDto of body.education) {
        const educationData = { ...newEducationDto, uid };
        await this.educationService.updateEducationByUserId(educationData);
      }
    }

    // Updating work experience
    if (body.experience && body.experience.length > 0) {
      for (const newExperienceDto of body.experience) {
        const experienceData = { ...newExperienceDto, uid };
        await this.experienceService.updateExperienceByUserId(experienceData);
      }
    }

    // Updating references
    if (body.reference && body.reference.length > 0) {
      for (const newReferenceDto of body.reference) {
        const referenceData = { ...newReferenceDto, uid };
        await this.referenceService.updateReferenceByUserId(referenceData);
      }
    }

    // Creating the log
    const auditLog = new AuditLogsEntity();
    auditLog.description = 'Usuario editado';
    auditLog.table = 'users';
    const auditData = {
      uid: userFound.uid,
      name: userFound.name,
      lastName: userFound.last_name,
      email: userFound.email,
      updated_at: new Date().toISOString(),
    };
    auditLog.data = JSON.stringify(auditData);
    await this.auditLogService.createAuditLog(auditLog);

    return {
      data: userFound,
      message: spanishMessages.user.USER_EDITED,
      status: spanishMessages.common.SUCCESS,
    };
  }

  async registerUser(user: RegisterDto) {
    const { email, name, password, lastName } = user;

    const newUser = this.userRepository.create({
      email,
      name,
      password,
      last_name: lastName,
    });

    const savedUser = await this.userRepository.save(newUser);

    await this.balanceService.createBalance(savedUser.uid);

    return {
      data: savedUser,
      message: spanishMessages.user.USER_REGISTERED,
      status: spanishMessages.common.SUCCESS,
    };
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['uid', 'name', 'last_name', 'email', 'password', 'role'],
    });
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update({ email }, { password: hashedPassword });
  }
}
