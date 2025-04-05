import { Component , OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  RouterLink } from '@angular/router';
import { Rooms } from '../../modules/rooms.model';
import { HotelBookingService } from '../../service/hotel-booking.service';
import { CommonModule } from '@angular/common';
import { HotelsService } from '../../service/hotels.service';


@Component({
  selector: 'app-home-page',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  standalone: true,
})
export class HomePageComponent implements OnInit {
  rooms: Rooms[] = [];

  ngOnInit(): void {
    this.rooms = [
    {id: 3,
    name: 'Club Room',
    hotelId: 1,
    pricePerNight: 89,
    available: true,
    maximumGuests: 2,
    bookedDates: [],
  images: [
      {
        id: 7,
        source: "https://images.trvl-media.com/lodging/16000000/15840000/15835100/15835033/b6bb61fc.jpg?impolicy=fcrop&w=1200&h=800&p=1&q=medium",
        roomId: 2
      }]},
    {id: 1,
      name: 'Premium Room',
      hotelId: 1,
      pricePerNight: 199,
      available: true,
      maximumGuests: 3,
      bookedDates: [],
    images: [
      {
        id: 13,
        source: "https://images.trvl-media.com/lodging/16000000/15840000/15835100/15835033/74bb8203.jpg?impolicy=fcrop&w=1200&h=800&p=1&q=medium",
        roomId: 3
      }]},

    {id: 4,
    name: 'Deluxe Double Room',
    hotelId: 1,
    pricePerNight: 189,
    available: true,
    maximumGuests: 5,
    bookedDates: [],
    images: [
      {
        id: 18,
        source: 'https://images.trvl-media.com/lodging/16000000/15840000/15835100/15835033/14b60598.jpg?impolicy=fcrop&w=1200&h=800&p=1&q=medium',
        roomId: 4
      }
    ]}
  ];
  this.currentHotel = this.hotels[this.currentIndex];
  this.changeBackgroundImage();
  }
constructor( private hotelBookingService: HotelBookingService, private hotelsService: HotelsService) {}
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


