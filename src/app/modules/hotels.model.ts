import { Rooms } from "./rooms.model";

export interface Hotels{
    id: number;
    name: string;
    address: string;
    city: string;
    featuredImage: string;
    rooms: Rooms[],
}
