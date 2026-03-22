import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, CreateReviewRequest, UpdateReviewStatusRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = '/api/Review';

  constructor(private http: HttpClient) {}


  getHotelReviews(hotelId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/GetHotelReviewsBy${hotelId}`);
  }


  createReview(data: CreateReviewRequest): Observable<Review> {
    const form = new FormData();
    form.append('hotelID', data.hotelID.toString());
    form.append('rating', data.rating.toString());
    form.append('comment', data.comment);
    return this.http.post<Review>(`${this.apiUrl}/CreateReview`, form);
  }

  getMyReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/CurrentUsersReview`);
  }

  deleteMyReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteReviewBy${reviewId}`);
  }


  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/AdminGetAllReviews`);
  }

  getPendingReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/AdminGetPendingReviews`);
  }

  updateReviewStatus(reviewId: number, data: UpdateReviewStatusRequest): Observable<Review> {
    const form = new FormData();
    form.append('status', data.status);
    if (data.adminNote) form.append('adminNote', data.adminNote);
    return this.http.patch<Review>(
      `${this.apiUrl}/AdminUpdateReviewStatusBy${reviewId}`, form
    );
  }

  adminDeleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/AdminDeleteReviewBy${reviewId}`);
  }
}