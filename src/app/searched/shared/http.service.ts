import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {}

  searchMedia(query: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/movie/search/${query}`);
  }
}