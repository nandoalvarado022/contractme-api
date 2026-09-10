import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EducationEntity } from "./education.entity";
import { Repository } from "typeorm";
import { CreateEducationDto, UpdateEducationDto } from "./dto";

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>,
  ) {}

  async getEducationByUid(uid: number): Promise<EducationEntity[]> {
    return this.educationRepository.find({
      where: { user: { uid } },
      relations: ["user"],
    });
  }

  async getEducationById(id: number): Promise<EducationEntity> {
    const education = await this.educationRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!education) {
      throw new NotFoundException(`Education record with ID ${id} not found`);
    }

    return education;
  }

  async createEducation(
    educationData: CreateEducationDto,
  ): Promise<EducationEntity> {
    const educationToCreate = {
      place: educationData.place,
      title: educationData.title,
      start_date: educationData.startDate,
      end_date: educationData.endDate,
      ...(educationData.uid && { user: { uid: educationData.uid } }),
    };

    const education = this.educationRepository.create(educationToCreate);
    return this.educationRepository.save(education);
  }

  async updateEducation(
    id: number,
    updateData: UpdateEducationDto,
  ): Promise<EducationEntity> {
    const education = await this.getEducationById(id);

    Object.assign(education, {
      ...(updateData.place !== undefined && { place: updateData.place }),
      ...(updateData.title !== undefined && { title: updateData.title }),
      ...(updateData.startDate !== undefined && {
        start_date: updateData.startDate,
      }),
      ...(updateData.endDate !== undefined && {
        end_date: updateData.endDate,
      }),
    });

    return this.educationRepository.save(education);
  }

  async updateEducationByUserId(
    educationData: UpdateEducationDto & { uid: number },
  ): Promise<EducationEntity[]> {
    const { uid } = educationData;

    await this.educationRepository.delete({ user: { uid } });

    const educationToCreate = {
      place: educationData.place,
      title: educationData.title,
      start_date: educationData.startDate,
      end_date: educationData.endDate,
      user: { uid },
    };
    const education = this.educationRepository.create(educationToCreate);
    await this.educationRepository.save(education);

    return this.getEducationByUid(uid);
  }

  async deleteEducation(id: number): Promise<{ deleted: boolean; id: number }> {
    const education = await this.getEducationById(id);

    await this.educationRepository.remove(education);

    return { deleted: true, id };
  }
}
