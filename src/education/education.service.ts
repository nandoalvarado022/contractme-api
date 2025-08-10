import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { EducationEntity } from "./education.entity"
import { Repository } from "typeorm"
import { CreateEducationDto, UpdateEducationDto } from "./dto"

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>
  ) {}

  async getEducationByUid(uid: number): Promise<EducationEntity[]> {
    return this.educationRepository.find({
      where: { user_id: uid },
      relations: ["user"],
    })
  }

  async createEducation(
    educationData: CreateEducationDto
  ): Promise<EducationEntity> {
    const education = this.educationRepository.create(educationData)
    return this.educationRepository.save(education)
  }

  async updateEducation(
    educationData: UpdateEducationDto & { user_id: number }
  ): Promise<EducationEntity[]> {
    const { user_id, ...updateData } = educationData

    // Delete existing education records for this user
    await this.educationRepository.delete({ user_id })

    // Create new education record
    const education = this.educationRepository.create(educationData)
    await this.educationRepository.save(education)

    // Return all education records for this user
    return this.getEducationByUid(user_id)
  }

  async deleteEducation(id: number): Promise<void> {
    await this.educationRepository.delete(id)
  }
}
