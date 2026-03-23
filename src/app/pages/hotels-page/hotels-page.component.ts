import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../service/hotels.service';
import { AuthService } from '../../service/auth.service';
import { Hotel } from '../../models';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-hotel',
  templateUrl: './hotels-page.component.html',
  styleUrls: ['./hotels-page.component.css'],
  imports: [RouterLink, CommonModule, FormsModule],
  standalone: true,
})
export class HotelsPageComponent implements OnInit {
  hotels: Hotel[] = [];
  cities: string[] = [];
  selectedCity = '';
  loading = false;
  error = '';

  constructor(
    private hotelService: HotelService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadHotels();
    this.loadCities();
  }

  loadHotels(): void {
    this.loading = true;
    this.hotelService.getHotels().subscribe({
      next: (response) => {
        this.hotels = response.hotels;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load hotels.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadCities(): void {
    this.hotelService.getCities().subscribe({
      next: (data) => (this.cities = data),
      error: (err) => console.error('Error fetching cities:', err),
    });
  }

  filterByCity(city: string): void {
    this.selectedCity = city;
    if (!city) {
      this.loadHotels();
      return;
    }

    this.loading = true;
    this.hotelService.getHotelsByCity(city).subscribe({
      next: (data) => {
        this.hotels = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to filter hotels.';
        this.loading = false;
      },
    });
  }

  isMenuOpen = false;

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