import Acme from "./Suppliers/Acme";
import Patagona from "./Suppliers/Patagonia";
import Paperflies from "./Suppliers/Paperflies";
import { HotelDTO } from "./DTOs/HotelDTO";
import HotelsService from "./HotelsService";
import * as fs from 'fs';


async function fetch_hotels(hotel_ids: string[], destination_ids: string[]): Promise<string> {
    const suppliers = [new Acme(), new Paperflies(), new Patagona()]

    // Fetch from suppliers
    const hotels: HotelDTO[] = []

    for (const sup of suppliers) {
        const fetchedHotels = await sup.fetch();
        hotels.push(...fetchedHotels);
    }

    // Merge all the data and save it in-memory 
    const svc: HotelsService = new HotelsService()
    svc.merge_and_save(hotels)

    // Fetch filtered data
    const filtered = svc.find(hotel_ids, destination_ids)

    // Return as json
    return JSON.stringify(filtered)
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        console.log('Error: Invalid number of arguments');
        console.log('Usage: ts-node index.ts <hotel_ids> <destination_ids>');
        console.log('Example: ts-node hotel_id_1,hotel_id_2,hotel_id_3 destination_id_1,destination_id_2');
        console.log('Example: ts-node hotel_id_4,hotel_id_5 none');
        console.log('Example: ts-node none destination_id_3');
        process.exit(1); 
    }

    let hotel_ids = args[0].split(',');
    let destination_ids = args[1].split(',');

    const result = await fetch_hotels(hotel_ids,destination_ids)
    
    // fs.writeFile('output.json', result, (err) => {
    //     if (err) {
    //       console.error('Error writing to file:', err);
    //     } else {
    //       console.log('File has been saved');
    //     }
    //   });
    
    console.log(result)
}

main();
