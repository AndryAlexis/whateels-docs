import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type ChatApiResponse = {
  message: string;
  needsHumanSupport: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class WhateelbotApiService {
  private readonly http = inject(HttpClient);

  send(message: string): Observable<ChatApiResponse> {
    return this.http.post<ChatApiResponse>('/chat', { message });
  }
}
