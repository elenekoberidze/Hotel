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
export class RoomsPageComponent  {

  roomTypes: any[] = [ {
    id: 1,
    name: "Single Room",
  },
  {
    id: 2,
    name: "Double Room",
  },
  {
    id: 3,
    name: "Deluxe Room",
  }];

  priceRange: number = 1000;
  apiResponse: Rooms[] = [];   
  
 
  availableRooms: any[] = [];
  
  checkInDate: string = '';
  checkOutDate: string = '';
  

  constructor(private roomTypesService: RoomTypesService,) {
    

   }

   ngOnInit():void {
  ;}
  filterRooms(): void {
    this.availableRooms = this.apiResponse.filter((room: any) => {
      return this.isRoomAvailable(room, this.checkInDate, this.checkOutDate);
    });
  }
  isRoomAvailable(room: any, checkIn: string, checkOut: string) {
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
  
  getRoomTypes(): void {
    this.roomTypesService.getRoomTypes().subscribe(data => {
      this.roomTypes = data;
    }, (error) => {
      console.error('Error fetching room types:', error);
    });
  }
   onPriceChange():void {
    console.log('Selected price range:', this.priceRange);
    
   }

   resetFilters(): void {
    this.checkInDate = '';
    this.checkOutDate = '';
    this.priceRange = 500;
    this.availableRooms = [];
  }

   

   



  

}
