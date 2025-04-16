import { Component , OnInit} from '@angular/core';

import { RouterLink } from '@angular/router';
import { HotelsService } from '../../service/hotels.service';
import { CommonModule } from '@angular/common';
import { CityService } from '../../service/city.service';
import { Hotels } from '../../modules/hotels.model';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotels-page.component.html',
  styleUrls: ['./hotels-page.component.css'],
  imports: [RouterLink, CommonModule],
  standalone: true,
})
export class HotelsPageComponent implements OnInit {
  hotels: Hotels[]=[];
  city:any[]=["Tbilisi"];
  constructor(private hotelsService: HotelsService, private cityService: CityService) { 
    this.getCity();
  }
  ngOnInit(): void {
    this.hotelsService.getHotels().subscribe((data) => {
      this.hotels = data;
    })
  }

 
  getCity(  ) {
    this.cityService.getCitys().subscribe(data => {
      this.city = data;
    });
  }
}
