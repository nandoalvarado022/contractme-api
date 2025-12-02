import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { BalanceReconciliationService } from "./balance-reconciliation.service";

@Controller("reconciliation")
export class ReconciliationController {
  constructor(
    private readonly reconciliationService: BalanceReconciliationService,
  ) {}

  @Post("run")
  @HttpCode(HttpStatus.OK)
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
