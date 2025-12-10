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
import { BalanceService } from "./balance.service";
import { BalanceEntity } from "./entities/balance.entity";

@Controller("balance")
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get(":uid")
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
