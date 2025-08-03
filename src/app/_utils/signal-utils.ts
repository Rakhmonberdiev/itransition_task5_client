import { signal, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
export function debouncedSignal<T>(sig: Signal<T>, debounceDelay: number) {
  const deb$ = toObservable(sig).pipe(debounceTime(debounceDelay));
  return toSignal(deb$, { initialValue: sig() });
}

export function mediaQuerySignal(query: string): Signal<boolean> {
  const mql = window.matchMedia(query);
  const s = signal(mql.matches);
  const handler = (e: MediaQueryListEvent) => s.set(e.matches);
  mql.addEventListener('change', handler);
  return s;
}
