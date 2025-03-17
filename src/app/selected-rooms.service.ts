import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedRoomsService {

  private aPiUrl = 'https://hotelbooking.stepprojects.ge/api/Booking';


  constructor(private http: HttpClient) { }

 postSelectedRooms(selectedRooms: any[]): Observable<any> {
    return this.http.post<any>(this.aPiUrl, selectedRooms);
  }
}
