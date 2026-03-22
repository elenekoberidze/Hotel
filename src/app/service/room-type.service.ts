import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomType, RoomTypeRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RoomTypeService {
  private apiUrl = '/api/RoomType';

  constructor(private http: HttpClient) {}

  getRoomTypes(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(this.apiUrl);
  }

  getRoomTypeById(id: number): Observable<RoomType> {
    return this.http.get<RoomType>(`${this.apiUrl}/${id}`);
  }

  createRoomType(data: RoomTypeRequest): Observable<RoomType> {
    return this.http.post<RoomType>(this.apiUrl, data);
  }

  updateRoomType(id: number, data: RoomTypeRequest): Observable<RoomType> {
    return this.http.put<RoomType>(`${this.apiUrl}/${id}`, data);
  }

  deleteRoomType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}