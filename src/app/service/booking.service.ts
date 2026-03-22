import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Booking,
  CreateBookingRequest,
  PagedBookingResponse,
  UpdateBookingStatusRequest,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = '/api/Booking';

  constructor(private http: HttpClient) {}


  createBooking(data: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/CreateBooking`, data);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/GetCurrentUserBookings`);
  }

  getMyBookingById(bookingId: number): Observable<Booking> {
    return this.http.get<Booking>(
      `${this.apiUrl}/GetCurrentUserBookingBy${bookingId}`
    );
  }

  cancelBooking(bookingId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/CancelBookingBy${bookingId}`, {}
    );
  }


  getAllBookings(page: number = 1, pageSize: number = 20): Observable<PagedBookingResponse> {
    return this.http.get<PagedBookingResponse>(
      `${this.apiUrl}/AdminGetAllBookings?page=${page}&pageSize=${pageSize}`
    );
  }

  getBookingsByStatus(status: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/AdminGetBookingsBy${status}`);
  }

  getBookingsByHotel(hotelId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/AdminGetBookingBy${hotelId}`);
  }

  updateBookingStatus(bookingId: number, data: UpdateBookingStatusRequest): Observable<Booking> {
    const form = new FormData();
    form.append('status', data.status);
    return this.http.patch<Booking>(
      `${this.apiUrl}/AdminUpdateBookingStatus${bookingId}`, form
    );
  }

  deleteBooking(bookingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/AdminDeleteBooking${bookingId}`);
  }
}