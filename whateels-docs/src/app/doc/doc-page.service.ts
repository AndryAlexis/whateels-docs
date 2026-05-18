import { inject, Injectable } from '@angular/core';
import { ApiEndpointsService } from '../shared/services/api-endpoints.service';

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
  private readonly apiEndpoints = inject(ApiEndpointsService);

  async getPage(slug: string): Promise<DocPage> {
    return this.apiEndpoints.getPage(slug);
  }
}