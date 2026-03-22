
export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected';

export interface CreateReviewRequest {
  hotelID: number;
  rating: number;    
  comment: string;
}

export interface Review {
  reviewID: number;
  userID: string;
  username: string;
  hotelID: number;
  hotelName: string;
  rating: number;
  comment: string;
  reviewDate: string;
  status: ReviewStatus;
  adminNote?: string;
}

export interface UpdateReviewStatusRequest {
  status: ReviewStatus;
  adminNote?: string;
}
