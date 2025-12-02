import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from "@nestjs/common";
import { TransactionsService } from "./transaction.service";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";
import { GetTransactionsDto } from "./dtos/get-transactions.dto";
import { TransactionsEntity } from "./entities/transactions.entity";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createTransactionDto: CreateTransactionDto,
  ): Promise<{
    success: boolean;
    message: string;
    data: TransactionsEntity;
  }> {
    const transaction = await this.transactionsService.createTransaction(
      createTransactionDto,
    );

    return {
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    };
  }

  @Get("user/:uid")
  async getByUser(
    @Param("uid", ParseIntPipe) uid: number,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<{
    success: boolean;
    data: {
      transactions: TransactionsEntity[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    };
  }> {
    const getTransactionsDto: GetTransactionsDto = {
      uid,
      page: page ?? 1,
      limit: limit ?? 10,
    };

    const result = await this.transactionsService.getTransactionsByUser(
      getTransactionsDto,
    );

    return {
      success: true,
      data: {
        transactions: result.transactions,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      },
    };
  }

  @Get("history/:uid")
  async getHistory(@Param("uid", ParseIntPipe) uid: number): Promise<{
    success: boolean;
    data: TransactionsEntity[];
  }> {
    const transactions =
      await this.transactionsService.getUserTransactionHistory(uid);

    return {
      success: true,
      data: transactions,
    };
  }

  @Get("last/:uid")
  async getLastTransaction(@Param("uid", ParseIntPipe) uid: number): Promise<{
    success: boolean;
    data: TransactionsEntity | null;
  }> {
    const transaction = await this.transactionsService.getLastTransaction(uid);

    return {
      success: true,
      data: transaction,
    };
  }

  @Get(":id")
  async getById(@Param("id", ParseIntPipe) id: number): Promise<{
    success: boolean;
    data: TransactionsEntity;
  }> {
    const transaction = await this.transactionsService.getTransactionById(id);

    return {
      success: true,
      data: transaction,
    };
  }
}
