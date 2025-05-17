import { Component , OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  Router, RouterLink } from '@angular/router';
import { Rooms } from '../../modules/rooms.model';


import { CommonModule } from '@angular/common';
import { HotelsService } from '../../service/hotels.service';
import { RoomsService } from '../../service/rooms.service';
import { Hotels } from '../../modules/hotels.model';
import { SelectedRoomsService } from '../../service/selected-rooms.service';


@Component({
  selector: 'app-home-page',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  standalone: true,
  template: `
    <div *ngFor="let room of rooms">
      <h3>{{ room.name }}</h3>
      <p>Price: {{ room.pricePerNight }}</p>
      <p>Guests: {{ room.maximumGuests }}</p>
      <img *ngFor="let image of room.images" [src]="image.source" [alt]="room.name" />
    </div>
  `,
})
export class HomePageComponent implements OnInit {
 rooms: Rooms[] = [];
  hotels: Hotels[] = [];
  currentHotel: Hotels | null = null;
  currentIndex = 0;
  isMenuOpen = false;

  constructor(
    private roomsService: RoomsService,
    private hotelsService: HotelsService,
    private selectedRoomsService: SelectedRoomsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch rooms
    this.roomsService.getRooms().subscribe((data) => {
      this.rooms = data;
      console.log('Rooms:', data);
    });

    // Fetch hotels
    this.hotelsService.getHotels().subscribe(
      (data) => {
        this.hotels = data;
        console.log('Hotels:', data);
        if (this.hotels.length > 0) {
          this.currentHotel = this.hotels[this.currentIndex];
          this.startBackgroundRotation();
        }
      },
      (error) => console.error('Error fetching hotels:', error)
    );
  }

  startBackgroundRotation(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.hotels.length;
      this.currentHotel = this.hotels[this.currentIndex];
    }, 3000);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  navigateToBookingPage(room: Rooms): void {
    this.router.navigate(['/booking', room.id]);
  }
}


