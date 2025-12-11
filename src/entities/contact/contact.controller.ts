import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dtos/create-contact.dto";

@ApiTags("Landing Page")
@Controller("contact-me")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Submit contact form from landing page",
    description:
      "Receives contact information from the landing page, saves it as a lead, and sends confirmation emails to both the contact and the admin team.",
  })
  @ApiBody({ type: CreateContactDto })
  @ApiResponse({
    status: 201,
    description: "Contact form submitted successfully and emails sent",
    schema: {
      example: {
        lid: 1,
        fullName: "María González",
        email: "maria.gonzalez@example.com",
        phone: "+1234567890",
        reason: "information",
        message: "I would like to know more about your services",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data",
    schema: {
      example: {
        message: ["email must be an email", "fullName should not be empty"],
        error: "Bad Request",
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
  })
  async contactMe(@Body() createContactDto: CreateContactDto) {
    return await this.contactService.contactMe(createContactDto);
  }
}
