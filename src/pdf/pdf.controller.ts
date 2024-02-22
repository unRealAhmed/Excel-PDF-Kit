import { Controller, Get, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('Invoice')
  async createInvoice(@Res() res: Response) {
    return this.pdfService.invoice(res);
  }
}
