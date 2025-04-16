import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rooms } from '../modules/rooms.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private apiUrl ='https://hotelbooking.stepprojects.ge/api/Rooms/GetAll'

  constructor(private http: HttpClient) { }

  getRooms(): Observable<Rooms[]> {
    return this.http.get<Rooms[]>(this.apiUrl).pipe(
      map((data: any) => {
        return data.map((room: any) => ({
          id: room.id,
          name: room.name,
          hotelId: room.hotelId,
          pricePerNight: room.pricePerNight,
          available: room.available,
          maximumGuests: room.maximumGuests,
          bookedDates: room.bookedDates,
          images: room.images,
        }));
      })
    );
  }
}
