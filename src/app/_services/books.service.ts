import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BookDto } from '../_models/book.model';

export class BookRequestDto {
  locale: string = 'en';
  page: number = 0;
  pageSize: number = 10;
  seed: number = 123;
  avgLikes: number = 0;
  avgReviews: number = 0;
}
@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'books';

  getBooks(req: BookRequestDto): Observable<BookDto[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(req) as [
      keyof BookRequestDto,
      any
    ]) {
      params = params.set(key, String(value));
    }

    return this.http.get<BookDto[]>(this.baseUrl, { params });
  }
}
