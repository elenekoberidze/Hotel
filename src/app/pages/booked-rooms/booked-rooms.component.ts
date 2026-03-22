import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../service/booking.service';
import { AuthService } from '../../service/auth.service';
import { Booking } from '../../models';

@Component({
  selector: 'app-booked-rooms',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './booked-rooms.component.html',
  styleUrl: './booked-rooms.component.css',
})
export class BookedRoomsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  error = '';
  isMenuOpen = false;
  cancellingId: number | null = null;
  cancelSuccess = false;
  cancelError = '';

  constructor(
    private bookingService: BookingService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.error = '';

    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = this.sortByDate(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your bookings.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  cancelBooking(bookingID: number): void {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    this.cancellingId = bookingID;
    this.cancelSuccess = false;
    this.cancelError = '';

    this.bookingService.cancelBooking(bookingID).subscribe({
      next: () => {
      
        const booking = this.bookings.find(b => b.bookingID === bookingID);
        if (booking) booking.status = 'Cancelled';
        this.cancellingId = null;
        this.cancelSuccess = true;
        setTimeout(() => (this.cancelSuccess = false), 3000);
      },
      error: (err) => {
        this.cancelError = err?.error?.message ?? 'Failed to cancel booking.';
        this.cancellingId = null;
        setTimeout(() => (this.cancelError = ''), 3000);
        console.error(err);
      },
    });
  }

  canCancel(booking: Booking): boolean {
    return booking.status === 'Pending' || booking.status === 'Confirmed';
  }

  private sortByDate(bookings: Booking[]): Booking[] {
    return [...bookings].sort(
      (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
    );
  }

  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu(): void  { this.isMenuOpen = false; }

  logout(event?: Event): void {
    event?.preventDefault();
    this.authService.logout();
  }

  get username(): string {
    return this.authService.currentUser?.username ?? 'User';
  }
}