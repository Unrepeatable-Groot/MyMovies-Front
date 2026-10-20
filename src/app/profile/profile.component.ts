import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any = null;
  favoriteMovies: any[] = [];

  // Edit modes
  showUsernameForm = false;
  showEmailForm = false;
  showPasswordForm = false;

  // Forms
  editProfile = { username: '', profileImageUrl: '' };
  emailDto = { currentPassword: '', newEmail: '' };
  passwordDto = { currentPassword: '', newPassword: '' };

  errorMessage = '';
  successMessage = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  loadProfile(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/logIn']);
      return;
    }

    this.http.get(`${environment.apiUrl}/user/${userId}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (data: any) => {
        this.user = data;
        this.authService.profileImage$.next(data.profileImageUrl || null); // ← შეცვალე
        this.loadFavorites();
      },
      error: () => this.router.navigate(['/logIn'])
    });
  }

  loadFavorites(): void {
    this.http.get<any[]>(`${environment.apiUrl}/movie/favorites`, {
      headers: this.getHeaders()
    }).subscribe({
      next: data => this.favoriteMovies = data,
      error: err => console.error(err)
    });
  }

  updateUsername(): void {
  const userId = this.authService.getCurrentUserId();
  this.http.put(`${environment.apiUrl}/user/${userId}`, this.editProfile, {
    headers: this.getHeaders()
  }).subscribe({
    next: (data: any) => {
      this.user = data;
      this.showUsernameForm = false;
      this.successMessage = 'Profile updated successfully!';
      this.authService.loadCurrentUserImage();
    },
    error: () => this.errorMessage = 'Failed to update profile.'
  });
}

  changeEmail(): void {
    const userId = this.authService.getCurrentUserId();
    this.http.put(`${environment.apiUrl}/user/${userId}/change-email`, this.emailDto, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.showEmailForm = false;
        this.successMessage = 'Email changed successfully!';
        this.user.email = this.emailDto.newEmail;
      },
      error: () => this.errorMessage = 'Failed to change email.'
    });
  }

  changePassword(): void {
    const userId = this.authService.getCurrentUserId();
    this.http.put(`${environment.apiUrl}/user/${userId}/change-password`, this.passwordDto, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.showPasswordForm = false;
        this.successMessage = 'Password changed successfully!';
      },
      error: () => this.errorMessage = 'Failed to change password.'
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  removeFavorite(movieId: number): void {
    this.http.delete(`${environment.apiUrl}/movie/favorites/${movieId}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.favoriteMovies = this.favoriteMovies.filter(m => m.id !== movieId);
      },
      error: err => console.error(err)
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}