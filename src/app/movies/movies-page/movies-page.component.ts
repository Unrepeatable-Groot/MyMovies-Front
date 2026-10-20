import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-movies-page',
  templateUrl: './movies-page.component.html',
  styleUrls: ['./movies-page.component.scss']
})
export class MoviesPageComponent implements OnInit {

  allMovies: any[] = [];
  moviesOnPage: any[] = [];

  currentPage = 1;
  moviesPerPage = 20;
  totalPages = 1;

  constructor(private httpService: HttpService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.httpService.getAllMovies().subscribe(data => {
      this.allMovies = data;
      this.totalPages = Math.ceil(this.allMovies.length / this.moviesPerPage);

      this.route.params.subscribe(params => {
        this.currentPage = +params['page'] || 1;
        this.updateMovies();
      });
    });
  }

  updateMovies() {
    const start = (this.currentPage - 1) * this.moviesPerPage;
    const end = start + this.moviesPerPage;
    this.moviesOnPage = this.allMovies.slice(start, end);
  }
}