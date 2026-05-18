import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Header } from '../shared/header/header';
import { Main } from '../shared/main/main';
import { LeftSidebar } from '../shared/left-sidebar/left-sidebar';
import { SearchModal } from '../shared/search-modal/search-modal';
import { CategoryService, DocCategory } from './doc-category.service';
import { AuthService } from '../auth-callback/auth.service';
import { ActivatedRoute } from '@angular/router';
import { DEFAULT_DOC_SLUG, DocPage, DocPageService } from './doc-page.service';
import { catchError, of, from, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-doc',
  standalone: true,
  imports: [AsyncPipe, Header, Main, LeftSidebar, SearchModal],
  templateUrl: './doc.html',
  styleUrl: './doc.css',
})
export class Doc {
  private readonly categoryService = inject(CategoryService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly docPageService = inject(DocPageService);
  private readonly platformId = inject(PLATFORM_ID);

  categories = signal<DocCategory[] | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // Single page view state (restored)
  readonly pageState$ = this.route.paramMap.pipe(
    map((params) => params.get('slug') ?? DEFAULT_DOC_SLUG),
    switchMap((slug) =>
      from(this.docPageService.getPage(slug)).pipe(
        map(
          (page): { slug: string; loading: boolean; page: DocPage | null; error: string | null } => ({
            slug,
            loading: false,
            page,
            error: null,
          })
        ),
        startWith({ slug, loading: true, page: null, error: null }),
        catchError(() =>
          of({
            slug,
            loading: false,
            page: null,
            error: `Unable to load the page "${slug}".`,
          })
        )
      )
    )
  );

  constructor() {
    console.log('Doc component initialized.');
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    console.log('Doc component running in browser. Fetching categories...');
    this.fetchCategories();
  }

  fetchCategories() {
    this.loading.set(true);
    this.error.set(null);
    this.categoryService.getCategories().then((categories) => {
      console.log('Categories fetched successfully:', categories);
      this.loading.set(false);
      this.categories.set(categories);
    }).catch((err) => {
      console.error('Failed to fetch /category:', err);
      this.loading.set(false);
      if (err.status === 401) {
        this.authService.clearAccessToken();
        this.error.set('Your session expired. Please sign in again.');
      } else {
        this.error.set('Failed to load categories.');
      }
    });
  }
}
