import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  async invoice(res: Response): Promise<any> {
    const doc = new PDFDocument({ size: 'A4', compress: true });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Report.pdf"');
    doc.pipe(res);

    doc
      .fontSize(25)
      .text(
        'If debugging is the process of removing software bugs, then programming must be the process of putting them in!',
        100,
        100,
        {
          align: 'center',
        },
      );

    doc.image('./src/assets/memes.png', {
      fit: [250, 300],
      align: 'center',
    });

    doc.end();
  }
}
