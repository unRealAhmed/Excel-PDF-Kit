import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ExcelService } from './excel.service';
import { Book } from 'src/schemas/book.schema';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Get('export')
  async export(@Res() res: Response): Promise<void> {
    await this.excelService.export(res);
  }

  @Post('upload')
  async uploadExcel(
    @Req() req: Request,
  ): Promise<{ message: string; data: Book[] }> {
    const insertedBooks =
      await this.excelService.parseExcelFileAndExtractRequests(req);

    return {
      message: 'Success',
      data: insertedBooks,
    };
  }
}
