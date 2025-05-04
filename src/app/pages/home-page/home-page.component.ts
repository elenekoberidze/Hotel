import { Component , OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  RouterLink } from '@angular/router';
import { Rooms } from '../../modules/rooms.model';


import { CommonModule } from '@angular/common';
import { HotelsService } from '../../service/hotels.service';
import { RoomsService } from '../../service/rooms.service';
import { Hotels } from '../../modules/hotels.model';


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
  

  ngOnInit(): void {
    this.roomsService.getRooms().subscribe((data) => {
      this.rooms = data;
      console.log(data);
      
    });
  
  this.hotelsService.getHotels().subscribe(
    (hotels) => {
      this.hotels = hotels;
      console.log('Processed Hotels:', this.hotels); 
      if (this.hotels.length > 0) {
        this.currentHotel = this.hotels[this.currentIndex];
        this.changeBackgroundImage();
      }
    },
    (error) => {
      console.error('Error fetching hotels:', error); 
    }
  );
  }
constructor( private hotelsService: HotelsService, private roomsService: RoomsService) {}
hotels: Hotels[] = [];


currentHotel: any;
currentIndex = 0;

changeBackgroundImage(): void {
  setInterval(() => {
    this.currentIndex = (this.currentIndex + 1) % this.hotels.length;
    this.currentHotel = this.hotels[this.currentIndex];
  }, 3000); 
}
}


