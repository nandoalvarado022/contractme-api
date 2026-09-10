import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExperienceEntity } from "./experience.entity";
import { Repository } from "typeorm";
import { CreateExperienceDto, UpdateExperienceDto } from "./dto";

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(ExperienceEntity)
    private experienceRepository: Repository<ExperienceEntity>,
  ) {}

  async getExperienceByUid(uid: number): Promise<ExperienceEntity[]> {
    return this.experienceRepository.find({
      where: { user: { uid } },
      relations: ["user"],
    });
  }

  async getExperienceById(id: number): Promise<ExperienceEntity> {
    const experience = await this.experienceRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!experience) {
      throw new NotFoundException(`Experience record with ID ${id} not found`);
    }

    return experience;
  }

  async createExperience(
    experienceData: CreateExperienceDto,
  ): Promise<ExperienceEntity> {
    const experienceToCreate = {
      company: experienceData.company,
      position: experienceData.position,
      start_date: experienceData.startDate,
      end_date: experienceData.endDate,
      ...(experienceData.uid && { user: { uid: experienceData.uid } }),
    };

    const experience = this.experienceRepository.create(experienceToCreate);
    return this.experienceRepository.save(experience);
  }

  async updateExperience(
    id: number,
    updateData: UpdateExperienceDto,
  ): Promise<ExperienceEntity> {
    const experience = await this.getExperienceById(id);

    Object.assign(experience, {
      ...(updateData.company !== undefined && { company: updateData.company }),
      ...(updateData.position !== undefined && {
        position: updateData.position,
      }),
      ...(updateData.startDate !== undefined && {
        start_date: updateData.startDate,
      }),
      ...(updateData.endDate !== undefined && {
        end_date: updateData.endDate,
      }),
    });

    return this.experienceRepository.save(experience);
  }

  async updateExperienceByUserId(
    experienceData: UpdateExperienceDto & { uid: number },
  ): Promise<ExperienceEntity[]> {
    const { uid } = experienceData;

    await this.experienceRepository.delete({ user: { uid } });

    const experienceToCreate = {
      company: experienceData.company,
      position: experienceData.position,
      start_date: experienceData.startDate,
      end_date: experienceData.endDate,
      user: { uid },
    };
    const experience = this.experienceRepository.create(experienceToCreate);
    await this.experienceRepository.save(experience);

    return this.getExperienceByUid(uid);
  }

  async deleteExperience(
    id: number,
  ): Promise<{ deleted: boolean; id: number }> {
    const experience = await this.getExperienceById(id);

    await this.experienceRepository.remove(experience);

    return { deleted: true, id };
  }
}
