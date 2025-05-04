import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rooms } from '../modules/rooms.model';

@Injectable({
  providedIn: 'root'
})
export class RoomTypesService {
  private apiUrl = 'https://hotelbooking.stepprojects.ge/api/Rooms/GetRoomTypes';


  constructor(private http: HttpClient) { }

  getRoomTypes(): Observable<Rooms[]> {
    return this.http.get<Rooms[]>(this.apiUrl);
  }
}
