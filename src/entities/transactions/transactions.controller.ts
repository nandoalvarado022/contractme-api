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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from "@nestjs/swagger";
import { TransactionsService } from "./transaction.service";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";
import { GetTransactionsDto } from "./dtos/get-transactions.dto";
import { TransactionsEntity } from "./entities/transactions.entity";
import { UserId } from "src/common/decorators/user.decorator";

@ApiTags("Transactions")
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create new transaction",
    description:
      "Creates a new transaction and automatically updates the user's balance. Supports both ADD and REMOVE transaction types. Uses database transactions to ensure data consistency.",
  })
  @ApiBody({
    type: CreateTransactionDto,
    description: "Transaction data",
    examples: {
      addTransaction: {
        summary: "Add funds",
        value: {
          uid: 1,
          concept: "Payment received",
          amount: 50000,
          type: "add",
        },
      },
      removeTransaction: {
        summary: "Remove funds",
        value: {
          uid: 1,
          concept: "Service payment",
          amount: 10000,
          type: "remove",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Transaction created successfully and balance updated",
    schema: {
      example: {
        success: true,
        message: "Transaction created successfully",
        data: {
          id: 1,
          concept: "Payment received",
          amount: 50000,
          type: "add",
          status: "completed",
          createdAt: "2025-12-09T10:00:00.000Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid data or insufficient balance",
    schema: {
      example: {
        success: false,
        message:
          "Insufficient balance. Current balance: 10000, Requested: 50000",
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      "Internal server error - Transaction failed and was rolled back",
  })
  async create(
    @Body(ValidationPipe) createTransactionDto: CreateTransactionDto,
  ) {
    const transaction = await this.transactionsService.createTransaction(
      createTransactionDto,
    );

    return {
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    };
  }

  @Get("user")
  @ApiOperation({
    summary: "Get transactions by user",
    description:
      "Retrieves paginated list of transactions for a specific user, ordered by creation date descending",
  })
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
    description: "Page number (default: 1)",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    description: "Items per page (default: 10)",
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: "Transactions retrieved successfully",
    schema: {
      example: {
        success: true,
        data: {
          transactions: [
            {
              id: 1,
              concept: "Payment received",
              amount: 50000,
              type: "add",
              status: "completed",
              createdAt: "2025-12-09T10:00:00.000Z",
            },
          ],
          pagination: {
            total: 25,
            page: 1,
            limit: 10,
            totalPages: 3,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid user ID format",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  async getByUser(
    @UserId() uid: number,
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

  @Get(":id")
  @ApiOperation({
    summary: "Get transaction by ID",
    description: "Retrieves a specific transaction by its unique identifier",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Transaction ID",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Transaction retrieved successfully",
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          concept: "Payment received",
          amount: 50000,
          type: "add",
          status: "completed",
          createdAt: "2025-12-09T10:00:00.000Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Transaction not found",
  })
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
