import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelBookingService {
  private apiUrl ='https://hotelbooking.stepprojects.ge/api/Rooms/GetAll'


  constructor(private http: HttpClient) { }

  checkRoomAvailability(checkIn: string, checkOut: string): Observable<any> {
    const params = { checkIn, checkOut };
    return this.http.get(`${this.apiUrl}/rooms/check-availability`, { params });
  }

  getAllRooms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Rooms/GetAll`);
  }
}
