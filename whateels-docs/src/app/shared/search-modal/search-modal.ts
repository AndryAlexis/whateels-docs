import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  Component,
  effect,
  ElementRef,
  HostBinding,
  inject,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import {
  ApiEndpointsService,
  SearchResultItem,
} from '../services/api-endpoints.service';
import { SearchModalService } from '../services/search-modal.service';

const SEARCH_LIMIT = 10;

@Component({
  selector: 'app-search-modal',
  imports: [FormsModule, RouterLink],
  templateUrl: './search-modal.html',
  styleUrl: './search-modal.css',
})
export class SearchModal {
  @ViewChild('searchInput') private readonly searchInput?: ElementRef<HTMLInputElement>;

  private readonly router = inject(Router);
  private readonly apiEndpoints = inject(ApiEndpointsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly searchStream$ = new Subject<string>();

  searchQuery = '';
  readonly results = signal<SearchResultItem[]>([]);
  readonly isLoading = signal(false);
  readonly selectedIndex = signal(-1);

  constructor(public readonly searchModalService: SearchModalService) {
    this.searchStream$
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query.trim()) {
            return of(null);
          }
          return this.apiEndpoints
            .searchDocs(query.trim(), SEARCH_LIMIT)
            .pipe(catchError(() => of(null)));
        }),
        takeUntilDestroyed()
      )
      .subscribe((response) => {
        const newResults = response?.results ?? [];
        this.results.set(newResults);
        this.selectedIndex.set(newResults.length > 0 ? 0 : -1);
        this.isLoading.set(false);
      });

    effect(() => {
      if (this.searchModalService.isOpen()) {
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
        }
      } else {
        this.reset();
      }
    });
  }

  @HostBinding('class.active')
  get isActive(): boolean {
    return this.searchModalService.isOpen();
  }

  get hasQuery(): boolean {
    return this.searchQuery.trim().length > 0;
  }

  readonly hasResults = computed(() => this.results().length > 0);

  get selectedResult(): SearchResultItem | null {
    return this.selectedIndex() >= 0 ? (this.results()[this.selectedIndex()] ?? null) : null;
  }

  get selectedResultOptionId(): string | null {
    return this.selectedIndex() >= 0 ? `search-option-${this.selectedIndex()}` : null;
  }

  resultOptionId(index: number): string {
    return `search-option-${index}`;
  }

  resultTitle(item: SearchResultItem): string {
    return item.page.title;
  }

  resultSubtitle(item: SearchResultItem): string {
    return item.type === 'section' ? item.section!.heading : '';
  }

  trackResult(item: SearchResultItem): string {
    return item.type === 'section'
      ? `section-${item.section!.id}`
      : `page-${item.page.id}`;
  }

  onSearchInput(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.isLoading.set(this.searchQuery.trim().length > 0 && this.results().length === 0);
    this.searchStream$.next(this.searchQuery);
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (this.results().length) {
          this.selectedIndex.set((this.selectedIndex() + 1) % this.results().length);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.results().length) {
          this.selectedIndex.set(
            (this.selectedIndex() - 1 + this.results().length) % this.results().length,
          );
        }
        break;
      case 'Enter': {
        const result = this.selectedResult;
        if (result) {
          this.navigateTo(result);
        }
        break;
      }
      case 'Escape':
        this.searchModalService.close();
        break;
    }
  }

  onResultHover(index: number): void {
    this.selectedIndex.set(index);
  }

  onResultsMouseLeave(): void {
    this.selectedIndex.set(this.results().length > 0 ? 0 : -1);
  }

  navigateTo(item: SearchResultItem): void {
    this.searchModalService.close();
    this.router.navigate([item.page.slug]);
  }

  private reset(): void {
    this.searchQuery = '';
    this.results.set([]);
    this.selectedIndex.set(-1);
    this.isLoading.set(false);
    this.searchStream$.next('');
  }
}
