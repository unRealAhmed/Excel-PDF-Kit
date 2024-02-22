import * as mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Book extends mongoose.Document {
  isbn: string;
  title: string;
  author: string;
  pages: number;
}

export const BookSchema = new Schema<Book>({
  isbn: String,
  title: String,
  author: String,
  pages: Number,
});

export const BookModel = mongoose.model<Book>('Book', BookSchema);
