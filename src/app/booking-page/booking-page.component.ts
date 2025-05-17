import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomsService } from '../service/rooms.service';
import { BookingService } from '../service/booking.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css'],
  imports: [ReactiveFormsModule, CommonModule,RouterLink]
})
export class BookingPageComponent implements OnInit {
  room: any;
  bookingForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private roomsService: RoomsService,
    private bookingService: BookingService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get('id');
    if (roomId) {
      this.roomsService.getRoomById(roomId).subscribe(
        (room) => (this.room = room),
        (error) => console.error('Error fetching room details:', error)
      );
    }
  }

  submitBooking(): void {
    if (this.bookingForm.valid) {
      const bookingData = {
        ...this.bookingForm.value,
        roomId: this.room.id,
      };
      this.bookingService.bookRoom(bookingData).subscribe(
        (response) => {
          console.log('Booking successful:', response);
          alert('Booking confirmed!');
        },
        (error) => console.error('Error during booking:', error)
      );
    }
  }
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
