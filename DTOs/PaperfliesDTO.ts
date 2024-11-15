interface PaperfliesImage {
    link: string;
    caption: string;
}
interface PaperfliesImages {
    rooms: PaperfliesImage[];
    site: PaperfliesImage[];
}
interface Location {
    address: string;
    country: string;
}

interface Amenities {
    general: string[];
    room: string[];
}

export default interface PaperfliesDTO {
    hotel_id: string;
    destination_id: number;
    hotel_name: string;
    location: Location;
    details: string;
    amenities: Amenities;
    images: PaperfliesImages;
    booking_conditions: string[];
}
