import { Amenities, HotelDTO, Location, HotelImages, HotelImage} from "../DTOs/HotelDTO";
import BaseSupplier from "./BaseSupplier";
import PatagonaDTO from "../DTOs/PatagoniaDTO";

class Patagona implements BaseSupplier {
    endpoint(): string {
        return "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia";
    }
    parse(body: string): HotelDTO[] {
        const PatagonaDTOs: PatagonaDTO[] = JSON.parse(body);
        const hotels: HotelDTO[] = PatagonaDTOs.map((patagonaDTO) => {
            // Parse latitude and longitude, defaulting to null if not a valid number
            const lat = typeof patagonaDTO.lat === "number" ? patagonaDTO.lat : null;
            const lng = typeof patagonaDTO.lng === "number" ? patagonaDTO.lng : null;

            // Patagonia doesn't provide city and country so i set them to null
            const location: Location = {
                lat: lat,
                lng: lng,
                address: patagonaDTO.address,
                city: null,
                country: null,
            };

            // Patagonia supplier doesn't seperate general and room, so i keep it empty
            const amenities: Amenities = {
                general: [],
                room: [],
            };

            // Patagonia provides images for rooms and amenites
            const hotelImages: HotelImages = {
                rooms: [],
                site: [],
                amenities: []
            };

            hotelImages.rooms = patagonaDTO.images.rooms.map(image => ({
                link: image.url,
                description: image.description,
            }));

            hotelImages.amenities = patagonaDTO.images.amenities.map(image => ({
                link: image.url,
                description: image.description,
            }));


            // Create the hotel object
            const hotel: HotelDTO = {
                id: patagonaDTO.id,
                destinationId: patagonaDTO.destination,
                name: patagonaDTO.name,
                location: location,
                description: patagonaDTO.info,
                amenities: amenities,
                images: hotelImages,
                bookingConditions: [], // Placeholder
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

export default Patagona;