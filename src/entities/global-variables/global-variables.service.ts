import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalVariablesEntity } from './global-variables.entity';
import { CreateGlobalVariableDto, UpdateGlobalVariableDto } from './dto';

@Injectable()
export class GlobalVariablesService {
  constructor(
    @InjectRepository(GlobalVariablesEntity)
    private readonly globalVariablesRepository: Repository<GlobalVariablesEntity>,
  ) {}

  async findAll(): Promise<GlobalVariablesEntity[]> {
    return this.globalVariablesRepository.find({
      order: { key: 'ASC' },
    });
  }

  async findOne(id: number): Promise<GlobalVariablesEntity> {
    const variable = await this.globalVariablesRepository.findOne({
      where: { id },
    });

    if (!variable) {
      throw new NotFoundException(`Global variable with ID ${id} not found`);
    }

    return variable;
  }

  async findByKey(key: string): Promise<GlobalVariablesEntity> {
    const variable = await this.globalVariablesRepository.findOne({
      where: { key },
    });

    if (!variable) {
      throw new NotFoundException(
        `Global variable with key "${key}" not found`,
      );
    }

    return variable;
  }

  async create(
    createGlobalVariableDto: CreateGlobalVariableDto,
  ): Promise<GlobalVariablesEntity> {
    const existingVariable = await this.globalVariablesRepository.findOne({
      where: { key: createGlobalVariableDto.key },
    });

    if (existingVariable) {
      throw new ConflictException(
        `Global variable with key "${createGlobalVariableDto.key}" already exists`,
      );
    }

    const variable = this.globalVariablesRepository.create(
      createGlobalVariableDto,
    );
    return this.globalVariablesRepository.save(variable);
  }

  async update(
    id: number,
    updateGlobalVariableDto: UpdateGlobalVariableDto,
  ): Promise<GlobalVariablesEntity> {
    const variable = await this.findOne(id);

    if (
      updateGlobalVariableDto.key &&
      updateGlobalVariableDto.key !== variable.key
    ) {
      const existingVariable = await this.globalVariablesRepository.findOne({
        where: { key: updateGlobalVariableDto.key },
      });

      if (existingVariable) {
        throw new ConflictException(
          `Global variable with key "${updateGlobalVariableDto.key}" already exists`,
        );
      }
    }

    Object.assign(variable, updateGlobalVariableDto);
    return this.globalVariablesRepository.save(variable);
  }

  async remove(id: number): Promise<{ deleted: boolean; id: number }> {
    const variable = await this.findOne(id);
    await this.globalVariablesRepository.remove(variable);

    return { deleted: true, id };
  }
}
