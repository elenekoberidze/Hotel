import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ReviewService } from '../../service/review.service';
import { AuthService } from '../../service/auth.service';
import { HotelService } from '../../service/hotels.service';
import { Review, CreateReviewRequest, Hotel } from '../../models';
 
@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-reviews.component.html',
  styleUrl: './my-reviews.component.css',
})
export class MyReviewsComponent implements OnInit {
  reviews: Review[] = [];
  hotels: Hotel[] = [];
  loading = false;
  error = '';
  success = '';
  isMenuOpen = false;
 
  showForm = false;
  newReview: CreateReviewRequest = { hotelID: 0, rating: 5, comment: '' };
  submitting = false;
 
  constructor(
    private reviewService: ReviewService,
    public authService: AuthService,
    private hotelService: HotelService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadMyReviews();
    this.loadHotels();
  }
 
  loadMyReviews(): void {
    this.loading = true;
    this.error = '';
    this.reviewService.getMyReviews().subscribe({
      next: (data) => { this.reviews = data; this.loading = false; },
      error: () => { this.error = 'Failed to load reviews.'; this.loading = false; },
    });
  }
 
  loadHotels(): void {
    this.hotelService.getHotels(1, 100).subscribe({
      next: (data) => (this.hotels = data.hotels),
      error: () => {},
    });
  }
 
  submitReview(): void {
    this.error = '';
    if (!this.newReview.hotelID || !this.newReview.comment.trim()) {
      this.error = 'Please select a hotel and write a comment.';
      return;
    }
    this.submitting = true;
    this.reviewService.createReview(this.newReview).subscribe({
      next: () => {
        this.success = 'Review submitted! It will appear once approved by an admin.';
        this.showForm = false;
        this.newReview = { hotelID: 0, rating: 5, comment: '' };
        this.submitting = false;
        this.loadMyReviews();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to submit review.';
        this.submitting = false;
      },
    });
  }
 
  deleteReview(reviewId: number): void {
    if (!confirm('Are you sure you want to delete this review?')) return;
    this.error = '';
    this.success = '';
    this.reviewService.deleteMyReview(reviewId).subscribe({
      next: () => {
        this.success = 'Review deleted.';
        this.reviews = this.reviews.filter((r) => r.reviewID !== reviewId);
      },
      error: (err) => (this.error = err?.error?.message ?? 'Failed to delete review.'),
    });
  }
 
  statusClass(status: string): string {
    if (status === 'Approved') return 'badge-approved';
    if (status === 'Rejected') return 'badge-rejected';
    return 'badge-pending';
  }
 
  stars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
 
  setRating(val: number): void { this.newReview.rating = val; }
 
  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu(): void  { this.isMenuOpen = false; }
 
  logout(event?: Event): void {
    event?.preventDefault();
    this.authService.logout();
    this.router.navigate(['/home']);
  }
 
  get username(): string {
    return this.authService.currentUser?.username ?? 'User';
  }
}