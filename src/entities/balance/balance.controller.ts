import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { BalanceService } from "./balance.service";
import { BalanceEntity } from "./entities/balance.entity";

@ApiTags("Balance")
@Controller("balance")
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get(":uid")
  @ApiOperation({
    summary: "Get balance by user ID",
    description:
      "Retrieves the balance information for a specific user including related transaction and user details",
  })
  @ApiParam({
    name: "uid",
    type: Number,
    description: "User ID",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Balance retrieved successfully",
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          uid: 1,
          amount: 1000.5,
          last_transaction_id: 5,
          createdAt: "2025-12-09T10:00:00.000Z",
          updatedAt: "2025-12-09T10:00:00.000Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Balance not found for the specified user",
  })
  async getBalance(@Param("uid", ParseIntPipe) uid: number): Promise<{
    success: boolean;
    data: BalanceEntity;
  }> {
    const balance = await this.balanceService.getBalanceByUserId(uid);

    return {
      success: true,
      data: balance,
    };
  }

  @Get(":uid/amount")
  @ApiOperation({
    summary: "Get balance amount",
    description: "Retrieves only the balance amount for a specific user",
  })
  @ApiParam({
    name: "uid",
    type: Number,
    description: "User ID",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Balance amount retrieved successfully",
    schema: {
      example: {
        success: true,
        data: {
          uid: 1,
          amount: 1000.5,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Balance not found for the specified user",
  })
  async getBalanceAmount(@Param("uid", ParseIntPipe) uid: number): Promise<{
    success: boolean;
    data: {
      uid: number;
      amount: number;
    };
  }> {
    const amount = await this.balanceService.getBalanceAmount(uid);

    return {
      success: true,
      data: {
        uid,
        amount,
      },
    };
  }

  @Get(":uid/check")
  @ApiOperation({
    summary: "Check sufficient balance",
    description: "Verifies if a user has sufficient balance for a transaction",
  })
  @ApiParam({
    name: "uid",
    type: Number,
    description: "User ID",
    example: 1,
  })
  @ApiQuery({
    name: "amount",
    type: Number,
    description: "Amount to check",
    example: 500,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "Balance check completed successfully",
    schema: {
      example: {
        success: true,
        data: {
          hasSufficientBalance: true,
          currentBalance: 1000.5,
          requestedAmount: 500,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Balance not found for the specified user",
  })
  async checkSufficientBalance(
    @Param("uid", ParseIntPipe) uid: number,
    @Query("amount", ParseIntPipe) amount: number,
  ): Promise<{
    success: boolean;
    data: {
      hasSufficientBalance: boolean;
      currentBalance: number;
      requestedAmount: number;
    };
  }> {
    const hasSufficient = await this.balanceService.hasSufficientBalance(
      uid,
      amount,
    );
    const currentBalance = await this.balanceService.getBalanceAmount(uid);

    return {
      success: true,
      data: {
        hasSufficientBalance: hasSufficient,
        currentBalance,
        requestedAmount: amount,
      },
    };
  }

  @Post(":uid")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create new balance",
    description:
      "Creates a new balance account for a user with initial amount of 0",
  })
  @ApiParam({
    name: "uid",
    type: Number,
    description: "User ID",
    example: 1,
  })
  @ApiResponse({
    status: 201,
    description: "Balance created successfully",
    schema: {
      example: {
        success: true,
        message: "Balance created successfully",
        data: {
          id: 1,
          uid: 1,
          amount: 0,
          createdAt: "2025-12-09T10:00:00.000Z",
          updatedAt: "2025-12-09T10:00:00.000Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Balance already exists for this user",
  })
  async createBalance(@Param("uid", ParseIntPipe) uid: number): Promise<{
    success: boolean;
    message: string;
    data: BalanceEntity;
  }> {
    const balance = await this.balanceService.createBalance(uid);

    return {
      success: true,
      message: "Balance created successfully",
      data: balance,
    };
  }

  @Post(":uid/ensure")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Ensure balance exists",
    description:
      "Gets existing balance or creates a new one if it doesn't exist",
  })
  @ApiParam({
    name: "uid",
    type: Number,
    description: "User ID",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Balance retrieved or created successfully",
    schema: {
      example: {
        success: true,
        message: "Balance retrieved or created successfully",
        data: {
          id: 1,
          uid: 1,
          amount: 0,
          createdAt: "2025-12-09T10:00:00.000Z",
          updatedAt: "2025-12-09T10:00:00.000Z",
        },
      },
    },
  })
  async ensureBalance(@Param("uid", ParseIntPipe) uid: number): Promise<{
    success: boolean;
    message: string;
    data: BalanceEntity;
  }> {
    const balance = await this.balanceService.getOrCreateBalance(uid);

    return {
      success: true,
      message: "Balance retrieved or created successfully",
      data: balance,
    };
  }

  @Get()
  @ApiOperation({
    summary: "Get all balances",
    description: "Retrieves all balances with pagination support",
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
    description: "Balances retrieved successfully",
    schema: {
      example: {
        success: true,
        data: {
          balances: [
            {
              id: 1,
              uid: 1,
              amount: 1000.5,
              last_transaction_id: 5,
              createdAt: "2025-12-09T10:00:00.000Z",
              updatedAt: "2025-12-09T10:00:00.000Z",
            },
          ],
          pagination: {
            total: 50,
            page: 1,
            limit: 10,
            totalPages: 5,
          },
        },
      },
    },
  })
  async getAllBalances(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<{
    success: boolean;
    data: {
      balances: BalanceEntity[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    };
  }> {
    const result = await this.balanceService.getAllBalances(
      page ?? 1,
      limit ?? 10,
    );

    return {
      success: true,
      data: {
        balances: result.balances,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      },
    };
  }

  @Get("with-funds/list")
  @ApiOperation({
    summary: "Get balances with funds",
    description:
      "Retrieves all balances that have a positive amount, ordered by amount descending",
  })
  @ApiResponse({
    status: 200,
    description: "Balances with funds retrieved successfully",
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 1,
            uid: 1,
            amount: 2500.75,
            last_transaction_id: 10,
            createdAt: "2025-12-09T10:00:00.000Z",
            updatedAt: "2025-12-09T10:00:00.000Z",
          },
          {
            id: 2,
            uid: 2,
            amount: 1000.5,
            last_transaction_id: 8,
            createdAt: "2025-12-09T10:00:00.000Z",
            updatedAt: "2025-12-09T10:00:00.000Z",
          },
        ],
      },
    },
  })
  async getBalancesWithFunds(): Promise<{
    success: boolean;
    data: BalanceEntity[];
  }> {
    const balances = await this.balanceService.getBalancesWithFunds();

    return {
      success: true,
      data: balances,
    };
  }

  @Get("analytics/total")
  @ApiOperation({
    summary: "Get total balance",
    description: "Calculates and returns the sum of all balances in the system",
  })
  @ApiResponse({
    status: 200,
    description: "Total balance calculated successfully",
    schema: {
      example: {
        success: true,
        data: {
          totalBalance: 15000.75,
        },
      },
    },
  })
  async getTotalBalance(): Promise<{
    success: boolean;
    data: {
      totalBalance: number;
    };
  }> {
    const total = await this.balanceService.getTotalBalance();

    return {
      success: true,
      data: {
        totalBalance: total,
      },
    };
  }
}
