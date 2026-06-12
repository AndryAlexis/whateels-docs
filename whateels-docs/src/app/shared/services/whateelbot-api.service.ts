import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ChatApiResponse = {
  message: string;
  needsHumanSupport: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class WhateelbotApiService {
  private readonly http = inject(HttpClient);
  private readonly chatEndpoint = `${environment.chatApiBaseUrl.replace(/\/$/, '')}/chat`;

  send(message: string): Observable<ChatApiResponse> {
    return this.http.post<ChatApiResponse>(this.chatEndpoint, { message });
  }
}
