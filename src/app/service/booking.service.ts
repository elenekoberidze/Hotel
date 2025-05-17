import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BookingService {

 private bookingApiUrl = 'https://hotelbooking.stepprojects.ge/api/Booking';

  constructor(private http: HttpClient) {}

  bookRoom(bookingData: any) {
    return this.http.post(this.bookingApiUrl, bookingData);
  }
}
