import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TransactionsEntity } from './entities/transactions.entity';
import { BalanceEntity } from '../balance/entities/balance.entity';
import { UserEntity } from '../user/user.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { GetTransactionsDto } from './dtos/get-transactions.dto';
import {
  TRANSACTION_TYPE,
  TRANSACTION_STATUS,
} from './consts/transactions.const';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(TransactionsEntity)
    private readonly transactionsRepository: Repository<TransactionsEntity>,
    @InjectRepository(BalanceEntity)
    private readonly balanceRepository: Repository<BalanceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const { uid, email, concept, amount, type } = createTransactionDto;
    let userUid = uid;

    if (email) {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      userUid = user.uid;
    }

    if (!userUid) {
      throw new BadRequestException('Either uid or email must be provided');
    }

    const balance = await this.balanceRepository.findOne({
      where: { uid: userUid },
    });

    if (!balance) {
      throw new NotFoundException(
        `Balance not found for user with ID ${userUid}`
      );
    }

    const currentAmount = Number(balance.amount);
    let newAmount: number = 0;

    if (type === TRANSACTION_TYPE.ADD) {
      newAmount = currentAmount + Number(amount);
    }
    if (type === TRANSACTION_TYPE.REMOVE) {
      newAmount = currentAmount - Number(amount);
    }
    if (newAmount < 0) {
      throw new BadRequestException(
        `Insufficient balance. Current balance: ${currentAmount}, Requested: ${amount}`
      );
    }

    const user = await this.userRepository.findOne({
      where: { uid: userUid },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userUid} not found`);
    }
    const transaction = this.transactionsRepository.create({
      concept,
      amount,
      type,
      status: TRANSACTION_STATUS.COMPLETED,
      userId: { uid: userUid },
    });

    const savedTransaction = await this.transactionsRepository.save(
      transaction
    );

    const newBalance = {
      ...balance,
      amount: newAmount,
      last_transaction_id: savedTransaction.id,
    };
    await this.balanceRepository.save(newBalance);

    return {
      id: savedTransaction.id,
      uid: userUid,
      createdAt: savedTransaction.createdAt,
      concept: savedTransaction.concept,
      amount: savedTransaction.amount,
      type: savedTransaction.type,
      status: savedTransaction.status,
    };
  }

  async getTransactionsByUser(getTransactionsDto: GetTransactionsDto): Promise<{
    transactions: TransactionsEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { uid, page = 1, limit = 10 } = getTransactionsDto;

    const user = await this.userRepository.findOne({
      where: { uid },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${uid} not found`);
    }

    const skip = (page - 1) * limit;

    const [transactions, total] =
      await this.transactionsRepository.findAndCount({
        where: {
          userId: { uid },
        },
        order: {
          createdAt: 'DESC',
        },
        skip,
        take: limit,
      });

    const totalPages = Math.ceil(total / limit);

    return {
      transactions,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getTransactionById(id: number): Promise<TransactionsEntity> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }
}
