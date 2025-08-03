import { Component, input, signal } from '@angular/core';
import { BookDto } from '../../_models/book.model';
import { mediaQuerySignal } from '../../_utils/signal-utils';

@Component({
  selector: 'app-books-table',
  imports: [],
  templateUrl: './books-table.html',
  styleUrl: './books-table.css',
})
export class BooksTable {
  books = input<BookDto[]>();
  expandedIndex = signal<number | null>(null);
  isMobile = mediaQuerySignal('(max-width: 767px)');

  toggle(book: BookDto) {
    const was = this.expandedIndex() === book.index;
    this.expandedIndex.set(was ? null : book.index);
  }
}
