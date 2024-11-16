import { HotelDTO, HotelImage, Location, Amenities, HotelImages } from "./DTOs/HotelDTO";

export default class HotelsService {

    mergedHotels: HotelDTO[];

    constructor(){
        this.mergedHotels = [];
    }
    
    merge_and_save(hotels: HotelDTO[]) {
        // A map to store id of hotel to merge
        const hotelMap: Map<string, HotelDTO> = new Map();

        for (const hotel of hotels){

            const existingHotel = hotelMap.get(hotel.id);

            if (!existingHotel) {
                // If the hotel with this id doesn't exist yet, include it
                hotelMap.set(hotel.id,{...hotel});
                continue;
            }
            // Merge hotel with same id
            this.mergeHotelData(existingHotel, hotel);
        }

        this.mergedHotels = [...hotelMap.values()];
    }

    find(hotel_ids: string[], destination_ids: string[]): HotelDTO[] {
        // If no hotel_id or destination_id is provided in the input, return all hotels.
        if (hotel_ids[0] === "none" || destination_ids[0] === "none"){
            return this.mergedHotels;
        }
        
        const filtered_hotels: HotelDTO[] = []

        for (let i = 0; i < hotel_ids.length; i++){
            for (const hotel of this.mergedHotels){
                // Only return hotel that matchs both id and destinationId 
                if (hotel.id === hotel_ids[i] && hotel.destinationId.toString() === destination_ids[i]){
                    filtered_hotels.push(hotel)
                }
            }     
        }
        return filtered_hotels;
    }

    private mergeHotelData(existing: HotelDTO, newHotel: HotelDTO): void {
        existing.location = this.mergeLocation(existing.location, newHotel.location);
        // Merge description (I choose to take the description that has the longest length)
        existing.description = this.selectLongerText(existing.description, newHotel.description);
        existing.amenities = this.mergeAmenities(existing.amenities, newHotel.amenities);
        existing.images = this.mergeAllImages(existing.images, newHotel.images);
        existing.bookingConditions = this.mergeBookingConditions(
            existing.bookingConditions, 
            newHotel.bookingConditions
        );
    }

     // Merge location (take non-null value)
    private mergeLocation(existing: Location, newLoc: Location): Location {
        return {
            lat: existing.lat || newLoc.lat,
            lng: existing.lng || newLoc.lng,
            address: existing.address || newLoc.address,
            city: existing.city || newLoc.city,
            // I choose full name of country rather than country code (Singapore over SG)
            country: this.selectLongerText(existing.country, newLoc.country),
        };
    }

    // Merge amenities (combine general and room and remove any duplicate)
    private mergeAmenities(existing: Amenities, newAmenities: Amenities): Amenities {
        return {
            general: this.mergeStringArray(existing.general, newAmenities.general),
            room: this.mergeStringArray(existing.room, newAmenities.room),
        };
    }

    // Merge images (combine rooms, site, and amenitites and remove any duplicate link)
    private mergeAllImages(existing: HotelImages, newImages: HotelImages): HotelImages {
        return {
            rooms: this.mergeImages(existing.rooms, newImages.rooms),
            site: this.mergeImages(existing.site, newImages.site),
            amenities: this.mergeImages(existing.amenities, newImages.amenities)
        };
    }  

    // Merge booking conditions
    // Because the booking condition is kind of a hand-written paragraph rather than something that can be compared like general or room
    // I set booking conditions to which has the highest number of conditions
    private mergeBookingConditions(
        existing: string[], 
        newConditions: string[]
    ): string[] {
        return newConditions.length > existing.length ? [...newConditions] : existing;
    }


    // Helper function to merge array of string and remove duplicate
    private mergeStringArray(existingString: string[], newString: string[]): string[]  {
        // Using a set (to remove duplicate) and spread operator to get all elements and combine them
        const stringSet = new Set([...existingString, ...newString]);
    
        // Return that as array
        return [...stringSet];
    
    }
    
    // Helper function to merge array of HotelImage and remove duplicate link
    private mergeImages(existingImages: HotelImage[], newImages: HotelImage[]): HotelImage[] {
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

    // Helper function to select longer text 
    private selectLongerText(existing: string | null, newText: string | null): string | null {
        if (!existing || !newText) return existing || newText;
        return newText.length > existing.length ? newText : existing;
    }
}

