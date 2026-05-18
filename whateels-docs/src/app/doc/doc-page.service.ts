import { inject, Injectable } from '@angular/core';
import { ApiEndpointsService } from '../shared/services/api-endpoints.service';
import { DocCategory } from './doc-category.service';

export type DocPageLink = {
  slug: string;
  title: string;
};

export type DocParagraph = {
  id: number;
  body: string;
  sort_order: number;
};

export type DocSection = {
  id: number;
  heading: string;
  sort_order: number;
  paragraphs: DocParagraph[];
};

export type DocPage = {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  category: DocCategory;
  previous_page: DocPageLink | null;
  next_page: DocPageLink | null;
  sections: DocSection[];
};

type RawDocPage = Omit<DocPage, 'category'> & {
  category: {
    id: number | string;
    title: string;
    pages?: Array<{
      title: string;
      slug: string;
    }>;
  };
};

export const DEFAULT_DOC_SLUG = 'what-is-eel-spectrum';

@Injectable({ providedIn: 'root' })
export class DocPageService {
  private readonly apiEndpoints = inject(ApiEndpointsService);

  async getPage(slug: string): Promise<DocPage> {
    const page = (await this.apiEndpoints.getPage(slug)) as unknown as RawDocPage;
    return {
      ...page,
      category: {
        id: String(page.category.id),
        title: page.category.title,
        pages: page.category.pages ?? [],
      },
      sections: [...page.sections]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((section) => ({
          ...section,
          paragraphs: [...section.paragraphs].sort((a, b) => a.sort_order - b.sort_order),
        })),
    };
  }
}