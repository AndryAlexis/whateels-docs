import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocCategory } from '../../doc/doc-category.service';
import { DocPage } from '../../doc/doc-page.service';
import { environment } from '../../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';

export type SearchResultPageRef = {
  id: number;
  slug: string;
  title: string;
};

export type SearchResultSection = {
  id: number;
  heading: string;
};

export type SearchResultItem = {
  type: 'page' | 'section';
  page: SearchResultPageRef;
  section: SearchResultSection | null;
};

export type SearchApiResponse = {
  query: string;
  limit: number;
  count: number;
  results: SearchResultItem[];
};

@Injectable({
  providedIn: 'root',
})
export class ApiEndpointsService {
  readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getGitHubLoginUrl(): string {
    return `${this.apiBaseUrl}/auth/github/login`;
  }

  async getCategories(): Promise<DocCategory[]> {
    return firstValueFrom(
      this.http.get<DocCategory[]>(`${this.apiBaseUrl}/category`)
    );
  }

  async getPage(slug: string): Promise<DocPage> {
    return firstValueFrom(
      this.http.get<DocPage>(`${this.apiBaseUrl}/page/${encodeURIComponent(slug)}`)
    );
  }

  async revokeGitHubToken(accessToken: string): Promise<void> {
    await firstValueFrom(
      this.http.post<void>(`${this.apiBaseUrl}/auth/github/logout`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    );
  }

  searchDocs(query: string, limit: number): Observable<SearchApiResponse> {
    return this.http.get<SearchApiResponse>(`${this.apiBaseUrl}/search`, {
      params: { q: query, limit },
    });
  }
}
