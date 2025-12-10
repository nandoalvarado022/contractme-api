import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BalanceEntity } from './entities/balance.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceRepository: Repository<BalanceEntity>
  ) {}

  async getBalanceByUserId(uid: number): Promise<BalanceEntity> {
    const balance = await this.balanceRepository.findOne({
      where: { uid },
      relations: ['lastTransactionId'],
    });

    if (!balance) {
      throw new NotFoundException(`Balance not found for user with ID ${uid}`);
    }

    return balance;
  }

  async createBalance(uid: number): Promise<BalanceEntity> {
    // Check if balance already exists
    const existingBalance = await this.balanceRepository.findOne({
      where: { uid },
    });

    if (existingBalance) {
      throw new BadRequestException(
        `Balance already exists for user with ID ${uid}`
      );
    }

    const balance = this.balanceRepository.create({
      uid,
      amount: 0,
    });

    return this.balanceRepository.save(balance);
  }

  async getOrCreateBalance(uid: number): Promise<BalanceEntity> {
    let balance = await this.balanceRepository.findOne({
      where: { uid },
      relations: ['lastTransactionId'],
    });

    if (!balance) {
      balance = await this.createBalance(uid);
    }

    return balance;
  }

  async hasSufficientBalance(uid: number, amount: number): Promise<boolean> {
    const balance = await this.balanceRepository.findOne({
      where: { uid },
    });

    if (!balance) {
      return false;
    }

    return Number(balance.amount) >= amount;
  }

  async getBalanceAmount(uid: number): Promise<number> {
    const balance = await this.balanceRepository.findOne({
      where: { uid },
    });

    if (!balance) {
      throw new NotFoundException(`Balance not found for user with ID ${uid}`);
    }

    return Number(balance.amount);
  }

  async getAllBalances(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    balances: BalanceEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [balances, total] = await this.balanceRepository.findAndCount({
      relations: ['lastTransactionId', 'user'],
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      balances,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getBalancesWithFunds(): Promise<BalanceEntity[]> {
    return this.balanceRepository
      .createQueryBuilder('balance')
      .where('balance.amount > :amount', { amount: 0 })
      .leftJoinAndSelect('balance.user', 'user')
      .leftJoinAndSelect('balance.lastTransactionId', 'transaction')
      .orderBy('balance.amount', 'DESC')
      .getMany();
  }

  async getTotalBalance(): Promise<number> {
    const result = await this.balanceRepository
      .createQueryBuilder('balance')
      .select('SUM(balance.amount)', 'total')
      .getRawOne();

    return Number(result.total) ?? 0;
  }
}
