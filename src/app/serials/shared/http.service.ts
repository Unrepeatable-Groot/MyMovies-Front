import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SerialsHttpService {

  constructor(private http: HttpClient) {}

  getAllSerials() {
    return this.http.get<any[]>(`${environment.apiUrl}/movie/category/1`);
  }
}