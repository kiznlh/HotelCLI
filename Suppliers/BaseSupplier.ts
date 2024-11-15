import { HotelDTO } from "../DTOs/HotelDTO";

export default interface BaseSupplier {
    endpoint(): string;
    parse(body: string): HotelDTO[];
    fetch(): Promise<HotelDTO[]>;
}
