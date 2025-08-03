import {
  Component,
  computed,
  effect,
  EventEmitter,
  output,
  Output,
  signal,
} from '@angular/core';
import { BookRequestDto } from '../../_services/books.service';
import { debouncedSignal } from '../../_utils/signal-utils';

@Component({
  selector: 'app-books-filter',
  imports: [],
  templateUrl: './books-filter.html',
  styleUrl: './books-filter.css',
})
export class BooksFilter {
  filterChange = output<BookRequestDto>();
  locale = signal<string>('en');
  seed = signal<number>(123);
  avgLikes = signal<number>(0);
  avgReviews = signal<number>(0);
  constructor() {
    const debSeed = debouncedSignal(this.seed, 500);
    const debAvgLikes = debouncedSignal(this.avgLikes, 500);
    const debAvgReviews = debouncedSignal(this.avgReviews, 500);
    const dto = computed(() => {
      const b = new BookRequestDto();
      b.locale = this.locale();
      b.seed = debSeed();
      b.avgLikes = debAvgLikes();
      b.avgReviews = debAvgReviews();
      return b;
    });
    effect(() => {
      this.filterChange.emit(dto());
    });
  }

  blockNonNumeric(event: KeyboardEvent) {
    const invalid = ['e', 'E', '+', '-', '.'];
    if (invalid.includes(event.key)) event.preventDefault();
  }

  onSeedInput(event: Event) {
    const num = (event.target as HTMLInputElement).valueAsNumber;
    this.seed.set(isNaN(num) ? 0 : num);
  }
}
