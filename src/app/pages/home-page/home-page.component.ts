import { Component , OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  RouterLink } from '@angular/router';
import { Rooms } from '../../modules/rooms.model';
import { HotelBookingService } from '../../service/hotel-booking.service';
import { CommonModule } from '@angular/common';


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
  }
constructor( private hotelBookingService: HotelBookingService) {}

}
