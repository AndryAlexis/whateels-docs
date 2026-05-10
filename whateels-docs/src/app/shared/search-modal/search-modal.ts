import { Component, HostBinding, ViewChild, ElementRef, effect } from '@angular/core';
import { SearchModalService } from '../services/search-modal.service';

@Component({
  selector: 'app-search-modal',
  imports: [],
  templateUrl: './search-modal.html',
  styleUrl: './search-modal.css',
})
export class SearchModal {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  constructor(public searchModalService: SearchModalService) {}

  @HostBinding('class.active')
  get isActive(): boolean {
    this.searchInput?.nativeElement.focus();
    return this.searchModalService.isOpen();
  }
}
