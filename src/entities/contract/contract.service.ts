import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MailService } from "src/common/emails/mail.service";
import { DeepPartial, Repository } from "typeorm";
import { GlobalVariablesService } from "../global-variables/global-variables.service";
import { TRANSACTION_TYPE } from "../transactions/consts/transactions.const";
import { TransactionsService } from "../transactions/transaction.service";
import { STATUS_CONTRACT } from "./consts/contract.consts";
import { GenerateContractDto } from "./dtos/generate-contract.dto";
import { ContractEntity } from "./entities/contract.entity";
import { ContractTemplateEntity } from "./entities/contract_templates.entity";

@Injectable()
export class ContractService {
  private readonly EMAIL_NOTIFICATION_SIGNATURE = "gabrielacharrisr@gmail.com";
  private readonly EMAIL_NOTIFICATION_SIGNATURE_2 = "alvaropedrozo07@gmail.com";
  private readonly EMAIL_NOTIFICATION_SIGNATURE_3 =
    "nandoalvarado022@gmail.com";

  constructor(
    @InjectRepository(ContractTemplateEntity)
    private contractTemplatesRepository: Repository<ContractTemplateEntity>,
    @InjectRepository(ContractEntity)
    private contractsRepository: Repository<ContractEntity>,
    private readonly transactionsService: TransactionsService,
    private readonly globalVariablesService: GlobalVariablesService,
    private readonly emailService: MailService,
  ) {}

  async generateOne(
    generateContractDto: GenerateContractDto,
    url: string | null,
    uid: number,
  ) {
    const costVariable = await this.globalVariablesService.findByKey(
      "contract_generation_cost",
    );
    const amount = parseInt(costVariable.value, 10);

    await this.transactionsService.createTransaction({
      uid,
      concept: "Generación de contrato",
      amount,
      type: TRANSACTION_TYPE.REMOVE,
    });

    if (generateContractDto.hasSignature) {
      const recipients = [
        this.EMAIL_NOTIFICATION_SIGNATURE,
        this.EMAIL_NOTIFICATION_SIGNATURE_2,
        this.EMAIL_NOTIFICATION_SIGNATURE_3,
      ];

      const emailPayload = {
        tenantName: generateContractDto.tenantName ?? "No especificado",
        tenantEmail: generateContractDto.tenantEmail ?? "No especificado",
        tenantPhone: generateContractDto.tenantPhone ?? "No especificado",
        lessorName: generateContractDto.lessorName ?? "No especificado",
        lessorEmail: generateContractDto.lessorEmail ?? "No especificado",
        lessorPhone: generateContractDto.lessorPhone ?? "No especificado",
        templateId: String(generateContractDto.templateId ?? "N/A"),
        url: url ?? "No especificado",
        date: new Date().toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      };

      void Promise.allSettled(
        recipients.map((recipient) =>
          this.emailService.sendEmailBrevo(
            recipient,
            "Admin",
            "new_generation_contract_with_signature",
            emailPayload,
          ),
        ),
      ).then((results) => {
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            console.error(
              `Error sending contract signature email to ${recipients[index]}:`,
              result.reason,
            );
          }
        });
      });
    }

    const contract = this.contractsRepository.create(
      this.toContractColumns(generateContractDto, url, uid),
    );
    return await this.contractsRepository.save(contract);
  }

  private toContractColumns(
    dto: GenerateContractDto,
    url: string | null,
    uid: number,
  ): DeepPartial<ContractEntity> {
    return {
      tenant_uid: dto.tenantUid ?? undefined,
      lessor_uid: uid ?? undefined,
      tenant_name: dto.tenantName ?? undefined,
      tenant_email: dto.tenantEmail ?? undefined,
      tenant_phone: dto.tenantPhone ?? undefined,
      tenant_lastname: dto.tenantLastname ?? undefined,
      tenant_document_type: dto.tenantDocumentType ?? undefined,
      tenant_document: dto.tenantDocument ?? undefined,
      tenant_address: dto.tenantAddress ?? undefined,
      tenant_legal_representative: dto.tenantLegalRepresentative ?? undefined,
      lessor_name: dto.lessorName ?? undefined,
      lessor_email: dto.lessorEmail ?? undefined,
      lessor_phone: dto.lessorPhone ?? undefined,
      lessor_lastname: dto.lessorLastname ?? undefined,
      lessor_document: dto.lessorDocument ?? undefined,
      lessor_document_type: dto.lessorDocumentType ?? undefined,
      lessor_address: dto.lessorAddress ?? undefined,
      lessor_legal_representative: dto.lessorLegalRepresentative ?? undefined,
      cosigner_name: dto.cosignerName ?? undefined,
      cosigner_document: dto.cosignerDocument ?? undefined,
      cosigner_address: dto.cosignerAddress ?? undefined,
      cosigner_email: dto.cosignerEmail ?? undefined,
      cosigner_phone: dto.cosignerPhone ?? undefined,
      duration: dto.duration ?? undefined,
      canon: dto.canon ?? undefined,
      start_date: dto.startDate ?? undefined,
      end_date: dto.endDate ?? undefined,
      place_address: dto.placeAddress ?? undefined,
      place_municipio: dto.placeMunicipio ?? undefined,
      registration_number: dto.registrationNumber ?? undefined,
      hasSignature: dto.hasSignature ?? undefined,
      ct_id: dto.templateId ?? undefined,
      url: url ?? undefined,
    };
  }

  async getOneTemplate(id: number) {
    const template = await this.contractTemplatesRepository.findOne({
      where: { ct_id: id, status: STATUS_CONTRACT.ACTIVE },
      relations: {
        fields: true,
      },
      order: {
        fields: {
          order: "ASC",
        },
      },
    });
    if (!template) throw new NotFoundException("Contract template not found");
    return template;
  }

  async getAllTemplates() {
    const templates = await this.contractTemplatesRepository.find({
      where: { status: STATUS_CONTRACT.ACTIVE },
      relations: {
        fields: true,
      },
      order: {
        fields: {
          order: "ASC",
        },
      },
    });

    if (templates.length === 0)
      throw new NotFoundException("No contract templates found");

    return templates;
  }
}
