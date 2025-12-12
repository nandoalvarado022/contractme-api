import { Controller, Get, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { BalanceService } from "./balance.service";
import { BalanceEntity } from "./entities/balance.entity";
import { UserId } from "src/common/decorators/user.decorator";

@ApiTags("Balance")
@Controller("balance")
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  @ApiOperation({
    summary: "Get balance by user ID",
    description:
      "Retrieves the balance information for a specific user including related transaction and user details",
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
          amount: 100050,
          last_transaction_id: 5,
          last_transaction: {
            id: 5,
            amount: 50000,
            type: "deposit",
          },
          createdAt: "2025-12-09T10:00:00.000Z",
          updatedAt: "2025-12-09T10:00:00.000Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Balance not found for the specified user",
    schema: {
      example: {
        success: false,
        message: "Balance not found",
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid user ID format",
  })
  async getBalance(@UserId() uid: number) {
    const balance = await this.balanceService.getBalanceByUserId(uid);

    return {
      success: true,
      data: balance,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create new balance",
    description:
      "Creates a new balance account for a user with initial amount of 0",
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
    description: "Balance already exists for this user or invalid user ID",
    schema: {
      example: {
        success: false,
        message: "Balance already exists for this user",
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  async createBalance(@UserId() uid: number): Promise<{
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
}
