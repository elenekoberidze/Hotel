import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/Auth';

  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.currentUserSubject.next(JSON.parse(saved));
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    const form = new FormData();
    form.append('firstName', data.firstName);
    form.append('lastName', data.lastName);
    form.append('username', data.username);
    form.append('email', data.email);
    form.append('password', data.password);

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, form);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    const form = new FormData();
    form.append('email', data.email);
    form.append('password', data.password);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, form).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken') ?? '';
    const form = new FormData();
    form.append('refreshToken', refreshToken);

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, form).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
      })
    );
  }

  get currentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  isTokenExpired(): boolean {
    const token = this.token;
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}