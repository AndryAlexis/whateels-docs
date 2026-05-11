import { Component, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchModalService } from '../services/search-modal.service';

type SearchResultItem = {
  title: string;
  subtitle: string;
  selected: boolean;
};

@Component({
  selector: 'app-search-modal',
  imports: [FormsModule],
  templateUrl: './search-modal.html',
  styleUrl: './search-modal.css',
})
export class SearchModal {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  searchQuery = '';
  resultItems: SearchResultItem[] = [
    {
      title: 'Getting started',
      subtitle: 'Introduction',
      selected: true,
    },
    {
      title: 'Getting help',
      subtitle: 'Introduction / Getting started',
      selected: false,
    },
    {
      title: 'Installation',
      subtitle: 'Introduction / Installation',
      selected: false,
    },
  ];
  results = [
    'Angular Basics',
    'Angular Signals',
    'Angular Services',
    'Angular Directives',
    'Angular Routing',
    'Angular Forms',
    'Angular Animations',
    'Angular Testing',
    'Angular Deployment',
    'Angular Performance'
  ];

  getResults(query: string): string[] {
    if (!query) return [];
    const lower = query.toLowerCase();
    return this.results.filter(r => r.toLowerCase().includes(lower));
  }
  constructor(public searchModalService: SearchModalService) {}

  @HostBinding('class.active')
  get isActive(): boolean {
    this.searchInput?.nativeElement.focus();
    return this.searchModalService.isOpen();
  }

  onSearchQueryChange(): void {
    // Handle search query changes here, e.g., filter results or perform a search
    console.log('Search query:', this.searchQuery);

    const results = this.getResults(this.searchQuery);
    console.log('Search results:', results);
  }

  onResultHover(index: number): void {
    this.resultItems = this.resultItems.map((item, currentIndex) => ({
      ...item,
      selected: currentIndex === index,
    }));
  }

  onResultsMouseLeave(): void {
    this.resultItems = this.resultItems.map((item, currentIndex) => ({
      ...item,
      selected: currentIndex === 0,
    }));
  }

  getAriaSelectedItems(): SearchResultItem[] {
    return this.resultItems.filter((item) => item.selected);
  }
}
