import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CityService } from '../../service/city.service';


@Component({
  selector: 'app-booked-rooms',
  imports: [RouterLink],
  templateUrl: './booked-rooms.component.html',
  styleUrl: './booked-rooms.component.css'
})
export class BookedRoomsComponent {

  city:any[]=["Tbilisi"];
  
    
    
  
    constructor( private cityService: CityService) { 
      
      this.getCity();
    }
  
    
    getCity(  ) {
      this.cityService.getCitys().subscribe(data => {
        this.city = data;
      });
    }

    

}
