import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type DocSection = {
    id: string;
    title: string;
    paragraphs: string[];
};

export type DocPage = {
    slug: string;
    title: string;
    summary?: string;
    sections: DocSection[];
    previous: { slug: string; title: string };
    next: { slug: string; title: string };
};

export const DEFAULT_DOC_SLUG = 'Getting Started';

@Injectable({ providedIn: 'root' })
export class DocPageService {
  private readonly http = inject(HttpClient);

  getPage(slug: string) {
    return this.http.get<DocPage>(`/api/pages/${encodeURIComponent(slug)}`);
  }
}