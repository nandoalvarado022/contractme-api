import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReferenceEntity } from "./reference.entity";
import { CreateReferenceDto } from "./dto/create-reference.dto";
import { UpdateReferenceDto } from "./dto/update-reference.dto";

@Injectable()
export class ReferenceService {
  constructor(
    @InjectRepository(ReferenceEntity)
    private referenceRepository: Repository<ReferenceEntity>,
  ) {}

  async getReferenceByUid(uid: number): Promise<ReferenceEntity[]> {
    return this.referenceRepository.find({
      where: { user: { uid } },
      relations: ["user"],
    });
  }

  async getReferenceById(id: number): Promise<ReferenceEntity> {
    const reference = await this.referenceRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!reference) {
      throw new NotFoundException(`Reference record with ID ${id} not found`);
    }

    return reference;
  }

  async createReference(
    referenceData: CreateReferenceDto,
  ): Promise<ReferenceEntity> {
    const { uid, ...restData } = referenceData;

    const referenceToCreate = {
      ...restData,
      ...(uid && { user: { uid } }),
    };

    const reference = this.referenceRepository.create(referenceToCreate);
    return this.referenceRepository.save(reference);
  }

  async updateReference(
    id: number,
    updateData: UpdateReferenceDto,
  ): Promise<ReferenceEntity> {
    const reference = await this.getReferenceById(id);

    Object.assign(reference, updateData);

    return this.referenceRepository.save(reference);
  }

  async updateReferenceByUserId(
    referenceData: UpdateReferenceDto & { uid: number },
  ): Promise<ReferenceEntity[]> {
    const { uid, ...updateData } = referenceData;

    // Delete existing reference records for this user
    await this.referenceRepository.delete({ user: { uid } });

    // Create new reference record with proper user relationship
    const referenceToCreate = {
      ...updateData,
      user: { uid },
    };
    const reference = this.referenceRepository.create(referenceToCreate);
    await this.referenceRepository.save(reference);

    // Return all reference records for this user
    return this.getReferenceByUid(uid);
  }

  async deleteReference(id: number): Promise<{ deleted: boolean; id: number }> {
    const reference = await this.getReferenceById(id);

    await this.referenceRepository.remove(reference);

    return { deleted: true, id };
  }
}
