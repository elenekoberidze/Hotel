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
  city:Hotels[]=[];
  
  constructor(private hotelsService: HotelsService, private cityService: CityService) { 
    this.getCity();
  }
  ngOnInit(): void {
    this.hotelsService.getHotels().subscribe((data) => {
      this.hotels = data;
    })
  }

 
  getCity(): void {
    this.cityService.getCitys().subscribe(
      (data) => {
        console.log('City data received:', data); 
        this.city = data;
      },
      (error) => {
        console.error('Error fetching cities:', error); 
      }
    );
  }
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
  
}
