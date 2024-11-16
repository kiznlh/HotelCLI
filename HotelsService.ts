import { HotelDTO, HotelImage } from "./DTOs/HotelDTO";

export default class HotelsService {

    merged_hotels: HotelDTO[];

    constructor(){
        this.merged_hotels = [];
    }
    
    merge_and_save(hotels: HotelDTO[]) {
        // A map to store id of hotel to merge
        const hotelMap: Map<string, HotelDTO> = new Map();

        for (const hotel of hotels){
            const existingHotel = hotelMap.get(hotel.id);

            if (!existingHotel) {
                // If the hotel with this id doesn't exist yet, include it
                hotelMap.set(hotel.id,{...hotel});
            } else {
                // Merge the current hotel with the existing one in the map
                // Merge location (take non-null value)
                existingHotel.location.lat = existingHotel.location.lat || hotel.location.lat;
                existingHotel.location.lng = existingHotel.location.lng || hotel.location.lng;
                existingHotel.location.address = existingHotel.location.address || hotel.location.address;
                existingHotel.location.city = existingHotel.location.city || hotel.location.city;
                // I choose full name instead of country code (Singapore over SG)  
                if (hotel.location.country != null && existingHotel.location.country != null){
                    if (hotel.location.country > existingHotel.location.country){
                        existingHotel.location.country = hotel.location.country;
                    }
                }

                // Merge description (I choose to take the description that has the longest length)
                if (hotel.description != null && existingHotel.description != null){
                    if (hotel.description.length > existingHotel.description.length){
                        existingHotel.description = hotel.description;
                    }
                }

                // Merge amenities (combine general and room and remove any duplicate)
                existingHotel.amenities.general = mergeStringArray(existingHotel.amenities.general,hotel.amenities.general);
                existingHotel.amenities.room = mergeStringArray(existingHotel.amenities.room,hotel.amenities.room);

                // Merge images (combine rooms, site, and amenitites and remove any duplicate link)
                existingHotel.images.rooms = mergeImages(existingHotel.images.rooms, hotel.images.rooms);
                existingHotel.images.site = mergeImages(existingHotel.images.site, hotel.images.site);
                existingHotel.images.amenities = mergeImages(existingHotel.images.amenities, hotel.images.amenities);
                
                // Merge booking conditions
                // Because the booking condition is kind of a hand-written paragraph rather than something that can be compared like general or room
                // I set booking conditions to which has the highest number of conditions
                if (hotel.bookingConditions.length > existingHotel.bookingConditions.length){
                    existingHotel.bookingConditions = [...hotel.bookingConditions];
                }
            }
        }

        this.merged_hotels = [...hotelMap.values()];
    }

    find(hotel_ids: string[], destination_ids: string[]): HotelDTO[] {
        // If no hotel_id or destination_id is provided in the input, return all hotels.
        if (hotel_ids[0] === "none" || destination_ids[0] === "none"){
            return this.merged_hotels;
        }
        
        const filtered_hotels: HotelDTO[] = []

        for (let i = 0; i < hotel_ids.length; i++){
            for (const hotel of this.merged_hotels){
                // Only return hotel that matchs both id and destinationId 
                if (hotel.id === hotel_ids[i] && hotel.destinationId.toString() === destination_ids[i]){
                    filtered_hotels.push(hotel)
                }
            }     
        }
        return filtered_hotels;
    }
}
function mergeStringArray(existingString: string[], newString: string[]): string[]  {
    // Using a set (to remove duplicate) and spread operator to get all elements and combine them
    const stringSet = new Set([...existingString, ...newString]);

    // Return that as array
    return [...stringSet];

}

function mergeImages(existingImages: HotelImage[], newImages: HotelImage[]): HotelImage[] {
    const linksMap = new Set<string>();  // Track already added image links
    const merged: HotelImage[] = [...existingImages];  

    // Add existing images to map
    for (const image of existingImages){
        linksMap.add(image.link);
    }

    // Add images with different link from images that in the map
    for (const newImage of newImages){
        if (!linksMap.has(newImage.link)) {
            merged.push(newImage);
            linksMap.add(newImage.link);  
        }   
    }

    return merged;
}