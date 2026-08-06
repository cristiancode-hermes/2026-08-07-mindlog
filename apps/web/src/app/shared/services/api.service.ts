import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Entry,
  Tag,
  Analytics,
  PaginatedResponse,
  CreateEntryRequest,
  UpdateEntryRequest,
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  // ── Entries ──

  getEntries(params?: {
    page?: number;
    limit?: number;
    tag?: string;
    mood?: number;
    search?: string;
  }): Observable<PaginatedResponse<Entry>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page != null) httpParams = httpParams.set('page', params.page);
      if (params.limit != null) httpParams = httpParams.set('limit', params.limit);
      if (params.tag) httpParams = httpParams.set('tag', params.tag);
      if (params.mood != null) httpParams = httpParams.set('mood', params.mood);
      if (params.search) httpParams = httpParams.set('search', params.search);
    }
    return this.http.get<PaginatedResponse<Entry>>('/api/entries', {
      params: httpParams,
    });
  }

  getEntryByDate(date: string): Observable<Entry | null> {
    return this.http.get<Entry | null>(`/api/entries/date/${date}`);
  }

  getEntry(id: number): Observable<Entry> {
    return this.http.get<Entry>(`/api/entries/${id}`);
  }

  createEntry(data: CreateEntryRequest): Observable<Entry> {
    return this.http.post<Entry>('/api/entries', data);
  }

  updateEntry(id: number, data: UpdateEntryRequest): Observable<Entry> {
    return this.http.put<Entry>(`/api/entries/${id}`, data);
  }

  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(`/api/entries/${id}`);
  }

  // ── Tags ──

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>('/api/tags');
  }

  createTag(data: { name: string; color?: string }): Observable<Tag> {
    return this.http.post<Tag>('/api/tags', data);
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`/api/tags/${id}`);
  }

  // ── Analytics ──

  getAnalytics(months?: number): Observable<Analytics> {
    let params = new HttpParams();
    if (months != null) params = params.set('months', months);
    return this.http.get<Analytics>('/api/analytics/mood-trends', {
      params,
    });
  }
}
