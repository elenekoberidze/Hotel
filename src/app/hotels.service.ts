import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  private apiUrl = 'https://hotelbooking.stepprojects.ge/api/Hotels/GetAll';

  constructor(private http: HttpClient) { }

  getHotels(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getHotelById(hotelId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${hotelId}`);  
  }
}
