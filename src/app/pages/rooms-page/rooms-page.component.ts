import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoomTypesService } from '../../room-types.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rooms-page',
  imports: [RouterLink, CommonModule],
  templateUrl: './rooms-page.component.html',
  styleUrl: './rooms-page.component.css'
})
export class RoomsPageComponent {

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

  constructor(private roomTypesService: RoomTypesService) {
    this.getRoomTypes();
   }
   getRoomTypes(){
    this.roomTypesService.getRoomTypes().subscribe(data => {
      this.roomTypes = data;
      
    })
   }

}
