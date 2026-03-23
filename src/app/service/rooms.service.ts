import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room, PagedRoomResponse, RoomFilter, RoomType } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrl = 'https://localhost:7296/api/Room';

  constructor(private http: HttpClient) {}

  getRooms(filter: RoomFilter = {}): Observable<PagedRoomResponse> {
    let params = new HttpParams();

    if (filter.minPrice != null) params = params.set('minPrice', filter.minPrice);
    if (filter.maxPrice != null) params = params.set('maxPrice', filter.maxPrice);
    if (filter.checkIn)         params = params.set('checkIn', filter.checkIn);
    if (filter.checkOut)        params = params.set('checkOut', filter.checkOut);
    if (filter.maxGuests != null) params = params.set('maxGuests', filter.maxGuests);
    if (filter.city)            params = params.set('city', filter.city);
    if (filter.hotelId != null) params = params.set('hotelId', filter.hotelId);
    if (filter.starRating != null) params = params.set('starRating', filter.starRating);
    if (filter.roomType)        params = params.set('roomType', filter.roomType);
    if (filter.sortBy)          params = params.set('sortBy', filter.sortBy);
    if (filter.page != null)    params = params.set('page', filter.page);
    if (filter.pageSize != null) params = params.set('pageSize', filter.pageSize);

    return this.http.get<PagedRoomResponse>(`${this.apiUrl}/GetAll`, { params });
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/GetBy${id}`);
  }

 getRoomTypes(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/GetRoomTypes`);
}
}