import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomTypesService {
  private apiUrl = 'https://hotelbooking.stepprojects.ge/api/Rooms/GetRoomTypes';


  constructor(private http: HttpClient) { }

  getRoomTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
