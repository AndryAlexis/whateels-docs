import { Component, input } from '@angular/core';

@Component({
  selector: 'app-search-modal',
  imports: [],
  templateUrl: './search-modal.html',
  styleUrl: './search-modal.css',
})
export class SearchModal {
  isActive = input<boolean>(false);
}
