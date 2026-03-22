import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../service/hotels.service';
import { RoomService } from '../../service/rooms.service';
import { AmenityService } from '../../service/amenity.service';
import { ReviewService } from '../../service/review.service';
import { AuthService } from '../../service/auth.service';
import { Hotel, Room, Amenity, Review } from '../../models';

@Component({
  selector: 'app-home-page',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  standalone: true,
})
export class HomePageComponent implements OnInit {
  rooms: Room[] = [];
  hotels: Hotel[] = [];
  amenities: Amenity[] = [];
  reviews: Review[] = [];
  currentHotel: Hotel | null = null;
  currentIndex = 0;
  isMenuOpen = false;

  constructor(
    private roomService: RoomService,
    private hotelService: HotelService,
    private amenityService: AmenityService,
    private reviewService: ReviewService,
    private router: Router,
    private ngZone: NgZone,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.roomService.getRooms({ pageSize: 3 }).subscribe({
      next: (response) => (this.rooms = response.rooms),
      error: (err) => console.error('Error fetching rooms:', err),
    });

    this.hotelService.getHotels().subscribe({
      next: (response) => {
        this.hotels = response.hotels;
        if (this.hotels.length > 0) {
          this.currentHotel = this.hotels[0];
          this.startBackgroundRotation();
          this.loadReviews(this.hotels[0].hotelID);
        }
      },
      error: (err) => console.error('Error fetching hotels:', err),
    });

    this.amenityService.getAmenities().subscribe({
      next: (data) => (this.amenities = data),
      error: (err) => console.error('Error fetching amenities:', err),
    });
  }

  loadReviews(hotelId: number): void {
    this.reviewService.getHotelReviews(hotelId).subscribe({
      next: (data) => (this.reviews = data.slice(0, 6)),
      error: (err) => console.error('Error fetching reviews:', err),
    });
  }

  startBackgroundRotation(): void {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.ngZone.run(() => {
          this.currentIndex = (this.currentIndex + 1) % this.hotels.length;
          this.currentHotel = this.hotels[this.currentIndex];
        });
      }, 3000);
    });
  }

  navigateToBookingPage(room: Room): void {
    this.router.navigate(['/booking', room.roomID]);
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
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