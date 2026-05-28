import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  HostBinding,
  inject,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { SearchModalService } from '../services/search-modal.service';
import { SlugifyPipe } from '../pipes/slugify.pipe';

@Component({
  selector: 'app-search-modal',
  imports: [FormsModule, RouterLink],
  providers: [SlugifyPipe],
  templateUrl: './search-modal.html',
  styleUrl: './search-modal.css',
})
export class SearchModal {
  @ViewChild('searchInput') private readonly searchInput?: ElementRef<HTMLInputElement>;

  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly searchStream$ = new Subject<string>();

  searchQuery = '';
  readonly isLoading = signal(false);
  readonly selectedIndex = signal(-1);

  constructor(public readonly searchModalService: SearchModalService) {
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

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        console.log('ArrowDown pressed. Current selected index:', this.selectedIndex());
        break;
      case 'ArrowUp':
        event.preventDefault();
        console.log('ArrowUp pressed. Current selected index:', this.selectedIndex());
        break;
      case 'Enter': {
        event.preventDefault();
        console.log('Selected index on Enter:', this.selectedIndex());
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
    console.log('Mouse left results. Current selected index:', this.selectedIndex());
  }

  private reset(): void {
    this.searchQuery = '';
    this.selectedIndex.set(-1);
    this.isLoading.set(false);
    this.searchStream$.next('');
  }
}
