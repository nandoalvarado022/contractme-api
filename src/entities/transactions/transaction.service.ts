import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { TransactionsEntity } from "./entities/transactions.entity";
import { BalanceEntity } from "../balance/entities/balance.entity";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";
import { GetTransactionsDto } from "./dtos/get-transactions.dto";
import {
  TRANSACTION_TYPE,
  TRANSACTION_STATUS,
} from "./consts/transactions.const";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionsEntity)
    private readonly transactionsRepository: Repository<TransactionsEntity>,
    @InjectRepository(BalanceEntity)
    private readonly balanceRepository: Repository<BalanceEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionsEntity> {
    const { uid, concept, amount, type } = createTransactionDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let balance = await queryRunner.manager.findOne(BalanceEntity, {
        where: { uid },
      });

      if (!balance) {
        balance = queryRunner.manager.create(BalanceEntity, {
          uid,
          amount: 0,
        });
        balance = await queryRunner.manager.save(BalanceEntity, balance);
      }

      const currentAmount = Number(balance.amount);
      let newAmount: number;

      if (type === TRANSACTION_TYPE.ADD) {
        newAmount = currentAmount + Number(amount);
      } else if (type === TRANSACTION_TYPE.REMOVE) {
        newAmount = currentAmount - Number(amount);

        if (newAmount < 0) {
          throw new BadRequestException(
            `Insufficient balance. Current balance: ${currentAmount}, Requested: ${amount}`,
          );
        }
      } else {
        throw new BadRequestException("Invalid transaction type");
      }

      // Create the transaction
      const transaction = queryRunner.manager.create(TransactionsEntity, {
        concept,
        amount,
        type,
        status: TRANSACTION_STATUS.COMPLETED,
      });
      const savedTransaction = await queryRunner.manager.save(
        TransactionsEntity,
        transaction,
      );

      // Update balance with new amount and last transaction
      balance.amount = newAmount;
      balance.last_transaction_id = savedTransaction.id;
      await queryRunner.manager.save(BalanceEntity, balance);

      // Commit the transaction
      await queryRunner.commitTransaction();

      return savedTransaction;
    } catch (error) {
      // Rollback on error
      await queryRunner.rollbackTransaction();

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Failed to create transaction: " + error.message,
      );
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async getTransactionsByUser(getTransactionsDto: GetTransactionsDto): Promise<{
    transactions: TransactionsEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { uid, page = 1, limit = 10 } = getTransactionsDto;

    // Get balance to verify user has a balance record
    const balance = await this.balanceRepository.findOne({
      where: { uid },
      relations: ["lastTransactionId"],
    });

    if (!balance) {
      return {
        transactions: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    // Get paginated transactions
    const skip = (page - 1) * limit;

    const [transactions, total] =
      await this.transactionsRepository.findAndCount({
        where: {
          balance: { uid },
        },
        order: {
          createdAt: "DESC",
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

  async getUserTransactionHistory(uid: number): Promise<TransactionsEntity[]> {
    const balance = await this.balanceRepository.findOne({
      where: { uid },
    });

    if (!balance) {
      return [];
    }

    return this.transactionsRepository.find({
      where: {
        balance: { uid },
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async getLastTransaction(uid: number): Promise<TransactionsEntity | null> {
    const balance = await this.balanceRepository.findOne({
      where: { uid },
      relations: ["lastTransactionId"],
    });

    if (!balance || !balance.lastTransactionId) {
      return null;
    }

    return balance.lastTransactionId;
  }
}
