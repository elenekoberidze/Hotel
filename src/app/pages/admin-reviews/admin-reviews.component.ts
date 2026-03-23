import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ReviewService } from '../../service/review.service';
import { AuthService } from '../../service/auth.service';
import { Review, UpdateReviewStatusRequest } from '../../models';
 
type FilterTab = 'all' | 'pending' | 'approved' | 'rejected';
 
@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-reviews.component.html',
  styleUrl: './admin-reviews.component.css',
})
export class AdminReviewsComponent implements OnInit {
  allReviews: Review[] = [];
  filtered: Review[] = [];
  loading = false;
  error = '';
  success = '';
  isMenuOpen = false;
  tabs: FilterTab[] = ['pending', 'all', 'approved', 'rejected'];
 
  activeTab: FilterTab = 'pending';
 
  editingId: number | null = null;
  editStatus: 'Approved' | 'Rejected' = 'Approved';
  editNote = '';
  updating = false;
 
  constructor(
    private reviewService: ReviewService,
    public authService: AuthService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    if (!this.authService.isLoggedIn() || !this.authService.isAdmin()) {
      this.router.navigate(['/home']);
      return;
    }
    this.loadAll();
  }
 
  loadAll(): void {
    this.loading = true;
    this.error = '';
    this.reviewService.getAllReviews().subscribe({
      next: (data) => {
        this.allReviews = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load reviews.'; this.loading = false; },
    });
  }
 
  setTab(tab: FilterTab): void {
    this.activeTab = tab;
    this.applyFilter();
  }
 
  applyFilter(): void {
    if (this.activeTab === 'all') {
      this.filtered = this.allReviews;
    } else {
      const s = this.activeTab.charAt(0).toUpperCase() + this.activeTab.slice(1);
      this.filtered = this.allReviews.filter((r) => r.status === s);
    }
  }
 
  startEdit(review: Review): void {
    this.editingId = review.reviewID;
    this.editStatus = review.status === 'Approved' ? 'Approved' : 'Rejected';
    this.editNote = review.adminNote ?? '';
  }
 
  cancelEdit(): void {
    this.editingId = null;
    this.editNote = '';
  }
 
  submitUpdate(reviewId: number): void {
    this.updating = true;
    this.error = '';
    const payload: UpdateReviewStatusRequest = {
      status: this.editStatus,
      adminNote: this.editNote || undefined,
    };
    this.reviewService.updateReviewStatus(reviewId, payload).subscribe({
      next: (updated) => {
        const idx = this.allReviews.findIndex((r) => r.reviewID === reviewId);
        if (idx !== -1) this.allReviews[idx] = updated;
        this.applyFilter();
        this.success = `Review #${reviewId} marked as ${this.editStatus}.`;
        this.editingId = null;
        this.editNote = '';
        this.updating = false;
      },
      error: () => {
        this.error = 'Failed to update review status.';
        this.updating = false;
      },
    });
  }
 
  quickApprove(review: Review): void {
    this.reviewService.updateReviewStatus(review.reviewID, { status: 'Approved' }).subscribe({
      next: (updated) => {
        const idx = this.allReviews.findIndex((r) => r.reviewID === review.reviewID);
        if (idx !== -1) this.allReviews[idx] = updated;
        this.applyFilter();
        this.success = 'Review approved.';
      },
      error: () => (this.error = 'Failed to approve review.'),
    });
  }
 
  quickReject(review: Review): void {
    this.reviewService.updateReviewStatus(review.reviewID, { status: 'Rejected' }).subscribe({
      next: (updated) => {
        const idx = this.allReviews.findIndex((r) => r.reviewID === review.reviewID);
        if (idx !== -1) this.allReviews[idx] = updated;
        this.applyFilter();
        this.success = 'Review rejected.';
      },
      error: () => (this.error = 'Failed to reject review.'),
    });
  }
 
  deleteReview(reviewId: number): void {
    if (!confirm('Permanently delete this review?')) return;
    this.error = '';
    this.reviewService.adminDeleteReview(reviewId).subscribe({
      next: () => {
        this.allReviews = this.allReviews.filter((r) => r.reviewID !== reviewId);
        this.applyFilter();
        this.success = 'Review deleted.';
      },
      error: () => (this.error = 'Failed to delete review.'),
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
 
  count(tab: FilterTab): number {
    if (tab === 'all') return this.allReviews.length;
    const s = tab.charAt(0).toUpperCase() + tab.slice(1);
    return this.allReviews.filter((r) => r.status === s).length;
  }
 
  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu(): void  { this.isMenuOpen = false; }
 
  logout(event?: Event): void {
    event?.preventDefault();
    this.authService.logout();
    this.router.navigate(['/home']);
  }
 
  get username(): string {
    return this.authService.currentUser?.username ?? 'Admin';
  }
}