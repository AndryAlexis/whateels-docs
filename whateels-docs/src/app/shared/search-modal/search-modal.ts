import { Component, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchModalService } from '../services/search-modal.service';

@Component({
  selector: 'app-search-modal',
  imports: [FormsModule],
  templateUrl: './search-modal.html',
  styleUrl: './search-modal.css',
})
export class SearchModal {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  searchQuery = '';
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
}
