import { Component , OnInit} from '@angular/core';

import { RouterLink } from '@angular/router';
import { HotelsService } from '../../service/hotels.service';
import { CommonModule } from '@angular/common';
import { CityService } from '../../service/city.service';
import { Hotels } from '../../modules/hotels.model';
import { UserService } from '../../service/user.service';
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
  
  constructor(private hotelsService: HotelsService, private cityService: CityService,  public userService: UserService ) { 
    this.getCity();
  }
  ngOnInit(): void {
    this.hotelsService.getHotels().subscribe((data) => {
      this.hotels = data;
    })
     this.userService.currentUser.subscribe((user) => {
      if (user && user.firstName && user.lastName) {
        
        this.userName = `${user.firstName} ${user.lastName}`;
      } else if (user && user.firstName) {
       
        this.userName = user.firstName;
      } else if (user && user.phoneNumber) {
        
        this.userName = user.phoneNumber;
      } else {
        
        this.userName = 'User';
      }
    });
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
     userName: string = 'User'; 

  
  
 

  
  getUserName(): string {
    return this.userName; 
  }

  
  logout(event?: Event): void {
    if (event) {
      event.preventDefault(); 
    }
    this.userService.logout(); 
  }
}
