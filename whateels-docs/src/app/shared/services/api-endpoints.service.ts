import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocCategory } from '../../doc/doc-category.service';
import { DocPage } from '../../doc/doc-page.service';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiEndpointsService {
  readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

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
}
