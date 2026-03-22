import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../service/rooms.service';
import { AuthService } from '../../service/auth.service';
import { Room, RoomType, RoomFilter } from '../../models';

@Component({
  selector: 'app-rooms-page',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, RouterModule],
  templateUrl: './rooms-page.component.html',
  styleUrl: './rooms-page.component.css',
})
export class RoomsPageComponent implements OnInit {
  rooms: Room[] = [];
  roomTypes: string[] = [];
  hotelId: number | null = null;
  loading = false;
  error = '';
  isMenuOpen = false;

  
  checkInDate = '';
  checkOutDate = '';
  selectedRoomType = '';
  maxPrice: number | null = null;
  minPrice: number | null = null;

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const routeHotelId = this.route.snapshot.paramMap.get('hotelId');
    this.hotelId = routeHotelId ? +routeHotelId : null;

    this.loadRooms();
    this.loadRoomTypes();
  }

  loadRooms(): void {
    this.loading = true;
    this.error = '';

    const filter: RoomFilter = {
      hotelId:   this.hotelId ?? undefined,
      checkIn:   this.checkInDate   || undefined,
      checkOut:  this.checkOutDate  || undefined,
      roomType:  this.selectedRoomType || undefined,
      maxPrice:  this.maxPrice  ?? undefined,
      minPrice:  this.minPrice  ?? undefined,
    };

    this.roomService.getRooms(filter).subscribe({
      next: (response) => {
        this.rooms = response.rooms;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load rooms.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadRoomTypes(): void {
    this.roomService.getRoomTypes().subscribe({
      next: (data) => (this.roomTypes = data),
      error: (err) => console.error('Error fetching room types:', err),
    });
  }

  onFilterChange(): void {
    this.loadRooms();
  }

  resetFilters(): void {
    this.checkInDate = '';
    this.checkOutDate = '';
    this.selectedRoomType = '';
    this.maxPrice = null;
    this.minPrice = null;
    this.loadRooms();
  }

  bookRoom(roomID: number): void {
    this.router.navigate(['/booking', roomID]);
  }

  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu(): void  { this.isMenuOpen = false; }

  logout(event?: Event): void {
    event?.preventDefault();
    this.authService.logout();
  }

  get username(): string {
    return this.authService.currentUser?.username ?? 'User';
  }
}