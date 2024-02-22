import { Injectable, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as Busboy from 'busboy';
import { Request, Response } from 'express';
import { BookService } from 'src/books/books.service';
// import { Book } from 'src/schemas/book.schema';

@Injectable()
export class ExcelService {
  constructor(private readonly bookService: BookService) {}

  async export(res: Response): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Books');
    const data = await this.bookService.findAll();

    sheet.columns = [
      { header: 'ISBN', key: 'isbn', width: 25 },
      { header: 'Title', key: 'title', width: 50 },
      { header: 'Author', key: 'author', width: 50 },
      { header: 'Pages Count', key: 'pages', width: 10 },
    ];

    data.forEach((value) => {
      const { isbn, title, author, pages } = value;
      sheet.addRow({ isbn, title, author, pages });
    });

    /*  
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' <= Mina's MimiType
    */
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment;filename="booksData.csv"');

    await workbook.csv.write(res);
  }

  async parseExcelFileAndExtractRequests(req: Request) {
    const worksheet = await this.extractExcelFile(req);
    const extractedData = this.processWorksheet(worksheet);
    return this.bookService.insertManyBooks(extractedData);
  }

  async extractExcelFile(req: Request): Promise<ExcelJS.Worksheet> {
    return new Promise((resolve, reject) => {
      const bb = Busboy({ headers: req.headers });

      bb.on('file', async (name, file, info) => {
        const { filename, encoding, mimeType } = info;
        const workBook = new ExcelJS.Workbook();

        console.log(
          `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
          filename,
          encoding,
          mimeType,
        );

        try {
          await workBook.csv.read(file);
          const worksheet = workBook.getWorksheet(1);
          if (!worksheet) {
            throw new NotFoundException(`Could not find worksheet`);
          }
          resolve(worksheet);
        } catch (err) {
          reject(err);
        }
      });

      bb.on('error', (err) => {
        reject(err);
      });

      req.pipe(bb);
    });
  }

  processWorksheet(worksheet: ExcelJS.Worksheet): any[] {
    const data: any[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const rowData: any = {};
        rowData.isbn = this.getCellValue(row, 1) as string;
        rowData.title = this.getCellValue(row, 2) as string;
        rowData.author = this.getCellValue(row, 3) as string;
        rowData.pages = this.getCellValue(row, 4) as string;
        console.log(rowData);
        data.push(rowData);
      }
    });
    return data;
  }

  getCellValue(row: ExcelJS.Row, cellIndex: number): string | unknown {
    return row.getCell(cellIndex).value as unknown as string;
  }
}
