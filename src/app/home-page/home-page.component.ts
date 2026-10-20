import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  latest: any[] = [];
  movies: any[] = [];
  serials: any[] = [];
  animations: any[] = [];

  popularMovies: any[] = [];
  popularSerials: any[] = [];
  popularAnimations: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.loadLatest();
    this.loadMovies();
    this.loadSerials();
    this.loadAnimations();
    this.loadPopularMovies();
    this.loadPopularSerials();
    this.loadPopularAnimations();
  }

  loadLatest(): void {
    this.http.get<any[]>(`${environment.apiUrl}/movie/latest`).subscribe({
      next: data => {
        this.latest = data;
      },
      error: err => console.error(err)
    });
  }

  loadMovies(): void {
    this.http.get<any[]>(`${environment.apiUrl}/movie/latest/0`).subscribe({
      next: data => {
        this.movies = data;
      },
      error: err => console.error(err)
    });
  }

  loadSerials(): void {
    this.http.get<any[]>(`${environment.apiUrl}/movie/latest/1`).subscribe({
      next: data => {
        this.serials = data;
      },
      error: err => console.error(err)
    });
  }

  loadAnimations(): void {
    this.http.get<any[]>(`${environment.apiUrl}/movie/latest/2`).subscribe({
      next: data => {
        this.animations = data;
      },
      error: err => console.error(err)
    });
  }

  loadPopularMovies(): void {
    this.http.get<any[]>(`${environment.apiUrl}/movie/popular/0`).subscribe({
      next: data => {
        this.popularMovies = data;
      },
      error: err => console.error(err)
    });
  }

  loadPopularSerials(): void {
    this.http.get<any[]>(`${environment.apiUrl}/movie/popular/1`).subscribe({
      next: data => {
        this.popularSerials = data;
      },
      error: err => console.error(err)
    });
  }

  loadPopularAnimations(): void {
    this.http.get<any[]>(`${environment.apiUrl}/movie/popular/2`).subscribe({
      next: data => {
        this.popularAnimations = data;
      },
      error: err => console.error(err)
    });
  }


  scrollRelated(direction: 'left' | 'right', event: MouseEvent): void {
    const arrow = event.target as HTMLElement;
    const inside = arrow.closest('.inside') as HTMLElement;
    if (!inside) return;

    const middle = inside.querySelector('.middle') as HTMLElement;
    const down = inside.querySelector('.down') as HTMLElement;

    const scrollContainer = (container: HTMLElement) => {

      const cards = Array.from(container.querySelectorAll(':scope > *')) as HTMLElement[];

      if (cards.length < 2) {
        const amount = direction === 'right' ? container.clientWidth : -container.clientWidth;
        container.scrollBy({ left: amount, behavior: 'smooth' });
        return;
      }

      const step = cards[1].offsetLeft - cards[0].offsetLeft;
      const visibleCount = Math.round(container.clientWidth / step);
      const scrollDistance = step * visibleCount;
      const amount = direction === 'right' ? scrollDistance : -scrollDistance;

      container.scrollBy({ left: amount, behavior: 'smooth' });
    };

    if (middle) scrollContainer(middle);
    if (down) scrollContainer(down);
  }
}