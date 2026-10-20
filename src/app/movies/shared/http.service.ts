import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getAllMovies() {
    return this.http.get<any[]>(`${environment.apiUrl}/movie/category/0`);
  }
}