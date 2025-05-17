import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from '../service/rooms.service';
import { SelectedRoomsService } from '../service/selected-rooms.service';
import { Rooms } from '../modules/rooms.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Booking } from '../modules/booking.model';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class BookingPageComponent implements OnInit {
  room?: Rooms;
  customerName: string = '';
  customerPhone: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private roomsService: RoomsService,
    private selectedRoomsService: SelectedRoomsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const roomId = Number(this.route.snapshot.paramMap.get('id'));
    this.roomsService.getRoomById(roomId).subscribe(
      (data) => (this.room = data),
      (error) => console.error('Error fetching room details:', error)
    );
  }

 submitBooking(): void {
  if (!this.room) {
    alert('Room details not available!');
    return;
  }

  const booking: Booking = {
    id: 0,
    roomID: this.room.id,
    checkInDate: this.checkInDate,
    checkOutDate: this.checkOutDate,
    totalPrice: this.room.pricePerNight,
    isConfirmed: true,
    customerName: this.customerName,
    customerPhone: this.customerPhone,
  };

  console.log('Booking object:', booking);

  this.selectedRoomsService.postSelectedRooms([booking]).subscribe(
    (response) => {
      console.log('Booking response:', response);
      alert('Booking successful!');
      this.router.navigate(['/']);
    },
    (error) => {
      console.error('Error during booking:', error);
      alert('Failed to book the room. Please try again.');
    }
  );
}

}
