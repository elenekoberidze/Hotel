import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelImage } from '../models';

@Injectable({
  providedIn: 'root',
})
export class HotelImageService {
  private apiUrl = '/api/HotelImage';

  constructor(private http: HttpClient) {}

  getImagesByHotel(hotelId: number): Observable<HotelImage[]> {
    return this.http.get<HotelImage[]>(`${this.apiUrl}/hotel/${hotelId}`);
  }

  addImage(data: HotelImage): Observable<HotelImage> {
    return this.http.post<HotelImage>(this.apiUrl, data);
  }

  deleteImage(imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${imageId}`);
  }

  setPrimaryImage(imageId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${imageId}/set-primary`, {});
  }
}
