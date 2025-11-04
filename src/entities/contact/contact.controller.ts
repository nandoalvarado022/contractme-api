import { Body, Controller, Post } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dtos/create-contact.dto";

@Controller("contact-me")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async contactMe(@Body() createContactDto: CreateContactDto) {
    return await this.contactService.contactMe(createContactDto);
  }
}
