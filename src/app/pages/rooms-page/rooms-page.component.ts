import { Component , OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoomTypesService } from '../../room-types.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rooms-page',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './rooms-page.component.html',
  styleUrl: './rooms-page.component.css'
})
export class RoomsPageComponent implements OnInit {

  roomTypes: any[] = [ {
    "id": 1,
    "name": "Single Room"
  },
  {
    "id": 2,
    "name": "Double Room"
  },
  {
    "id": 3,
    "name": "Deluxe Room"
  }];

  priceRange: number = 1000;
  

  constructor(private roomTypesService: RoomTypesService) {
    this.getRoomTypes();

   }

   ngOnInit():void {}
   getRoomTypes(){
    this.roomTypesService.getRoomTypes().subscribe(data => {
      this.roomTypes = data;
    })
   }
   onPriceChange():void {
    console.log('Selected price range:', this.priceRange);
    
   }

   



  

}
