import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PropertyEntity } from "./property.entity";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { UpdatePropertyDto } from "./dto/update-property.dto";
import { PropertyNote } from "./property-note.entity";
import { PropertyInterested } from "./property-interested.entity";
import { UserEntity } from "src/entities/user/user.entity";
import { CreatePropertyNoteDto } from "./dto/create-property-note.dto";
// import { AuditLogsEntity } from "src/audit_logs/audit.entity"

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly propertyRepository: Repository<PropertyEntity>,

    @InjectRepository(PropertyNote)
    private readonly noteRepository: Repository<PropertyNote>,

    @InjectRepository(PropertyInterested)
    private readonly interestedRepository: Repository<PropertyInterested>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, // @InjectRepository(AuditLogsEntity)
    // private readonly logsRepository: Repository<AuditLogsEntity>
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<PropertyEntity> {
    const owner = await this.userRepository.findOne({
      where: { uid: createPropertyDto.owner_uid },
    });

    if (!owner) {
      throw new NotFoundException(
        `Owner with ID ${createPropertyDto.owner_uid} not found`,
      );
    }

    const { notes, interested, ...propertyData } = createPropertyDto;
    const newProperty = this.propertyRepository.create(propertyData);
    const savedProperty = await this.propertyRepository.save(newProperty);

    // if (notes && notes.length > 0) {
    //   for (const noteDto of notes) {
    //     const note = this.noteRepository.create({
    //       ...noteDto,
    //       property_id: savedProperty.id,
    //     })
    //     await this.noteRepository.save(note)
    //   }
    // }

    // if (interested && interested.length > 0) {
    //   for (const interestedDto of interested) {
    //     const interestedPerson = this.interestedRepository.create({
    //       ...interestedDto,
    //       property_id: savedProperty.id,
    //     })
    //     await this.interestedRepository.save(interestedPerson)
    //   }
    // }

    // this.logsRepository.save({
    //   description: "Property created",
    //   data: JSON.stringify(savedProperty),
    //   table: "properties",
    //   entity_id: savedProperty.id,
    //   uid: createPropertyDto.owner_uid,
    // });

    return this.findOne(savedProperty.id);
  }

  async findAll(): Promise<PropertyEntity[]> {
    return this.propertyRepository.find();
  }

  async findOne(id: number): Promise<PropertyEntity> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<PropertyEntity> {
    const property = await this.findOne(id);

    if (updatePropertyDto.owner_uid) {
      const owner = await this.userRepository.findOne({
        where: { uid: updatePropertyDto.owner_uid },
      });
      if (!owner) {
        throw new NotFoundException(
          `Owner with ID ${updatePropertyDto.owner_uid} not found`,
        );
      }
    }

    // if (updatePropertyDto.tenant_id) {
    //   const tenant = await this.userRepository.findOne({
    //     where: { uid: updatePropertyDto.tenant_id },
    //   })
    //   if (!tenant) {
    //     throw new NotFoundException(
    //       `Tenant with ID ${updatePropertyDto.tenant_id} not found`
    //     )
    //   }
    // }

    const { notes, interested, ...updateData } = updatePropertyDto;

    Object.assign(property, updateData);
    await this.propertyRepository.save(property);

    if (notes) {
      await this.noteRepository.delete({ property_id: id });

      if (notes.length > 0) {
        for (const noteDto of notes) {
          const note = this.noteRepository.create({
            ...noteDto,
            property_id: id,
          });
          await this.noteRepository.save(note);
        }
      }
    }

    if (interested) {
      await this.interestedRepository.delete({ property_id: id });

      if (interested.length > 0) {
        for (const interestedDto of interested) {
          const interestedPerson = this.interestedRepository.create({
            ...interestedDto,
            property_id: id,
          });
          await this.interestedRepository.save(interestedPerson);
        }
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const property = await this.findOne(id);

    await this.noteRepository.delete({ property_id: id });

    await this.interestedRepository.delete({ property_id: id });

    await this.propertyRepository.remove(property);
  }

  findByOwner(ownerId: number): Promise<PropertyEntity[]> {
    return this.propertyRepository.find({
      where: { owner_uid: ownerId },
    });
  }

  async findByTenant(tenantId: number): Promise<PropertyEntity[]> {
    return this.propertyRepository.find({
      where: { tenant_id: tenantId },
    });
  }

  async addNote(
    propertyId: number,
    noteData: CreatePropertyNoteDto,
  ): Promise<PropertyNote> {
    const property = await this.findOne(propertyId);

    const note = this.noteRepository.create({
      ...noteData,
      property_id: property.id,
    });

    return await this.noteRepository.save(note as any);
  }

  async addInterested(
    propertyId: number,
    interestedData: any,
  ): Promise<PropertyInterested> {
    const property = await this.findOne(propertyId);

    const interested = this.interestedRepository.create({
      ...interestedData,
      property_id: property.id,
    });

    return await this.interestedRepository.save(interested as any);
  }
}
