import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { BalanceEntity } from "../entities/balance/entities/balance.entity";
import { TransactionsEntity } from "../entities/transactions/entities/transactions.entity";
import { TRANSACTION_TYPE } from "../entities/transactions/consts/transactions.const";

interface ReconciliationResult {
  userId: number;
  currentBalance: number;
  calculatedBalance: number;
  difference: number;
  corrected: boolean;
}

@Injectable()
export class BalanceReconciliationService {
  private readonly logger = new Logger(BalanceReconciliationService.name);

  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceRepository: Repository<BalanceEntity>,
    @InjectRepository(TransactionsEntity)
    private readonly transactionsRepository: Repository<TransactionsEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Cron job that runs every day at 3:00 AM
   * Reconciles all user balances with their transaction history
   */
  @Cron("0 3 * * *", {
    name: "balance-reconciliation",
    timeZone: "America/Bogota",
  })
  async handleBalanceReconciliation(): Promise<void> {
    this.logger.log("Starting balance reconciliation cron job...");

    const startTime = Date.now();
    let totalProcessed = 0;
    let totalCorrected = 0;
    let totalErrors = 0;

    try {
      // Get all balances
      const balances = await this.balanceRepository.find({
        select: ["id", "uid", "amount"],
      });

      this.logger.log(`Found ${balances.length} balances to reconcile`);

      // Process each balance
      for (const balance of balances) {
        try {
          const result = await this.reconcileUserBalance(balance.uid);
          totalProcessed++;

          if (result.corrected) {
            totalCorrected++;
            this.logger.warn(
              `Balance corrected for user ${result.userId}: ` +
                `Current: ${result.currentBalance}, ` +
                `Calculated: ${result.calculatedBalance}, ` +
                `Difference: ${result.difference}`,
            );
          }
        } catch (error) {
          totalErrors++;
          this.logger.error(
            `Error reconciling balance for user ${balance.uid}: ${error.message}`,
            error.stack,
          );
        }
      }

      const duration = Date.now() - startTime;
      this.logger.log(
        `Balance reconciliation completed in ${duration}ms. ` +
          `Processed: ${totalProcessed}, Corrected: ${totalCorrected}, Errors: ${totalErrors}`,
      );
    } catch (error) {
      this.logger.error(
        `Fatal error in balance reconciliation: ${error.message}`,
        error.stack,
      );
    }
  }

  async reconcileUserBalance(uid: number): Promise<ReconciliationResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const balance = await queryRunner.manager.findOne(BalanceEntity, {
        where: { uid },
        lock: { mode: "pessimistic_write" }, // Lock the row to prevent concurrent modifications
      });

      if (!balance) {
        this.logger.warn(`No balance found for user ${uid}, skipping...`);
        await queryRunner.rollbackTransaction();
        return {
          userId: uid,
          currentBalance: 0,
          calculatedBalance: 0,
          difference: 0,
          corrected: false,
        };
      }

      const currentBalance = Number(balance.amount);

      // Calculate expected balance from all transactions
      const transactions = await queryRunner.manager.find(TransactionsEntity, {
        where: {
          balance: { uid },
        },
        order: {
          createdAt: "ASC",
        },
      });

      let calculatedBalance = 0;
      for (const transaction of transactions) {
        const amount = Number(transaction.amount);
        if (transaction.type === TRANSACTION_TYPE.ADD) {
          calculatedBalance += amount;
        } else if (transaction.type === TRANSACTION_TYPE.REMOVE) {
          calculatedBalance -= amount;
        }
      }

      // Round to 2 decimal places to avoid floating point errors
      calculatedBalance = Math.round(calculatedBalance * 100) / 100;
      const difference =
        Math.round((currentBalance - calculatedBalance) * 100) / 100;

      // Check if there's a discrepancy (allowing for small floating point errors)
      const needsCorrection = Math.abs(difference) > 0.01;

      if (needsCorrection) {
        // Update the balance to match calculated value
        balance.amount = calculatedBalance;

        // Update last_transaction_id to the most recent transaction
        if (transactions.length > 0) {
          const lastTransaction = transactions[transactions.length - 1];
          balance.last_transaction_id = lastTransaction.id;
        }

        await queryRunner.manager.save(BalanceEntity, balance);
        await queryRunner.commitTransaction();

        return {
          userId: uid,
          currentBalance,
          calculatedBalance,
          difference,
          corrected: true,
        };
      }

      await queryRunner.commitTransaction();

      return {
        userId: uid,
        currentBalance,
        calculatedBalance,
        difference: 0,
        corrected: false,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async manualReconciliation(uid?: number): Promise<ReconciliationResult[]> {
    this.logger.log(
      uid
        ? `Manual reconciliation triggered for user ${uid}`
        : "Manual reconciliation triggered for all users",
    );

    const results: ReconciliationResult[] = [];

    if (uid) {
      // Reconcile specific user
      const result = await this.reconcileUserBalance(uid);
      results.push(result);
    } else {
      // Reconcile all users
      const balances = await this.balanceRepository.find({
        select: ["uid"],
      });

      for (const balance of balances) {
        try {
          const result = await this.reconcileUserBalance(balance.uid);
          results.push(result);
        } catch (error) {
          this.logger.error(
            `Error in manual reconciliation for user ${balance.uid}: ${error.message}`,
          );
        }
      }
    }

    return results;
  }

  async getReconciliationReport(uid?: number): Promise<ReconciliationResult[]> {
    this.logger.log(
      uid
        ? `Generating reconciliation report for user ${uid}`
        : "Generating reconciliation report for all users",
    );

    const results: ReconciliationResult[] = [];
    const balances = uid
      ? await this.balanceRepository.find({ where: { uid } })
      : await this.balanceRepository.find();

    for (const balance of balances) {
      try {
        const currentBalance = Number(balance.amount);

        // Get all transactions for this user
        const transactions = await this.transactionsRepository.find({
          where: {
            balance: { uid: balance.uid },
          },
          order: {
            createdAt: "ASC",
          },
        });

        // Calculate expected balance
        let calculatedBalance = 0;
        for (const transaction of transactions) {
          const amount = Number(transaction.amount);
          if (transaction.type === TRANSACTION_TYPE.ADD) {
            calculatedBalance += amount;
          } else if (transaction.type === TRANSACTION_TYPE.REMOVE) {
            calculatedBalance -= amount;
          }
        }

        calculatedBalance = Math.round(calculatedBalance * 100) / 100;
        const difference =
          Math.round((currentBalance - calculatedBalance) * 100) / 100;

        results.push({
          userId: balance.uid,
          currentBalance,
          calculatedBalance,
          difference,
          corrected: false,
        });
      } catch (error) {
        this.logger.error(
          `Error generating report for user ${balance.uid}: ${error.message}`,
        );
      }
    }

    return results;
  }
}
