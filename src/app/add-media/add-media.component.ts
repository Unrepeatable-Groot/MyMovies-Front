import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.component.html',
  styleUrl: './add-media.component.scss'
})
export class AddMediaComponent {

  selectedCategory: number = 0;

  movieDto = {
    title: '',
    cardImageUrl: '',
    bannerImageUrl: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    director: '',
    actors: '',
    description: '',
    imdbRating: 0,
    category: 0
  };

  errorMessage = '';
  successMessage = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
    }
  }

  selectCategory(category: number): void {
    this.selectedCategory = category;
    this.movieDto.category = category;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  onSubmit(): void {
    if (!this.movieDto.title.trim()) {
      this.errorMessage = 'Title is required.';
      return;
    }
    if (!this.movieDto.cardImageUrl.trim()) {
      this.errorMessage = 'Card image URL is required.';
      return;
    }
    if (!this.movieDto.bannerImageUrl.trim()) {
      this.errorMessage = 'Banner image URL is required.';
      return;
    }
    if (!this.movieDto.director.trim()) {
      this.errorMessage = 'Director is required.';
      return;
    }
    if (!this.movieDto.actors.trim()) {
      this.errorMessage = 'Actors are required.';
      return;
    }
    if (!this.movieDto.description.trim()) {
      this.errorMessage = 'Description is required.';
      return;
    }
    if (this.movieDto.imdbRating < 0 || this.movieDto.imdbRating > 10) {
      this.errorMessage = 'IMDB rating must be between 0 and 10.';
      return;
    }

    this.errorMessage = '';

    this.http.post<any>(`${environment.apiUrl}/movie`, this.movieDto, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.successMessage = 'Movie added successfully!';
        this.movieDto = {
          title: '',
          cardImageUrl: '',
          bannerImageUrl: '',
          genre: '',
          releaseYear: new Date().getFullYear(),
          director: '',
          actors: '',
          description: '',
          imdbRating: 0,
          category: this.selectedCategory
        };
      },
      error: err => this.errorMessage = err.error || 'Failed to add movie.'
    });
  }
}