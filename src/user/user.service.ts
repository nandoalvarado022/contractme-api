import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudiesAndExperiencesEntity } from 'src/experience/experience.entity';
import { AuditLogService } from 'src/audit_logs/audit.service';
import { AuditLogsEntity } from 'src/audit_logs/audit.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(StudiesAndExperiencesEntity)
    private experiencesRepository: Repository<StudiesAndExperiencesEntity>,
    private auditLogService: AuditLogService
  ) { }

  async getUser(params = {}) {
    const userFound = await this.userRepository.findOne({
      where: params,
    });

    return userFound;
  }

  async getUsers() {
    const userFound = await this.userRepository.find();

    return {
      data: userFound,
      total: userFound.length,
    }
  }

  async postCreateUser(body) {
    const { uid, email, password, name } = body;
    if (uid) {
      const userFound = await this.userRepository.findOne({
        where: {
          uid: body?.uid,
        },
      });

      if (userFound) {
        await this.userRepository.update(userFound.uid, body);
      }
    } else {
      // Creating a new user
      const userCreated = this.userRepository.create(body);
      await this.userRepository.save(userCreated);

      // Saving formation
      if (body.formation && body.formation.length > 0) {
        for (const newExperienceDto of body.formation) {
          if (newExperienceDto.title && newExperienceDto.title.trim() !== '') {
            newExperienceDto.user = userCreated;
            await this.createStudyAndExperience(newExperienceDto);
          }
        }
      }

      // Creating the log
      const auditLog = new AuditLogsEntity();
      auditLog.description = 'Usuario creado';
      auditLog.table = 'users';
      auditLog.data = JSON.stringify(userCreated);
      await this.auditLogService.createAuditLog(auditLog);

      return {
        data: userCreated,
        message: 'Usuario guardado con éxito',
        status: 'success',
      };
    }
  }

  async postEditUser(body) {
    const { uid, email, password, name } = body;
    if (uid) {
      const userFound = await this.userRepository.findOne({
        where: {
          uid: body?.uid,
        },
      });

      if (userFound) {
        await this.userRepository.update(userFound.uid, body);

        // Updating formation
        if (body.formation && body.formation.length > 0) {
          for (const newExperienceDto of body.formation) {
            if (newExperienceDto.title && newExperienceDto.title.trim() !== '') {
              newExperienceDto.user = userFound;
              await this.createStudyAndExperience(newExperienceDto);
            }
          }
        }

        // Creating the log
        const auditLog = new AuditLogsEntity();
        auditLog.description = 'Usuario editado';
        auditLog.table = 'users';
        auditLog.data = JSON.stringify(userFound);
        await this.auditLogService.createAuditLog(auditLog);

        return {
          data: userFound,
          message: 'Usuario editado con éxito',
          status: 'success',
        };
      } else {
        return {
          message: 'Usuario no encontrado',
          status: 'error',
        };
      }
    }
  }

  createStudyAndExperience(newExperienceDto) {
    // Validamos que entity no sea un string vacío
    if (!newExperienceDto.entity || newExperienceDto.entity.trim() === '') {
      newExperienceDto.entity = null;
    }
    const newExperience = this.experiencesRepository.create(newExperienceDto);
    return this.experiencesRepository.save(newExperience);
  }

  create(createUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findByEmailWithPassword(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['uid', 'name', 'email', 'password', 'role'],
    });
  }
}
