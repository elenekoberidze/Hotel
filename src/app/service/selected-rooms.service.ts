import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable , catchError,throwError, of, tap} from 'rxjs';
import { Booking } from '../modules/booking.model';

@Injectable({
  providedIn: 'root'
})
export class SelectedRoomsService {

   private apiUrl = 'https://hotelbooking.stepprojects.ge/api/Booking';

  constructor(private http: HttpClient) {}
postSelectedRooms(selectedRooms: Booking[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, selectedRooms);
  }
 
  bookRoom(booking: Booking): Observable<any> {
   
    const formattedBooking = {
      ...booking,
      
      checkInDate: new Date(booking.checkInDate).toISOString(),
      checkOutDate: new Date(booking.checkOutDate).toISOString(),
    };
 
    console.log('Sending booking request:', formattedBooking);
 
    return this.http.post<any>(this.apiUrl, formattedBooking).pipe(
      tap((response) => {
        console.log('Booking response:', response);
        
        if (typeof response === 'string' && response.includes('Booking Id')) {
          console.log('Booking successful with ID extracted from response');
        }
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        console.error('Error in booking service:', errorResponse);
 
        if (errorResponse.status === 200) {
          return of(errorResponse.error); 
        }
 
        
        if (errorResponse.error && typeof errorResponse.error === 'string') {
          return throwError(() => errorResponse);
        }
 
        return throwError(
          () => new Error('Failed to book the room. Server error.')
        );
      })
    );
  }
 
  cancelBooking(bookingId: number): Observable<any> {
    console.log(`Attempting to cancel booking with ID: ${bookingId}`);
 
    return this.http.delete<any>(`${this.apiUrl}/${bookingId}`).pipe(
      tap((response) => {
        console.log('Cancellation response:', response);
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        console.error('Error in cancellation service:', errorResponse);
 
        
        if (errorResponse.status === 200) {
          console.log('Cancellation was successful despite error handler');
          return of({
            success: true,
            message: 'Booking cancelled successfully',
          });
        }
 
       
        if (errorResponse.status === 403 || errorResponse.status === 401) {
          return throwError(
            () => new Error('You do not have permission to cancel this booking')
          );
        }
 
        return throwError(
          () => new Error('Failed to cancel booking. Please try again.')
        );
      })
    );
  }
}
 

