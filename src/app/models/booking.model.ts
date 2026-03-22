
export type BookingStatus = 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';

export interface CreateBookingRequest {
  roomID: number;
  checkInDate: string;   
  checkOutDate: string;  
}

export interface Booking {
  bookingID: number;
  userID: string;
  username: string;
  roomID: number;
  roomNumber: string;
  hotelName: string;
  hotelCity: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface PagedBookingResponse {
  data: Booking[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
}
