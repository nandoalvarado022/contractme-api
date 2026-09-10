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
import { CreatePropertyInterestedDto } from "./dto/create-property-interested.dto";
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

  async create(
    createPropertyDto: CreatePropertyDto,
    ownerUid: number,
  ): Promise<PropertyEntity> {
    const owner = await this.userRepository.findOne({
      where: { uid: ownerUid },
    });

    if (!owner) {
      throw new NotFoundException(`Owner with ID ${ownerUid} not found`);
    }

    const newProperty = this.propertyRepository.create({
      city: createPropertyDto.city,
      address: createPropertyDto.address,
      image: createPropertyDto.image,
      price: createPropertyDto.price,
      type: createPropertyDto.type,
      bedrooms: createPropertyDto.bedrooms,
      bathrooms: createPropertyDto.bathrooms,
      area: createPropertyDto.area,
      description: createPropertyDto.description,
      registration_number: createPropertyDto.registrationNumber,
      owner_uid: ownerUid,
    });
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

  private buildPropertyQuery() {
    return this.propertyRepository
      .createQueryBuilder("property")
      .leftJoin("property.owner", "owner")
      .addSelect([
        "owner.uid",
        "owner.name",
        "owner.last_name",
        "owner.email",
        "owner.phone",
        "owner.picture",
      ])
      .leftJoin("property.tenant", "tenant")
      .addSelect([
        "tenant.uid",
        "tenant.name",
        "tenant.last_name",
        "tenant.email",
        "tenant.phone",
        "tenant.picture",
      ])
      .leftJoinAndSelect("property.notes", "notes")
      .leftJoinAndSelect("property.interested", "interested");
  }

  async findAll(): Promise<PropertyEntity[]> {
    return this.buildPropertyQuery().getMany();
  }

  async findOne(id: number): Promise<PropertyEntity> {
    const property = await this.buildPropertyQuery()
      .where("property.id = :id", { id })
      .getOne();
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

    if (updatePropertyDto.ownerUid) {
      const owner = await this.userRepository.findOne({
        where: { uid: updatePropertyDto.ownerUid },
      });
      if (!owner) {
        throw new NotFoundException(
          `Owner with ID ${updatePropertyDto.ownerUid} not found`,
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

    if (updateData.city !== undefined) property.city = updateData.city;
    if (updateData.address !== undefined) property.address = updateData.address;
    if (updateData.image !== undefined) property.image = updateData.image;
    if (updateData.price !== undefined) property.price = updateData.price;
    if (updateData.type !== undefined) property.type = updateData.type;
    if (updateData.bedrooms !== undefined)
      property.bedrooms = updateData.bedrooms;
    if (updateData.bathrooms !== undefined)
      property.bathrooms = updateData.bathrooms;
    if (updateData.area !== undefined) property.area = updateData.area;
    if (updateData.description !== undefined)
      property.description = updateData.description;
    if (updateData.ownerUid !== undefined)
      property.owner_uid = updateData.ownerUid;
    if (updateData.registrationNumber !== undefined)
      property.registration_number = updateData.registrationNumber;

    await this.propertyRepository.save(property);

    if (notes) {
      await this.noteRepository.delete({ property_id: id });

      if (notes.length > 0) {
        for (const noteDto of notes) {
          const note = this.noteRepository.create({
            text: noteDto.text,
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
            name: interestedDto.name,
            phone: interestedDto.phone,
            email: interestedDto.email,
            user_id: interestedDto.userId,
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
    await this.propertyRepository.softRemove(property);
  }

  async restore(id: number): Promise<PropertyEntity> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    if (!property.deleted_at) {
      throw new NotFoundException(`Property with ID ${id} is not deleted`);
    }

    await this.propertyRepository.recover(property);
    return this.findOne(id);
  }

  findByOwner(ownerId: number): Promise<PropertyEntity[]> {
    return this.buildPropertyQuery()
      .where("property.owner_uid = :ownerId", { ownerId })
      .getMany();
  }

  async findByTenant(tenantId: number): Promise<PropertyEntity[]> {
    return this.buildPropertyQuery()
      .where("property.tenant_id = :tenantId", { tenantId })
      .getMany();
  }

  async addNote(
    propertyId: number,
    noteData: CreatePropertyNoteDto,
  ): Promise<PropertyNote> {
    const property = await this.findOne(propertyId);

    const note = this.noteRepository.create({
      text: noteData.text,
      property_id: property.id,
    });

    return await this.noteRepository.save(note);
  }

  async addInterested(
    propertyId: number,
    interestedData: CreatePropertyInterestedDto,
  ): Promise<PropertyInterested> {
    const property = await this.findOne(propertyId);

    const interested = this.interestedRepository.create({
      name: interestedData.name,
      phone: interestedData.phone,
      email: interestedData.email,
      user_id: interestedData.userId,
      property_id: property.id,
    });

    return await this.interestedRepository.save(interested);
  }
}
