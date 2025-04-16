import { Component , OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  RouterLink } from '@angular/router';
import { Rooms } from '../../modules/rooms.model';

import { CommonModule } from '@angular/common';
import { HotelsService } from '../../service/hotels.service';
import { RoomsService } from '../../service/rooms.service';


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
export class HomePageComponent {
  rooms: Rooms[] = [];
  

  ngOnInit(): void {
    this.roomsService.getRooms().subscribe((data) => {
      this.rooms = data;
      console.log(data);
      
    });
  this.currentHotel = this.hotels[this.currentIndex];
  this.changeBackgroundImage();
  }
constructor( private hotelsService: HotelsService, private roomsService: RoomsService) {}
hotels: any[] = [
  {
    id: 1,
    name: "The Biltmore Hotel Tbilisi",
    address: "29 Rustaveli Ave, Tbilisi, Tbilisi, 0108",
    city: "Tbilisi",
    featuredImage: "https://images.trvl-media.com/lodging/16000000/15840000/15835100/15835033/41cbdcb1.jpg?impolicy=resizecrop&rw=1200&ra=fit",
    rooms: []
  },
  {
    id: 2,
    name: "Courtyard by Marriott Tbilisi",
    address: "4, Freedom Square, Tbilisi, 0105",
    city: "Tbilisi",
    featuredImage: "https://images.trvl-media.com/lodging/1000000/920000/916400/916376/3e65a896.jpg?impolicy=resizecrop&rw=1200&ra=fit",
    rooms: []
  },
  {
    id: 3,
    name: "Radisson Blu Iveria Hotel Tbilisi",
    address: "1 Republic square, Tbilisi, 0108",
    city: "Tbilisi",
    featuredImage: "https://images.trvl-media.com/lodging/3000000/2620000/2614700/2614694/84d23097.jpg?impolicy=resizecrop&rw=1200&ra=fit",
    rooms: []
  }
];

currentHotel: any;
currentIndex = 0;

changeBackgroundImage(): void {
  setInterval(() => {
    this.currentIndex = (this.currentIndex + 1) % this.hotels.length;
    this.currentHotel = this.hotels[this.currentIndex];
  }, 3000); 
}
}


