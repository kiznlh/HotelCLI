export default interface AcmeDTO {
    Id: string;
    DestinationId: number;
    Name: string;
    Latitude: number | string | null; // Can be "" and null
    Longitude: number | string | null; // Can be "" and null
    Address: string;
    City: string;
    Country: string;
    PostalCode: string;
    Description: string;
    Facilities: string[];
};