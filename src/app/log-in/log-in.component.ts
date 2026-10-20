import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  isLoginMode = true;

  loginDto = { email: '', password: '' };
  registerDto = { username: '', email: '', password: '' };

  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onLogin() {
    this.authService.login(this.loginDto).subscribe({
      next: token => {
        this.authService.saveToken(token);
        this.authService.loadCurrentUserImage(); // ← დაამატე
        this.router.navigate(['/']);
      },
      error: () => this.errorMessage = 'Invalid email or password.'
    });
  }

  onRegister() {
    this.authService.register(this.registerDto).subscribe({
      next: token => {
        this.authService.saveToken(token);
        this.authService.loadCurrentUserImage(); // ← დაამატე
        this.router.navigate(['/']);
      },
      error: err => this.errorMessage = err.error || 'Registration failed.'
    });
  }
}