import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Rooms } from '../modules/rooms.model';
 
@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private apiUrl = 'https://hotelbooking.stepprojects.ge/api/Rooms/GetAll';
  private baseUrl = 'https://hotelbooking.stepprojects.ge/api/Rooms';
  private roomsCache: Rooms[] | null = null;
 
  constructor(private http: HttpClient) {}
 
  getRoomById(id: number): Observable<Rooms> {
    console.log(`Fetching room with ID: ${id}`);
 
    
    if (this.roomsCache) {
      const cachedRoom = this.roomsCache.find((room) => room.id === id);
      if (cachedRoom) {
        console.log('Room found in cache:', cachedRoom);
        return of(cachedRoom);
      }
    }
 
    
    return this.http.get<Rooms>(`${this.baseUrl}/${id}`).pipe(
      tap((room) => console.log('Room data received directly:', room)),
      catchError((error) => {
        console.warn(
          `Direct fetch failed for room ID ${id}, trying from room list`,
          error
        );
 
       
        return this.getRooms().pipe(
          map((rooms) => {
            const room = rooms.find((r) => r.id === id);
            if (room) {
              console.log('Room found in list:', room);
              return room;
            }
            throw new Error(`Room with ID ${id} not found`);
          }),
          catchError((listError) => {
            console.error('Error fetching room from list:', listError);
            return throwError(
              () => new Error('Failed to fetch room details. Please try again.')
            );
          })
        );
      })
    );
  }
 
  getRooms(): Observable<Rooms[]> {
    return this.http.get<Rooms[]>(this.apiUrl).pipe(
      map((data: any[]) => {
        const rooms = data.map((room: any) => ({
          id: room.id,
          name: room.name,
          hotelId: room.hotelId,
          pricePerNight: room.pricePerNight,
          available: room.available,
          maximumGuests: room.maximumGuests,
          bookedDates: room.bookedDates || [],
          images: room.images || [],
        }));
 
        
        this.roomsCache = rooms;
        return rooms;
      }),
      catchError((error) => {
        console.error('Error fetching rooms list:', error);
        return throwError(
          () => new Error('Failed to fetch rooms list. Please try again.')
        );
      })
    );
  }
 
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
 
  /**
   * 
   * @param 
   * @param 
   * @param 
   * @returns 
   */
  isRoomAvailableForDates(
    room: Rooms,
    checkInDate: string,
    checkOutDate: string
  ): boolean {
    if (!room || !checkInDate || !checkOutDate) {
      return false;
    }
 
    if (!room.bookedDates || room.bookedDates.length === 0) {
     
      return true;
    }
 
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
 

    if (
      isNaN(checkIn.getTime()) ||
      isNaN(checkOut.getTime()) ||
      checkIn >= checkOut
    ) {
      return false;
    }
 
    
    const bookedDateStrings = room.bookedDates.map((bd) => {
      const date = new Date(bd.date);
      return this.formatDate(date);
    });
 
  
    const currentDate = new Date(checkIn);
 
    while (currentDate < checkOut) {
      const dateStr = this.formatDate(currentDate);
 
      if (bookedDateStrings.includes(dateStr)) {
        return false; 
      }
 
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
 
    return true; 
  }
 
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}