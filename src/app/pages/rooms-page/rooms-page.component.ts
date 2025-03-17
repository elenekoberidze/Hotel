import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoomTypesService } from '../../room-types.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rooms-page',
  imports: [RouterLink, CommonModule],
  templateUrl: './rooms-page.component.html',
  styleUrl: './rooms-page.component.css'
})
export class RoomsPageComponent {

  roomTypes: any[] = [ {
    "id": 1,
    "name": "Single Room"
  },
  {
    "id": 2,
    "name": "Double Room"
  },
  {
    "id": 3,
    "name": "Deluxe Room"
  }];

  constructor(private roomTypesService: RoomTypesService) {
    this.getRoomTypes();
   }
   getRoomTypes(){
    this.roomTypesService.getRoomTypes().subscribe(data => {
      this.roomTypes = data;
      
    })
   }


   
   filteredRooms = [...this.roomTypes];
  priceRange = 500;
  checkInDate: string | null = null;
  checkOutDate: string | null = null;

  

  ngOnInit(): void {}

  onPriceChange(value: number): void {
    this.priceRange = value;
    this.filterRooms();
  }

  onCheckInChange(date: string): void {
    this.checkInDate = date;
    this.filterRooms();
  }

  onCheckOutChange(date: string): void {
    this.checkOutDate = date;
    this.filterRooms();
  }

  resetFilters(): void {
    this.priceRange = 500;
    this.checkInDate = null;
    this.checkOutDate = null;
    this.filteredRooms = [...this.roomTypes];
  }

  filterRooms(): void {
    this.filteredRooms = this.roomTypes.filter(room => {
      const priceMatch = room.price <= this.priceRange;
      return priceMatch;
    });
  }

  viewDetails(room: any): void {
    
    alert(`Viewing details for ${room.name}`);
  }

}
