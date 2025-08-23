import { Injectable, NotFoundException } from "@nestjs/common"
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
      where: { user: { uid } },
      relations: ["user"],
    })
  }

  async getExperienceById(id: number): Promise<ExperienceEntity> {
    const experience = await this.experienceRepository.findOne({
      where: { id },
      relations: ["user"],
    })

    if (!experience) {
      throw new NotFoundException(`Experience record with ID ${id} not found`)
    }

    return experience
  }

  async createExperience(
    experienceData: CreateExperienceDto
  ): Promise<ExperienceEntity> {
    const { uid, ...restData } = experienceData

    const experienceToCreate = {
      ...restData,
      ...(uid && { user: { uid } }),
    }

    const experience = this.experienceRepository.create(experienceToCreate)
    return this.experienceRepository.save(experience)
  }

  async updateExperience(
    id: number,
    updateData: UpdateExperienceDto
  ): Promise<ExperienceEntity> {
    const experience = await this.getExperienceById(id)

    Object.assign(experience, updateData)

    return this.experienceRepository.save(experience)
  }

  async updateExperienceByUserId(
    experienceData: UpdateExperienceDto & { uid: number }
  ): Promise<ExperienceEntity[]> {
    const { uid, ...updateData } = experienceData

    // Delete existing experience records for this user
    await this.experienceRepository.delete({ user: { uid } })

    // Create new experience record with proper user relationship
    const experienceToCreate = {
      ...updateData,
      user: { uid },
    }
    const experience = this.experienceRepository.create(experienceToCreate)
    await this.experienceRepository.save(experience)

    // Return all experience records for this user
    return this.getExperienceByUid(uid)
  }

  async deleteExperience(
    id: number
  ): Promise<{ deleted: boolean; id: number }> {
    const experience = await this.getExperienceById(id)

    await this.experienceRepository.remove(experience)

    return { deleted: true, id }
  }
}
