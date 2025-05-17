import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../modules/booking.model';

@Injectable({
  providedIn: 'root'
})
export class SelectedRoomsService {

  private aPiUrl = 'https://hotelbooking.stepprojects.ge/api/Booking';


  constructor(private http: HttpClient) { }

 postSelectedRooms(selectedRooms: Booking[]): Observable<any> {
    return this.http.post<any>(this.aPiUrl, selectedRooms);
  }
}
