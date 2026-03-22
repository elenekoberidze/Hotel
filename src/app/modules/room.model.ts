// Matches: RoomResponseDTO.cs  (what GetAll and GetBy{id} return)
export interface Room {
  roomID: number;
  roomNumber: string;
  price: number;
  isAvailable: boolean;
  roomType: string;
  hotelId: number;
  hotelName: string;
  city: string;
  starRating: number;
  images: string[];
  amenities: string[];
}

// Matches: PagedRoomResponseDTO.cs  (what GetAll returns)
export interface PagedRoomResponse {
  data: Room[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface RoomFilter {
  minPrice?: number;
  maxPrice?: number;
  checkIn?: string;    
  checkOut?: string;  
  maxGuests?: number;
  city?: string;
  hotelId?: number;
  starRating?: number;
  roomType?: string;
  sortBy?: string;     
  page?: number;
  pageSize?: number;
}

export interface RoomType {
  typeID: number;
  typeName: string;
  basePrice: number;
  roomCount: number;
}
