import { Component , OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoomTypesService } from '../../service/room-types.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Rooms } from '../../modules/rooms.model';

@Component({
  selector: 'app-rooms-page',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './rooms-page.component.html',
  styleUrl: './rooms-page.component.css'
})
export class RoomsPageComponent implements OnInit {

  

  roomTypes: Rooms[] = [];
  availableRooms: any[] = [];
  apiResponse: Rooms[] = [];
  priceRange: number = 1000;
  checkInDate: string = '';
  checkOutDate: string = '';

  constructor(private roomTypesService: RoomTypesService) {}

  ngOnInit(): void {
    this.getRoomTypes();
  }

  getRoomTypes(): void {
    this.roomTypesService.getRoomTypes().subscribe(
      (data) => {
        console.log('Room types fetched:', data);
        this.roomTypes = data;
        this.apiResponse = data; 
      },
      (error) => {
        console.error('Error fetching room types:', error);
      }
    );
  }

  filterRooms(): void {
    this.availableRooms = this.apiResponse.filter((room: any) => {
      return this.isRoomAvailable(room, this.checkInDate, this.checkOutDate);
    });
  }

  isRoomAvailable(room: any, checkIn: string, checkOut: string): boolean {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    for (const bookedDate of room.bookedDates) {
      const bookedDateObj = new Date(bookedDate.date);
      if (bookedDateObj >= checkInDate && bookedDateObj <= checkOutDate) {
        return false;
      }
    }
    return true;
  }

  onDateChange(): void {
    if (this.checkInDate && this.checkOutDate) {
      this.filterRooms();
    }
  }

  onPriceChange(): void {
    console.log('Selected price range:', this.priceRange);
  }

  resetFilters(): void {
    this.checkInDate = '';
    this.checkOutDate = '';
    this.priceRange = 0;
    this.availableRooms = [];
  }
}

   



  


