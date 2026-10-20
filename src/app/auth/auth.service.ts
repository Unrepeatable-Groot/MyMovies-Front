import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/user`;
  profileImage$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  register(dto: { username: string; email: string; password: string }) {
    return this.http.post<string>(`${this.apiUrl}/register`, dto, { responseType: 'text' as 'json' });
  }

  login(dto: { email: string; password: string }) {
    return this.http.post<string>(`${this.apiUrl}/login`, dto, { responseType: 'text' as 'json' });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.profileImage$.next(null);
  }

  private decodeToken(token: string): any | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload || !payload['exp']) {
      
      this.logout();
      return false;
    }

    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      this.logout();
      return false;
    }

    return true;
  }

  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodeToken(token);
    return payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? null;
  }

  getCurrentUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodeToken(token);
    return payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null;
  }

  isAdmin(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'Admin' || role === 'Owner';
  }

  loadCurrentUserImage(): void {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.profileImage$.next(null);
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    this.http.get<any>(`${this.apiUrl}/${userId}`, { headers }).subscribe({
      next: user => this.profileImage$.next(user.profileImageUrl || null),
      error: (err) => {
        if (err.status === 401) {
          this.logout(); // token invalid → სუფთა logout
        }
        this.profileImage$.next(null);
      }
    });
  }
}