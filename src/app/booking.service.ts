import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = 'https://hotelbooking.stepprojects.ge/api/Booking'

  constructor(private http: HttpClient) { }

  getUsers():Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl)
  }
}
