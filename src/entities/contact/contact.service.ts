import { Injectable } from "@nestjs/common";
import { ContactEntity } from "./contact.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateContactDto } from "./dtos/create-contact.dto";
import { MailService } from "src/common/emails/mail.service";

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
    private readonly mailService: MailService,
  ) {}

  async contactMe(createContactDto: CreateContactDto) {
    const contact = this.contactRepository.create(createContactDto);
    const savedContact = await this.contactRepository.save(contact);

    try {
      await this.mailService.sendEmailBrevo(
        createContactDto.email,
        createContactDto.fullName,
        "contact_confirmation",
        {
          name: createContactDto.fullName,
        },
      );
    } catch (error) {
      console.error("Error enviando correo de confirmación al lead:", error);
    }

    try {
      await this.mailService.sendEmailBrevo(
        "contractme395@gmail.com",
        "Equipo ContractMe",
        "new_lead_notification",
        {
          fullName: createContactDto.fullName,
          email: createContactDto.email,
          phone: createContactDto.phone || "No proporcionado",
          reason: createContactDto.reason,
          message: createContactDto.message,
          date: new Date().toLocaleString("es-ES", {
            timeZone: "America/Mexico_City",
            dateStyle: "full",
            timeStyle: "short",
          }),
        },
      );
    } catch (error) {
      console.error("Error enviando notificación de nuevo lead:", error);
    }

    return savedContact;
  }
}
