import { Component, input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class PaginationComponent {
  public readonly previous = input<{ slug: string; title: string } | null>(null);
  public readonly next = input<{ slug: string; title: string } | null>(null);
}