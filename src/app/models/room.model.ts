
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

export interface PagedRoomResponse {
  rooms: Room[];       
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}


export interface RoomDTO {
  roomID: number;
  hotelID: number;
  typeID: number;
  roomNumber: string;
  isAvailable: boolean;
  images: string[];
}

export interface RoomTypeRequest {
  typeName: string;
  basePrice: number;
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