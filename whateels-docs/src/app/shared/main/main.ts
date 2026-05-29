import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { RightSidebar } from '../right-sidebar/right-sidebar';
import { Footer } from '../footer/footer';
import { Divider } from '../divider/divider';
import { PaginationComponent } from '../pagination/pagination';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-main',
  imports: [RightSidebar, Footer, Divider, PaginationComponent, MarkdownComponent],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  private readonly route = inject(ActivatedRoute);
  readonly isMarkdownLoading = signal(true);

  readonly markdownSrc = toSignal(
    this.route.paramMap.pipe(
      map((params) => {
        const category = this.normalizePathSegment(params.get('category'));
        const page = this.normalizePathSegment(params.get('page'));

        return `assets/pages/${category ?? 'category_0'}/${page ?? 'introduction'}.md`;
      })
    ),
    { initialValue: 'assets/pages/category_0/introduction.md' }
  );

  constructor() {
    effect(() => {
      this.markdownSrc();
      this.isMarkdownLoading.set(true);
    });
  }

  onMarkdownReady(): void {
    this.isMarkdownLoading.set(false);
  }

  onMarkdownError(): void {
    this.isMarkdownLoading.set(false);
  }

  private normalizePathSegment(value: string | null): string | null {
    if (!value) {
      return null;
    }

    return /^[A-Za-z0-9_-]+$/.test(value) ? value : null;
  }
}
