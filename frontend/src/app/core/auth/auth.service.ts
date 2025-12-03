import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private tokenKey = 'access_token';
  isAuthenticated = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticated.set(!!localStorage.getItem(this.tokenKey));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login(credentials: any) {
    return this.http.post<{ accessToken: string }>(`${environment.apiBaseUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.tokenKey, response.accessToken);
        }
        this.isAuthenticated.set(true);
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(credentials: any) {
    return this.http.post<{ accessToken: string }>(`${environment.apiBaseUrl}/auth/register`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.tokenKey, response.accessToken);
        }
        this.isAuthenticated.set(true);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.isAuthenticated.set(false);
  }

  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }
}
