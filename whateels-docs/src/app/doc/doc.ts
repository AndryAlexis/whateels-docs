import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Header } from '../shared/header/header';
import { Main } from '../shared/main/main';
import { LeftSidebar } from '../shared/left-sidebar/left-sidebar';
import { SearchModal } from '../shared/search-modal/search-modal';
import { DEFAULT_DOC_SLUG, DocPage, DocPageService } from './doc-page.service';

type DocViewState = {
  slug: string;
  loading: boolean;
  page: DocPage | null;
  error: string | null;
};

@Component({
  selector: 'app-doc',
  imports: [AsyncPipe, Header, Main, LeftSidebar, SearchModal],
  templateUrl: './doc.html',
  styleUrl: './doc.css',
})
export class Doc {
  private readonly route = inject(ActivatedRoute);
  private readonly docPageService : DocPageService = inject(DocPageService);

  readonly pageState$ = this.route.paramMap.pipe(
    map((params) => params.get('slug') ?? DEFAULT_DOC_SLUG),
    switchMap((slug) =>
      this.docPageService.getPage(slug).pipe(
        map(
          (page): DocViewState => ({
            slug,
            loading: false,
            page,
            error: null,
          })
        ),
        startWith({ slug, loading: true, page: null, error: null } as DocViewState),
        catchError(() =>
          of({
            slug,
            loading: false,
            page: null,
            error: `Unable to load the page "${slug}".`,
          } satisfies DocViewState)
        )
      )
    )
  );
}
