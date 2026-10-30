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
  showCodeModal = false;
  verificationCode = '';
  isSending = false;

  forgotStep = 0;
  resetEmail = '';
  resetCode = '';
  newPassword = '';
  resetError = '';
  resetLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onLogin() {
    this.authService.login(this.loginDto).subscribe({
      next: token => {
        this.authService.saveToken(token);
        this.authService.loadCurrentUserImage();
        this.router.navigate(['/']);
      },
      error: () => this.errorMessage = 'Invalid email or password.'
    });
  }

  confirmCode() {
    this.authService.register({ ...this.registerDto, code: this.verificationCode }).subscribe({
      next: token => {
        this.authService.saveToken(token);
        this.authService.loadCurrentUserImage();
        this.router.navigate(['/']);
      },
      error: err => {
        this.showCodeModal = false;
        this.verificationCode = '';
        this.errorMessage = this.getErrorMessage(err, 'Registration failed.');
      }
    });
  }

  onRegisterClick() {
    this.errorMessage = '';

    if (!this.registerDto.username || !this.registerDto.email || !this.registerDto.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isSending = true;
    this.authService.sendCode(this.registerDto.username, this.registerDto.email, this.registerDto.password).subscribe({
      next: () => {
        this.isSending = false;
        this.verificationCode = '';
        this.showCodeModal = true;
      },
      error: err => {
        this.isSending = false;
        this.errorMessage = this.getErrorMessage(err, 'Could not send the code.');
      }
    });
  }

  cancelCode() {
    this.showCodeModal = false;
    this.verificationCode = '';
  }

  private getErrorMessage(err: any, fallback: string): string {
    let e = err?.error;
    if (typeof e === 'string') {
      try { e = JSON.parse(e); } catch { return e || fallback; }
    }
    if (e?.errors) {
      const first = Object.values(e.errors)[0] as string[];
      return first?.[0] || fallback;
    }
    return e?.title || fallback;
  }

  openForgot() {
    this.forgotStep = 1;
    this.resetEmail = '';
    this.resetCode = '';
    this.newPassword = '';
    this.resetError = '';
  }

  closeForgot() {
    this.forgotStep = 0;
  }

  sendResetCode() {
    this.resetError = '';
    if (!this.resetEmail) {
      this.resetError = 'Please enter your email.';
      return;
    }
    this.resetLoading = true;
    this.authService.forgotPassword(this.resetEmail).subscribe({
      next: () => { this.resetLoading = false; this.forgotStep = 2; },
      error: err => {
        this.resetLoading = false;
        this.resetError = this.getErrorMessage(err, 'Could not send the code.');
      }
    });
  }

  checkResetCode() {
    this.resetError = '';
    this.resetLoading = true;
    this.authService.verifyResetCode(this.resetEmail, this.resetCode).subscribe({
      next: () => { this.resetLoading = false; this.forgotStep = 3; },
      error: err => {
        this.resetLoading = false;
        this.resetError = this.getErrorMessage(err, 'Incorrect code.');
      }
    });
  }

  saveNewPassword() {
    this.resetError = '';
    this.resetLoading = true;
    this.authService.resetPassword(this.resetEmail, this.resetCode, this.newPassword).subscribe({
      next: token => {
        this.authService.saveToken(token);
        this.authService.loadCurrentUserImage();
        this.forgotStep = 0;
        this.router.navigate(['/']);
      },
      error: err => {
        this.resetLoading = false;
        this.resetError = this.getErrorMessage(err, 'Could not reset the password.');
      }
    });
  }
}

