import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-edit-media',
  templateUrl: './edit-media.component.html',
  styleUrl: './edit-media.component.scss'
})
export class EditMediaComponent implements OnInit {

  id!: number;

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
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.loadMovie();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  loadMovie(): void {
    this.http.get<any>(`${environment.apiUrl}/movie/${this.id}`).subscribe({
      next: data => {
        this.movieDto = {
          title: data.title,
          cardImageUrl: data.cardImageUrl,
          bannerImageUrl: data.bannerImageUrl,
          genre: data.genre,
          releaseYear: data.releaseYear,
          director: data.director,
          actors: data.actors,
          description: data.description,
          imdbRating: data.imdbRating,
          category: data.category
        };
      },
      error: err => console.error(err)
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
    if (this.movieDto.imdbRating < 0 || this.movieDto.imdbRating > 10) {
      this.errorMessage = 'IMDB rating must be between 0 and 10.';
      return;
    }

    this.errorMessage = '';

    this.http.put<any>(`${environment.apiUrl}/movie/${this.id}`, this.movieDto, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.successMessage = 'Movie updated successfully!';
        setTimeout(() => {
          const type = this.movieDto.category === 0 ? 'movies' : 
                       this.movieDto.category === 1 ? 'serials' : 'animations';
          this.router.navigate(['/', type, this.id]);
        }, 1000);
      },
      error: err => this.errorMessage = err.error || 'Failed to update movie.'
    });
  }
}