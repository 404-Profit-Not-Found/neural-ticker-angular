import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'access_token';
  isAuthenticated = signal(false);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticated.set(!!localStorage.getItem(this.tokenKey));
    }
  }

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
