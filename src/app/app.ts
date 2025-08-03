import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { BooksFilter } from './shared/books-filter/books-filter';
import { BookDto } from './_models/book.model';
import { BookRequestDto, BooksService } from './_services/books.service';
import { BooksTable } from './shared/books-table/books-table';
import { catchError, finalize, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [BooksFilter, BooksTable],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  books = signal<BookDto[]>([]);
  isLoading = signal(false);
  showScrollTop = signal(false);
  private booksService = inject(BooksService);
  private lastReq = signal(new BookRequestDto());
  errors = signal<string[] | null>(null);
  onSearch(req: BookRequestDto) {
    const initialReq = { ...req, page: 0 };
    this.lastReq.set(initialReq);
    this.books.set([]);
    this.loadPage(initialReq);
  }
  @HostListener('window:scroll')
  onWindowScroll() {
    this.showScrollTop.set(window.scrollY > 300);
    if (this.isLoading() || this.errors()) return;
    const threshold = 200;
    const position = window.innerHeight + window.scrollY;
    const height = document.body.offsetHeight;
    if (position + threshold >= height) {
      const next = { ...this.lastReq(), page: this.lastReq().page + 1 };
      this.lastReq.set(next);
      this.loadPage(next, false);
    }
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  private loadPage(req: BookRequestDto, replace = true) {
    this.isLoading.set(true);
    this.errors.set(null);
    this.booksService
      .getBooks(req)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 400 && err.error?.errors) {
            const validationMessages = Object.values(
              err.error.errors
            ).flat() as string[];
            this.errors.set(validationMessages);
          } else {
            this.errors.set(['Internal server error']);
          }
          return of<BookDto[]>([]);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((data) => {
        this.books.set(replace ? data : [...this.books(), ...data]);
      });
  }
}
