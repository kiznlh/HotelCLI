interface PatagoniaImage {
    url: string;
    description: string;
}

interface PatagoniaImages {
    rooms: PatagoniaImage[];
    amenities: PatagoniaImage[];
}

export default interface PatagonaDTO {
    id: string;
    destination: number;
    name: string;
    lat: number | null;
    lng: number | null;
    address: string | null;
    info: string | null;
    amenities: string[] | null;
    images: PatagoniaImages;
}