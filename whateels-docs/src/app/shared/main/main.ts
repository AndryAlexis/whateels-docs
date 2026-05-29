import { isPlatformBrowser } from '@angular/common';
import { Component, effect, ElementRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { RightSidebar } from '../right-sidebar/right-sidebar';
import { Footer } from '../footer/footer';
import { Divider } from '../divider/divider';
import { PaginationComponent } from '../pagination/pagination';
import { MarkdownComponent } from 'ngx-markdown';
import { ObservableSectionService } from '../services/observable-section.service';

@Component({
  selector: 'app-main',
  imports: [RightSidebar, Footer, Divider, PaginationComponent, MarkdownComponent],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly route = inject(ActivatedRoute);
  private readonly observableSectionService = inject(ObservableSectionService);
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
    this.assignSectionIds();
    this.isMarkdownLoading.set(false);
  }

  onMarkdownError(): void {
    this.isMarkdownLoading.set(false);
  }

  private assignSectionIds(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const markdownRoot = this.hostElement.nativeElement.querySelector('.markdown-content');
    if (!markdownRoot) {
      return;
    }

    const headings = Array.from(markdownRoot.querySelectorAll('h2')) as HTMLElement[];
    headings.forEach((heading) => {
      const text = heading.textContent?.trim() ?? '';
      heading.id = this.slugify(text);
    });

    this.observableSectionService.observeElements(headings.filter((heading) => heading.id.length > 0));
  }

  private slugify(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private normalizePathSegment(value: string | null): string | null {
    if (!value) {
      return null;
    }

    return /^[A-Za-z0-9_-]+$/.test(value) ? value : null;
  }
}
