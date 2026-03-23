import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel, PagedHotelResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private apiUrl = 'https://localhost:7296/api/Hotel';

  constructor(private http: HttpClient) {}

  getHotels(page: number = 1, pageSize: number = 10): Observable<PagedHotelResponse> {
    return this.http.get<PagedHotelResponse>(
      `${this.apiUrl}/GetAllHotels?page=${page}&pageSize=${pageSize}`
    );
  }

  getHotelById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/GetHotelBy${id}`);
  }

  getHotelsByCity(city: string): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/GetHotelsBy${city}`);
  }

  getCities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/GetCities`);
  }
}