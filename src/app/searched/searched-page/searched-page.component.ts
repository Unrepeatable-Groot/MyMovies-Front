import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-searched-page',
  templateUrl: './searched-page.component.html',
  styleUrls: ['./searched-page.component.scss']
})
export class SearchedPageComponent implements OnInit {

  results: any[] = [];
  query: string = '';

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.query = params['q'];

      if (this.query) {
        this.httpService.searchMedia(this.query)
          .subscribe(data => {
            this.results = data;
          });
      }
    });

  }
}
