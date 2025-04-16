import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotels } from '../modules/hotels.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  private apiUrl = 'https://hotelbooking.stepprojects.ge/api/Hotels/GetAll';

  constructor(private http: HttpClient) { }

  getHotels(): Observable<Hotels[]> {
    return this.http.get<Hotels[]>(this.apiUrl).pipe(
      map((data: any) => {
        return data.map((hotel: any) => ({
          id: hotel.id,
          name: hotel.name,
          address: hotel.address,
          featuredImage: hotel.featuredImage,
        }));
      })
    );
  }
 
}
