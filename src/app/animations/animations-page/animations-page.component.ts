import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimationsHttpService } from '../shared/http.service';

@Component({
  selector: 'app-animations-page',
  templateUrl: './animations-page.component.html',
  styleUrls: ['./animations-page.component.scss']
})
export class AnimationsPageComponent implements OnInit {

  allAnimations: any[] = [];
  animationsOnPage: any[] = [];

  currentPage = 1;
  animationsPerPage = 20;
  totalPages = 1;

  constructor(private httpService: AnimationsHttpService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.httpService.getAllAnimations().subscribe(data => {
      this.allAnimations = data;
      this.totalPages = Math.ceil(this.allAnimations.length / this.animationsPerPage);

      this.route.params.subscribe(params => {
        this.currentPage = +params['page'] || 1;
        this.updateAnimations();
      });
    });
  }

  updateAnimations() {
    const start = (this.currentPage - 1) * this.animationsPerPage;
    const end = start + this.animationsPerPage;
    this.animationsOnPage = this.allAnimations.slice(start, end);
  }
}