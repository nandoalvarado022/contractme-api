import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { BalanceReconciliationService } from "./balance-reconciliation.service";

@ApiTags("Reconciliation")
@Controller("reconciliation")
export class ReconciliationController {
  constructor(
    private readonly reconciliationService: BalanceReconciliationService,
  ) {}

  @Post("run")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Run balance reconciliation for all users",
    description:
      "Manually triggers balance reconciliation process for all users. Compares calculated balances from transactions with stored balances and corrects any discrepancies.",
  })
  @ApiResponse({
    status: 200,
    description: "Reconciliation completed successfully",
    schema: {
      example: {
        success: true,
        message: "Reconciliation completed successfully",
        data: {
          totalProcessed: 50,
          totalCorrected: 3,
          correctedUsers: [1, 5, 12],
          results: [
            {
              userId: 1,
              corrected: true,
              oldBalance: 10000,
              newBalance: 10500,
              difference: 500,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error during reconciliation",
  })
  async runReconciliation(): Promise<{
    success: boolean;
    message: string;
    data: {
      totalProcessed: number;
      totalCorrected: number;
      correctedUsers: number[];
      results: any[];
    };
  }> {
    const results = await this.reconciliationService.manualReconciliation();

    const corrected = results.filter((r) => r.corrected);
    const correctedUsers = corrected.map((r) => r.userId);

    return {
      success: true,
      message: "Reconciliation completed successfully",
      data: {
        totalProcessed: results.length,
        totalCorrected: corrected.length,
        correctedUsers,
        results,
      },
    };
  }

  @Post("run/:uid")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Run balance reconciliation for specific user",
    description:
      "Manually triggers balance reconciliation for a specific user. Compares calculated balance from transactions with stored balance and corrects any discrepancy.",
  })
  @ApiParam({
    name: "uid",
    description: "User ID",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Reconciliation completed for user",
    schema: {
      example: {
        success: true,
        message: "Reconciliation completed for user 1",
        data: {
          userId: 1,
          corrected: true,
          oldBalance: 10000,
          newBalance: 10500,
          difference: 500,
          transactionsCount: 25,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 500,
    description: "Internal server error during reconciliation",
  })
  async runReconciliationForUser(
    @Param("uid", ParseIntPipe) uid: number,
  ): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    const results = await this.reconciliationService.manualReconciliation(uid);

    return {
      success: true,
      message: `Reconciliation completed for user ${uid}`,
      data: results[0],
    };
  }

  @Get("report")
  @ApiOperation({
    summary: "Get reconciliation report for all users",
    description:
      "Retrieves a detailed report comparing stored balances with calculated balances from transactions for all users. Shows discrepancies without making corrections.",
  })
  @ApiResponse({
    status: 200,
    description: "Reconciliation report retrieved successfully",
    schema: {
      example: {
        success: true,
        data: {
          totalUsers: 50,
          usersWithDiscrepancies: 3,
          discrepancies: [
            {
              userId: 1,
              uid: 1,
              userName: "Juan Pérez",
              storedBalance: 10000,
              calculatedBalance: 10500,
              difference: 500,
              transactionsCount: 25,
            },
          ],
          report: [
            {
              userId: 1,
              uid: 1,
              userName: "Juan Pérez",
              storedBalance: 10000,
              calculatedBalance: 10500,
              difference: 500,
              transactionsCount: 25,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error while generating report",
  })
  async getReconciliationReport(): Promise<{
    success: boolean;
    data: {
      totalUsers: number;
      usersWithDiscrepancies: number;
      discrepancies: any[];
      report: any[];
    };
  }> {
    const report = await this.reconciliationService.getReconciliationReport();

    const discrepancies = report.filter((r) => Math.abs(r.difference) > 0.01);

    return {
      success: true,
      data: {
        totalUsers: report.length,
        usersWithDiscrepancies: discrepancies.length,
        discrepancies,
        report,
      },
    };
  }

  @Get("report/:uid")
  @ApiOperation({
    summary: "Get reconciliation report for specific user",
    description:
      "Retrieves a detailed report comparing stored balance with calculated balance from transactions for a specific user. Shows any discrepancy without making corrections.",
  })
  @ApiParam({
    name: "uid",
    description: "User ID",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Reconciliation report retrieved successfully",
    schema: {
      example: {
        success: true,
        data: {
          userId: 1,
          uid: 1,
          userName: "Juan Pérez",
          storedBalance: 10000,
          calculatedBalance: 10500,
          difference: 500,
          transactionsCount: 25,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 500,
    description: "Internal server error while generating report",
  })
  async getReconciliationReportForUser(
    @Param("uid", ParseIntPipe) uid: number,
  ): Promise<{
    success: boolean;
    data: any;
  }> {
    const report = await this.reconciliationService.getReconciliationReport(
      uid,
    );

    return {
      success: true,
      data: report[0] || null,
    };
  }
}
