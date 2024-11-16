
import { HotelDTO, Location, Amenities } from "../DTOs/HotelDTO";
import BaseSupplier from "./BaseSupplier";
import AcmeDTO from "../DTOs/AcmeDTO";

  
class Acme implements BaseSupplier {
    endpoint(): string {
        return "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme";
    }

    parse(body: string): HotelDTO[] {
        const AcmeDTOs: AcmeDTO[] = JSON.parse(body);
        const hotels: HotelDTO[] = AcmeDTOs.map((acmeDTO) => {
            // Parse latitude and longitude, defaulting to null if not a valid number
            const lat = typeof acmeDTO.Latitude === "number" ? acmeDTO.Latitude : null;
            const lng = typeof acmeDTO.Longitude === "number" ? acmeDTO.Longitude : null;

            // Sanitize address
            const locationAddress = acmeDTO.Address.trim();

            const location: Location = {
                lat: lat,
                lng: lng,
                address: locationAddress,
                city: acmeDTO.City.trim(),
                country: acmeDTO.Country.trim(),
            };

            // // Sanitize Factilites as Acme provide Factilites as General
            // // const sanitizedFacilites = normalizeFacilites(res.Facilities);
            
            // Acme supplier doesn't seperate general and room, so i keep it empty
            const amenities: Amenities = {
                general: [],
                room: [],
            };


            // Create the hotel object
            const hotel: HotelDTO = {
                id: acmeDTO.Id,
                destinationId: acmeDTO.DestinationId,
                name: acmeDTO.Name,
                location: location,
                description: acmeDTO.Description.trim(),
                amenities: amenities,
                images: { rooms: [], site: [], amenities: [] }, // Placeholder
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

// function normalizeFacilites(strs: string[]): string[] {
//     return strs.map((str) =>
//         str
//           .replace(/([a-z])([A-Z])/g, "$1 $2") // Add a space between lowercase and uppercase letters
//           .toLowerCase() // Convert to lowercase
//           .trim() // Remove leading and trailing whitespace
//     );
// }

export default Acme;
