import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotels } from '../modules/hotels.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = 'https://hotelbooking.stepprojects.ge/api/Hotels/GetCities'

  constructor(private http: HttpClient) { }

  getCitys(): Observable<Hotels[]> {
    return this.http.get<Hotels[]>(this.apiUrl)}
}
