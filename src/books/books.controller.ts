import { Controller, Get, Post, Body } from '@nestjs/common';
import { Book } from '../schemas/book.schema';
import { BookService } from './books.service';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Post()
  async create(@Body() book: Book): Promise<Book> {
    return this.bookService.create(book);
  }
}
