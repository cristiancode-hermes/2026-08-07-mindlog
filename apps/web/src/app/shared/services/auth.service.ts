import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal(false);

  constructor() {
    const token = this.getToken();
    if (token) {
      this.isAuthenticated.set(true);
      this.loadProfile().subscribe({
        error: () => this.logout(),
      });
    }
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', data).pipe(
      tap((res) => {
        localStorage.setItem('mindlog_token', res.accessToken);
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
      }),
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', data).pipe(
      tap((res) => {
        localStorage.setItem('mindlog_token', res.accessToken);
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
      }),
    );
  }

  loadProfile(): Observable<User> {
    return this.http.get<User>('/api/users/me').pipe(
      tap((user) => {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      }),
    );
  }

  updateProfile(data: { displayName?: string }): Observable<User> {
    return this.http.put<User>('/api/users/me', data).pipe(
      tap((user) => this.currentUser.set(user)),
    );
  }

  getToken(): string | null {
    return localStorage.getItem('mindlog_token');
  }

  logout(): void {
    localStorage.removeItem('mindlog_token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
