import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { BookModule } from 'src/books/books.module';

@Module({
  imports: [BookModule],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
