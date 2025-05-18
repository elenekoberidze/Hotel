import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoomsService } from '../../service/rooms.service';
import { SelectedRoomsService } from '../../service/selected-rooms.service';
import { BookingService } from '../../service/booking.service';
import { Rooms } from '../../modules/rooms.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Booking } from '../../modules/booking.model';
 
@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class BookingPageComponent implements OnInit {
  room?: Rooms;
  customerName: string = '';
  customerPhone: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';
  loading: boolean = true;
  error: string = '';
  totalNights: number = 1;
  totalPrice: number = 0;
  isMenuOpen = false;
  roomId: number = 0;
  submitting: boolean = false;
  dateConflict: boolean = false;
 
  
  unavailableDates: string[] = [];
 
  constructor(
    private route: ActivatedRoute,
    private roomsService: RoomsService,
    private selectedRoomsService: SelectedRoomsService,
    private bookingService: BookingService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
 
    this.checkInDate = this.formatDateForInput(today);
    this.checkOutDate = this.formatDateForInput(tomorrow);
 
    
    this.roomsService.getRooms().subscribe({
      next: (rooms) => {
        
        const idParam = this.route.snapshot.paramMap.get('id');
        console.log('Route param id:', idParam);
 
        if (!idParam) {
          this.error = 'Invalid room ID';
          this.loading = false;
          return;
        }
 
        this.roomId = +idParam;
 
        if (isNaN(this.roomId) || this.roomId <= 0) {
          this.error = 'Invalid room ID format';
          this.loading = false;
          return;
        }
 
        
        const roomFromList = rooms.find((r) => r.id === this.roomId);
        if (roomFromList) {
          this.room = roomFromList;
          this.totalPrice = this.room.pricePerNight;
          this.loading = false;
          this.calculateTotalPrice(); 
          this.extractUnavailableDates(); 
          this.checkDateAvailability(); 
        } else {
          
          this.fetchRoomDetails();
        }
      },
      error: (err) => {
        
        this.fetchRoomDetails();
      },
    });
  }
 
 
  extractUnavailableDates(): void {
    if (!this.room || !this.room.bookedDates) return;
 
    this.unavailableDates = this.room.bookedDates.map((bookedDate) => {
      const date = new Date(bookedDate.date);
      return this.formatDateForInput(date);
    });
 
    console.log('Unavailable dates:', this.unavailableDates);
  }
 
  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
 
  fetchRoomDetails(): void {
    this.loading = true;
    this.error = '';
 
    this.roomsService.getRoomById(this.roomId).subscribe({
      next: (data) => {
        if (data) {
          this.room = data;
          this.totalPrice = this.room.pricePerNight;
          this.loading = false;
          this.calculateTotalPrice(); 
          this.extractUnavailableDates();
          this.checkDateAvailability(); 
        } else {
          this.error = 'No room data found';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error in component when fetching room:', err);
        this.error = 'Error loading room details. Please try again.';
        this.loading = false;
      },
    });
  }
 
  isFormValid(): boolean {
    
    return !!(
      this.customerName &&
      this.customerPhone &&
      this.checkInDate &&
      this.checkOutDate &&
      !this.dateConflict &&
      !this.submitting &&
      !this.error
    );
  }
 
  
  checkDateAvailability(): void {
    if (!this.room || !this.checkInDate || !this.checkOutDate) {
      this.dateConflict = false;
      return;
    }
 
    
    if (
      this.error ===
      'The room is already booked for some of the selected dates.'
    ) {
      this.error = '';
    }
 
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
 
    
    if (
      isNaN(checkIn.getTime()) ||
      isNaN(checkOut.getTime()) ||
      checkIn >= checkOut
    ) {
      this.dateConflict = true;
      this.error = 'Check-out date must be after check-in date';
      return;
    }
 
   
    if (!this.room.bookedDates || this.room.bookedDates.length === 0) {
      
      this.dateConflict = false;
      return;
    }
 
    
    const currentDate = new Date(checkIn);
    this.dateConflict = false;
 
    while (currentDate < checkOut) {
      const dateStr = this.formatDateForInput(currentDate);
 
     
      if (this.unavailableDates.includes(dateStr)) {
        this.dateConflict = true;
        this.error =
          'The room is already booked for some of the selected dates.';
        break;
      }
 
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
 
    
    if (!this.dateConflict) {
      console.log('Date range is available');
    }
  }
 
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
 
  closeMenu(): void {
    this.isMenuOpen = false;
  }
 
  calculateTotalPrice(): void {
    if (!this.room || !this.checkInDate || !this.checkOutDate) return;
 
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
 
    if (checkIn >= checkOut) {
      this.error = 'Check-out date must be after check-in date';
      return;
    }
 
    
    if (this.error === 'Check-out date must be after check-in date') {
      this.error = '';
    }
 
    
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    this.totalNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.totalPrice = this.room.pricePerNight * this.totalNights;
 
    
    this.checkDateAvailability();
  }
 
  retryLoading(): void {
    this.fetchRoomDetails();
  }
 
  submitBooking(): void {
    if (this.submitting) return; 
 
    if (!this.room) {
      this.error = 'Room details not available!';
      return;
    }
 
    if (
      !this.customerName ||
      !this.customerPhone ||
      !this.checkInDate ||
      !this.checkOutDate
    ) {
      this.error = 'Please fill in all required fields';
      return;
    }
 
   
    this.calculateTotalPrice();
 
    
    this.checkDateAvailability();
 
    if (this.dateConflict) {
      this.error = 'The room is already booked for some of the selected dates.';
      return;
    }
 
    if (this.error) {
      return; 
    }
 
    this.submitting = true;
    this.error = '';
 
    const booking: Booking = {
      id: 0,
      roomID: this.room.id,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      totalPrice: this.totalPrice,
      isConfirmed: true,
      customerName: this.customerName,
      customerPhone: this.customerPhone,
    };
 
    console.log('Booking object:', booking);
 
   
    this.bookingService.createBooking(booking).subscribe({
      next: (response) => {
        console.log('Booking response:', response);
        alert('Booking successful!');
        this.submitting = false;
        this.router.navigate(['/booked-rooms']);
      },
      error: (errorResponse) => {
        console.error('Error during booking:', errorResponse);
        if (errorResponse.status === 200) {
         
          alert('Booking successful!');
          this.submitting = false;
          this.router.navigate(['/booked-rooms']);
        } else if (
          errorResponse.error &&
          typeof errorResponse.error === 'string' &&
          errorResponse.error.includes('already booked')
        ) {
          this.error =
            'The room is already booked for some of the selected dates.';
        } else {
          this.error = 'Failed to book the room. Please try again.';
        }
        this.submitting = false;
      },
    });
  }
 
  onDateChange(): void {
    this.calculateTotalPrice();
  }
}
 