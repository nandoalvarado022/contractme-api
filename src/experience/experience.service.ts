import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { ExperienceEntity } from "./experience.entity"
import { Repository } from "typeorm"
import { CreateExperienceDto, UpdateExperienceDto } from "./dto"

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(ExperienceEntity)
    private experienceRepository: Repository<ExperienceEntity>
  ) {}

  async getExperienceByUid(uid: number): Promise<ExperienceEntity[]> {
    return this.experienceRepository.find({
      where: { user_id: uid },
      relations: ["user"],
    })
  }

  async createExperience(
    experienceData: CreateExperienceDto
  ): Promise<ExperienceEntity> {
    const experience = this.experienceRepository.create(experienceData)
    return this.experienceRepository.save(experience)
  }

  async updateExperience(
    experienceData: UpdateExperienceDto & { user_id: number }
  ): Promise<ExperienceEntity[]> {
    const { user_id, ...updateData } = experienceData

    // Delete existing experience records for this user
    await this.experienceRepository.delete({ user_id })

    // Create new experience record
    const experience = this.experienceRepository.create(experienceData)
    await this.experienceRepository.save(experience)

    // Return all experience records for this user
    return this.getExperienceByUid(user_id)
  }

  async deleteExperience(id: number): Promise<void> {
    await this.experienceRepository.delete(id)
  }
}
