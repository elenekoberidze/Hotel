import { Room } from './room.model';

export type HotelStarRating = 0 | 1 | 2 | 3 | 4 | 5;

export type HotelStatus = 'Active' | 'UnderRenovation' | 'Inactive' | 'OnBoarding';

export interface Hotel {
  hotelID: number;
  name: string;
  city: string;
  address: string;
  description?: string;
  starRating: HotelStarRating;
  status: HotelStatus;
  primaryImage?: string;
  images: string[];
  averageReviewScore: number;
  rooms: Room[];
}

export interface PagedHotelResponse {
  data: Hotel[];
  totalCount: number;
  page: number;
  pageSize: number;
}
