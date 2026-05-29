import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BalanceEntity } from "./entities/balance.entity";
import { last } from "rxjs";

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceRepository: Repository<BalanceEntity>,
  ) {}

  async getBalanceByUserId(uid: number) {
    const balance = await this.balanceRepository.findOne({
      where: { uid },
      relations: ["lastTransactionId"],
    });

    if (!balance) {
      throw new NotFoundException(`Balance not found for user with ID ${uid}`);
    }

    return {
      id: balance.id,
      amount: balance.amount,
      last_transaction: balance.lastTransactionId,
      createdAt: balance.createdAt,
      updatedAt: balance.updatedAt,
    };
  }

  async createBalance(uid: number): Promise<BalanceEntity> {
    const existingBalance = await this.balanceRepository.findOne({
      where: { uid },
    });

    if (existingBalance) {
      throw new BadRequestException(
        `Balance already exists for user with ID ${uid}`,
      );
    }

    const balance = this.balanceRepository.create({
      uid,
      amount: 0,
    });

    return this.balanceRepository.save(balance);
  }

  async deductBalance(uid: number, amount: number): Promise<BalanceEntity> {
    const balance = await this.balanceRepository.findOne({ where: { uid } });

    if (!balance) {
      throw new NotFoundException(`Balance not found for user with ID ${uid}`);
    }

    const currentAmount = Number(balance.amount);
    const newAmount = currentAmount - Number(amount);

    if (newAmount < 0) {
      throw new BadRequestException(
        `Insufficient balance. Current balance: ${currentAmount}, Required: ${amount}`,
      );
    }

    balance.amount = newAmount;
    return this.balanceRepository.save(balance);
  }
}
