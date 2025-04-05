export interface Booking {
    id: number,
    roomID: number,
    checkInDate: string,
    checkOutDate: string,
    totalPrice: number,
    isConfirmed: boolean,
    customerName: string,
    customerPhone: string,
}