export interface HotelDTO {
    id: string;
    destinationId: number;
    name: string;
    location: Location;
    description: string | null;
    amenities: Amenities;
    images: HotelImages;
    bookingConditions: string[];
}

export interface Location {
    lat: number | null;
    lng: number | null;
    address: string | null;
    city: string | null;
    country: string | null;
}

export interface Amenities {
    general: string[];
    room: string[];
}

export interface HotelImages {
    rooms: HotelImage[];
    site: HotelImage[];
    amenities: HotelImage[];
}

export interface HotelImage {
    link: string;
    description: string;
}
