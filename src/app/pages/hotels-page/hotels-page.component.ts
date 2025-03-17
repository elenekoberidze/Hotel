import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';
import { HotelsService } from '../../hotels.service';
import { CommonModule } from '@angular/common';
import { CityService } from '../../city.service';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotels-page.component.html',
  styleUrls: ['./hotels-page.component.css'],
  imports: [RouterLink, CommonModule],
  standalone: true,
})
export class HotelsPageComponent  {

  hotels: any[] = [{
    "id": 1,
    "name": "The Biltmore Hotel Tbilisi",
    "address": "29 Rustaveli Ave, Tbilisi, Tbilisi, 0108",
    "city": "Tbilisi",
    "featuredImage": "https://images.trvl-media.com/lodging/16000000/15840000/15835100/15835033/41cbdcb1.jpg?impolicy=resizecrop&rw=1200&ra=fit",
    "rooms": []
  },
  {
    "id": 2,
    "name": "Courtyard by Marriott Tbilisi",
    "address": "4, Freedom Square, Tbilisi, 0105",
    "city": "Tbilisi",
    "featuredImage": "https://images.trvl-media.com/lodging/1000000/920000/916400/916376/3e65a896.jpg?impolicy=resizecrop&rw=1200&ra=fit",
    "rooms": []
  },
  {
    "id": 3,
    "name": "Radisson Blu Iveria Hotel Tbilisi",
    "address": "1 Republic square, Tbilisi, 0108",
    "city": "Tbilisi",
    "featuredImage": "https://images.trvl-media.com/lodging/3000000/2620000/2614700/2614694/84d23097.jpg?impolicy=resizecrop&rw=1200&ra=fit",
    "rooms": []
  },];  


  city:any[]=["Tbilisi"];

  
  

  constructor(private hotelsService: HotelsService, private cityService: CityService) { 
    this.fetchHotels();
    this.getCity();
  }

  fetchHotels() {
    this.hotelsService.getHotels().subscribe(
     data => {
        this.hotels = data;
      });
  };
  getCity(  ) {
    this.cityService.getCitys().subscribe(data => {
      this.city = data;
    });
  }
}
