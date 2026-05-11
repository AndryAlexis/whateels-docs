import { Component, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchModalService } from '../services/search-modal.service';

type SearchResultItem = {
  id: number;
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
      id: 1,
      title: 'Getting started',
      subtitle: 'Introduction',
      selected: true,
    },
    {
      id: 2,
      title: 'Getting help',
      subtitle: 'Introduction / Getting started',
      selected: false,
    },
    {
      id: 3,
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

  get filteredResultItems(): SearchResultItem[] {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      return this.resultItems;
    }

    return this.resultItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query)
      );
    });
  }

  get hasFilteredResults(): boolean {
    return this.filteredResultItems.length > 0;
  }

  get hasSearchQuery(): boolean {
    return this.searchQuery.trim().length > 0;
  }

  onSearchQueryChange(): void {
    // Handle search query changes here, e.g., filter results or perform a search
    console.log('Search query:', this.searchQuery);

    const results = this.getResults(this.searchQuery);
    console.log('Search results:', results);

    const firstFilteredItem = this.filteredResultItems[0];

    if (!firstFilteredItem) {
      this.resultItems = this.resultItems.map((item) => ({
        ...item,
        selected: false,
      }));
      return;
    }

    this.resultItems = this.resultItems.map((item) => ({
      ...item,
      selected: item.id === firstFilteredItem.id,
    }));
  }

  onResultHover(itemId: number): void {
    this.resultItems = this.resultItems.map((item, currentIndex) => ({
      ...item,
      selected: item.id === itemId,
    }));
  }

  onResultsMouseLeave(): void {
    const firstFilteredItem = this.filteredResultItems[0];

    if (!firstFilteredItem) {
      return;
    }

    this.resultItems = this.resultItems.map((item, currentIndex) => ({
      ...item,
      selected: item.id === firstFilteredItem.id,
    }));
  }

  getAriaSelectedItems(): SearchResultItem[] {
    return this.resultItems.filter((item) => item.selected);
  }
}
