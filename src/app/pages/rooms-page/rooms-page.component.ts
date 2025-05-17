import { Component , OnInit} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoomTypesService } from '../../service/room-types.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Rooms } from '../../modules/rooms.model';
import { RoomsService } from '../../service/rooms.service';

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
  selectedRoomType: string = '';
  maxPrice: number = 1000;
  hotelId: number | null = null;
  isMenuOpen = false;

  constructor(
    private roomTypesService: RoomTypesService,
    private roomsService: RoomsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const routeHotelId = this.route.snapshot.paramMap.get('hotelId');
    this.hotelId = routeHotelId ? +routeHotelId : null; 

    this.getRoomTypes();
  }

  getRoomTypes(): void {
    this.roomsService.getRooms().subscribe(
      (data) => {
        console.log('Rooms fetched:', data);

        
        this.apiResponse = this.hotelId
          ? data.filter((room) => room.hotelId === this.hotelId)
          : data;

        this.roomTypes = [...this.apiResponse];
        this.availableRooms = [...this.apiResponse];

        
        this.maxPrice = Math.max(...this.apiResponse.map((room) => room.pricePerNight), 1000);
      },
      (error) => {
        console.error('Error fetching rooms:', error);
      }
    );
  }

  onRoomTypeChange(): void {
    this.filterRooms();
  }

  filterRooms(): void {
    this.availableRooms = this.apiResponse.filter((room: any) => {
      const matchesPrice = room.pricePerNight <= this.priceRange;
      const matchesDates = this.isRoomAvailable(room, this.checkInDate, this.checkOutDate);
      const matchesType = !this.selectedRoomType || room.id === +this.selectedRoomType;
      return matchesPrice && matchesDates && matchesType;
    });
  }

  isRoomAvailable(room: any, checkIn: string, checkOut: string): boolean {
    if (!checkIn || !checkOut) {
      return true;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    return room.bookedDates.every((bookedDate: any) => {
      const bookedDateObj = new Date(bookedDate.date);
      return bookedDateObj < checkInDate || bookedDateObj > checkOutDate;
    });
  }

  onDateChange(): void {
    if (this.checkInDate && this.checkOutDate) {
      this.filterRooms();
    }
  }

  onPriceChange(): void {
    this.filterRooms();
  }

  resetFilters(): void {
    this.selectedRoomType = '';
    this.priceRange = 1000;
    this.checkInDate = '';
    this.checkOutDate = '';
    this.availableRooms = [...this.apiResponse];
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

}

   



  


