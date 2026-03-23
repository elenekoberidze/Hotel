import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Amenity, AmenityRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AmenityService {
  private apiUrl = 'https://localhost:7296/api/Amenity';

  constructor(private http: HttpClient) {}

  getAmenities(): Observable<Amenity[]> {
    return this.http.get<Amenity[]>(`${this.apiUrl}/GetAll`);
  }

  getAmenityById(id: number): Observable<Amenity> {
    return this.http.get<Amenity>(`${this.apiUrl}/GetBy${id}`);
  }


  createAmenity(data: AmenityRequest): Observable<Amenity> {
    const form = new FormData();
    form.append('name', data.name);
    return this.http.post<Amenity>(`${this.apiUrl}/Create`, form);
  }

  updateAmenity(id: number, data: AmenityRequest): Observable<Amenity> {
    const form = new FormData();
    form.append('name', data.name);
    return this.http.put<Amenity>(`${this.apiUrl}/Update${id}`, form);
  }

  deleteAmenity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteBy${id}`);
  }
}