import { Amenities, HotelDTO, Location, HotelImages, HotelImage} from "../DTOs/HotelDTO";
import BaseSupplier from "./BaseSupplier";
import PaperfliesDTO from "../DTOs/PaperfliesDTO";

class Paperflies implements BaseSupplier {
    endpoint(): string {
        return "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies";
    }
    parse(body: string): HotelDTO[] {
        const PaperfliesDTOs: PaperfliesDTO[] = JSON.parse(body);
        const hotels: HotelDTO[] = PaperfliesDTOs.map((paperfliesDTO) => {
            // Paperflies doesn't provide lat, lng, and city
            const location: Location = {
                lat: null,
                lng: null,
                address: paperfliesDTO.location.address.trim(),
                city: null,
                country: paperfliesDTO.location.country.trim(),
            };

            // Paperflies supplier seperate general and room
            const amenities: Amenities = {
                general: [...paperfliesDTO.amenities.general],
                room: [...paperfliesDTO.amenities.room],
            };

            // Paperflies provides images for rooms and sites
            const hotelImages: HotelImages = {
                rooms: [],
                site: [],
                amenities: []
            };

            hotelImages.rooms = paperfliesDTO.images.rooms.map(image => ({
                link: image.link,
                description: image.caption,
            }));

            hotelImages.site = paperfliesDTO.images.site.map(image => ({
                link: image.link,
                description: image.caption,
            }));

            // Remove head and trailing space 
            const sanitizedBookingCondtions: string[] = paperfliesDTO.booking_conditions.map(condition => {
                return condition.trim()
            })

            // Create the hotel object
            const hotel: HotelDTO = {
                id: paperfliesDTO.hotel_id,
                destinationId: paperfliesDTO.destination_id,
                name: paperfliesDTO.hotel_name,
                location: location,
                description: paperfliesDTO.details,
                amenities: amenities,
                images: hotelImages,
                bookingConditions: sanitizedBookingCondtions, // Paperflies does provide booking conditions
            };

            return hotel;
        });

        return hotels;
    }

    async fetch(): Promise<HotelDTO[]> {
        const url = this.endpoint();
        try {
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`Error: Expected status 200 OK, got ${response.status}`);
                return [];
            }

            const body = await response.text();
            return this.parse(body);
        } catch (error) {
            console.error("Fetch error:", error);
            return [];
        }
    }
}

export default Paperflies;