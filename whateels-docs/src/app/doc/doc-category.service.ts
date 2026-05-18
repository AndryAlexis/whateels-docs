import { Injectable, inject } from '@angular/core';
import { ApiEndpointsService } from '../shared/services/api-endpoints.service';

export interface DocCategory {
  id: string;
  title: string;
  pages: Array<{
    title: string;
    slug: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiEndpoints = inject(ApiEndpointsService);

  async getCategories(): Promise<DocCategory[]> {
    return await this.apiEndpoints.getCategories();
  }
}
