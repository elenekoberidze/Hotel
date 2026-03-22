import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../service/rooms.service';
import { BookingService } from '../../service/booking.service';
import { AuthService } from '../../service/auth.service';
import { Room } from '../../models';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class BookingPageComponent implements OnInit {
  room?: Room;
  checkInDate = '';
  checkOutDate = '';
  totalNights = 1;
  totalPrice = 0;
  loading = true;
  submitting = false;
  error = '';
  isMenuOpen = false;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private bookingService: BookingService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    
    const today    = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.checkInDate  = this.toDateString(today);
    this.checkOutDate = this.toDateString(tomorrow);

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid room ID';
      this.loading = false;
      return;
    }

    this.roomService.getRoomById(+id).subscribe({
      next: (room) => {
        this.room = room;
        this.calculateTotal();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load room details.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  onDateChange(): void {
    this.calculateTotal();
  }

  calculateTotal(): void {
    if (!this.room || !this.checkInDate || !this.checkOutDate) return;

    const checkIn  = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);

    if (checkIn >= checkOut) {
      this.error = 'Check-out date must be after check-in date.';
      return;
    }

    this.error = '';
    const diff = checkOut.getTime() - checkIn.getTime();
    this.totalNights = Math.ceil(diff / (1000 * 3600 * 24));
    this.totalPrice  = this.room.price * this.totalNights;
  }

  isFormValid(): boolean {
    return !!(this.room && this.checkInDate && this.checkOutDate && !this.error && !this.submitting);
  }

  submitBooking(): void {
    if (!this.isFormValid() || !this.room) return;

    this.submitting = true;
    this.error = '';

    this.bookingService.createBooking({
      roomID:       this.room.roomID,
      checkInDate:  new Date(this.checkInDate).toISOString(),
      checkOutDate: new Date(this.checkOutDate).toISOString(),
    }).subscribe({
      next: () => {
        this.submitting = false;
        alert('Booking successful!');
        this.router.navigate(['/booked-rooms']);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to book the room. Please try again.';
        this.submitting = false;
        console.error(err);
      },
    });
  }

  private toDateString(date: Date): string {
    return date.toISOString().split('T')[0];
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