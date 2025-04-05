export interface Rooms {
    id: number,
    name: string,
    hotelId: number,
    pricePerNight: number,
    available: boolean,
    maximumGuests: number,
    bookedDates: BookedDates[],
}

export interface BookedDates {
    id: number,
    date: string,
    roomId: number,
    images: Images[],
}

export interface Images {
    id: number,
    source: string,
    roomId: number,
}