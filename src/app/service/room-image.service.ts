import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomImage } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RoomImageService {
  private apiUrl = '/api/RoomImage';

  constructor(private http: HttpClient) {}

  getImagesByRoom(roomId: number): Observable<RoomImage[]> {
    return this.http.get<RoomImage[]>(`${this.apiUrl}/room/${roomId}`);
  }

  addImage(data: RoomImage): Observable<RoomImage> {
    return this.http.post<RoomImage>(this.apiUrl, data);
  }

  deleteImage(imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${imageId}`);
  }
}