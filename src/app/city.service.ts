import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = 'https://hotelbooking.stepprojects.ge/api/Hotels/GetCities'

  constructor(private http: HttpClient) { }

  getCitys(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
