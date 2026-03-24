import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../service/booking.service';
import { AuthService } from '../../service/auth.service';
import { Booking, BookingStatus, PagedBookingResponse } from '../../models';
 
@Component({
  selector: 'app-booked-rooms',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
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
 
  totalCount = 0;
  page = 1;
  pageSize = 20;
 
  statusFilter = 'all';
  readonly statuses: BookingStatus[] = ['Pending', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled'];
 
  updatingId: number | null = null;
  editingId: number | null = null;
  editStatus: BookingStatus = 'Pending';
 
  adminSuccess = '';
  adminError = '';
 
  constructor(
    private bookingService: BookingService,
    public authService: AuthService
  ) {}
 
  ngOnInit(): void {
    this.loadBookings();
  }
 
  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
 
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
 
  loadBookings(): void {
    this.loading = true;
    this.error = '';
 
    if (this.isAdmin) {
      this.loadAdminBookings();
    } else {
      this.loadMyBookings();
    }
  }
 
  private loadMyBookings(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = this.sortByDate(data);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load your bookings.';
        this.loading = false;
      },
    });
  }
 
  private loadAdminBookings(): void {
    if (this.statusFilter !== 'all') {
      this.bookingService.getBookingsByStatus(this.statusFilter).subscribe({
        next: (data) => {
          this.bookings = this.sortByDate(data);
          this.totalCount = data.length;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load bookings.';
          this.loading = false;
        },
      });
    } else {
      this.bookingService.getAllBookings(this.page, this.pageSize).subscribe({
        next: (res: PagedBookingResponse) => {
          this.bookings = this.sortByDate(res.data);
          this.totalCount = res.totalCount;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load bookings.';
          this.loading = false;
        },
      });
    }
  }
 
 
  onStatusFilterChange(): void {
    this.page = 1;
    this.loadBookings();
  }
 
  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.loadBookings();
  }
 
  startEdit(booking: Booking): void {
    this.editingId = booking.bookingID;
    this.editStatus = booking.status;
  }
 
  cancelEdit(): void {
    this.editingId = null;
  }
 
  submitStatusUpdate(bookingId: number): void {
    this.updatingId = bookingId;
    this.adminSuccess = '';
    this.adminError = '';
 
    this.bookingService.updateBookingStatus(bookingId, { status: this.editStatus }).subscribe({
      next: (updated) => {
        const b = this.bookings.find(x => x.bookingID === bookingId);
        if (b) b.status = updated.status;
        this.editingId = null;
        this.updatingId = null;
        this.adminSuccess = 'Booking status updated successfully.';
        setTimeout(() => (this.adminSuccess = ''), 3000);
      },
      error: (err) => {
        this.adminError = err?.error?.message ?? 'Failed to update booking status.';
        this.updatingId = null;
        setTimeout(() => (this.adminError = ''), 4000);
      },
    });
  }
 
  deleteBooking(bookingId: number): void {
    if (!confirm('Are you sure you want to delete this booking? This cannot be undone.')) return;
 
    this.adminSuccess = '';
    this.adminError = '';
 
    this.bookingService.deleteBooking(bookingId).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(b => b.bookingID !== bookingId);
        this.totalCount--;
        this.adminSuccess = 'Booking deleted.';
        setTimeout(() => (this.adminSuccess = ''), 3000);
      },
      error: (err) => {
        this.adminError = err?.error?.message ?? 'Failed to delete booking.';
        setTimeout(() => (this.adminError = ''), 4000);
      },
    });
  }
 
  // ── Customer actions ──────────────────────────────────
 
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
      },
    });
  }
 
  canCancel(booking: Booking): boolean {
    return booking.status === 'Pending' || booking.status === 'Confirmed';
  }
 
  statusClass(status: string): string {
    const map: Record<string, string> = {
      Pending: 'badge-pending',
      Confirmed: 'badge-confirmed',
      CheckedIn: 'badge-checkedin',
      CheckedOut: 'badge-checkedout',
      Cancelled: 'badge-cancelled',
    };
    return map[status] ?? '';
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