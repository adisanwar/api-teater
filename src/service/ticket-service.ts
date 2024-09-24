import { Contact, Show, Ticket, TmpShuffle, User } from "@prisma/client";
import { exec } from 'child_process';
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  CreateTicketRequest,
  GetTicketRequest,
  RemoveTicketRequest,
  TicketResponse,
  toTicketResponse,
  UpdateTicketRequest,
} from "../model/ticket-model";
import { ShowService } from "./show-service";
import { TicketValidation } from "../validation/ticket-validation";
import path from "path";
import fs from "fs";
import { logger } from "../application/logging";
import { deleteOldFile } from "../middleware/upload-middleware";
import { fisherYatesShuffle } from "../model/fisher-yates";

export class TicketService {
  static async create(request: CreateTicketRequest): Promise<TicketResponse> {
    const createRequest: any = Validation.validate(
      TicketValidation.CREATE,
      request
    );
    await this.checkShowMustExists(createRequest.showId);

    const record = {
      ...createRequest,
      showId: createRequest.showId,
      contactId: createRequest.contactId,
    };

    logger.debug("response : " + JSON.stringify(record));
    console.log(record);
    const ticket: any = await prismaClient.ticket.create({
      data: record,
    });

    return toTicketResponse(ticket);
  }

  static async checkShowMustExists(showId: number): Promise<void> {
    const show = await prismaClient.show.findUnique({
      where: {
        id: showId,
      },
    });

    if (!show) {
      throw new ResponseError(404, "Show not found");
    }
  }

  static async getById(request: GetTicketRequest): Promise<TicketResponse> {
    const getRequest = Validation.validate(TicketValidation.GET, request);

    const ticket = await prismaClient.ticket.findFirst({
      where: {
        id: getRequest.id,
      },
      include: {
        contact: true,
        show: true,
      },
    });

    if (!ticket) {
      throw new ResponseError(404, "Ticket not found");
    }

    return toTicketResponse(ticket);
  }

  static async get(): Promise<Ticket[]> {
    return await prismaClient.ticket.findMany({
      include: {
        contact: true,
        show: true,
      },
    });
  }

  static async update(request: UpdateTicketRequest): Promise<TicketResponse> {
    const updateRequest: any = Validation.validate(
      TicketValidation.UPDATE,
      request
    );
    await this.checkShowMustExists(updateRequest.showId);

    const ticket: any = await prismaClient.ticket.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
    });

    return toTicketResponse(ticket);
  }

  static async updateStatus(ticketId: number): Promise<void> {
    // Pertama, update tiket yang di-shuffle dengan status 'got this
        await prismaClient.ticket.update({
            where: { id: ticketId },
            data: { 
                status: 'confirmed'
            }
        });
    
  }

  //   "errors": "EPERM: operation not permitted, unlink 'D:\\Programming\\api-teater\\test'"
  static async remove(request: RemoveTicketRequest): Promise<TicketResponse> {
    const removeRequest = Validation.validate(TicketValidation.REMOVE, request);

    const ticket = await prismaClient.ticket.findUnique({
      where: {
        id: removeRequest.id,
      },
    });

    if (!ticket) {
      throw new ResponseError(404, "Ticket not found");
    }

    if (ticket.photo) {
      deleteOldFile(ticket.photo);
    }

    const response: any = await prismaClient.ticket.delete({
      where: {
        id: ticket.id,
      },
    });

    return toTicketResponse(response);
  }
}




export class ShuffleService {
  static async shuffleTickets(maxShuffleCount: number = 6): Promise<any[]> {
    const tickets = await prismaClient.ticket.findMany({
      where: {
        status: 'confirmed' // Hanya ambil tiket dengan status 'confirmed'
      },
      include: {
        contact: true // Asumsikan 'contact' adalah relasi untuk mendapatkan detail kontak
      }
    });

    // Jika tidak ada tiket dengan status confirmed, return error
    if (tickets.length === 0) {
      throw new Error('Data tidak ditemukan'); // Lempar error jika tiket tidak ditemukan
  }

    const tempTickets = await prismaClient.tmpShuffle.findMany();

    // Filter tiket untuk mengecualikan yang sudah di-shuffle berdasarkan contactId
    let filteredTickets = tickets.filter(ticket => {
      return !tempTickets.some(temp => temp.contactId === ticket.contactId);
    });

    let shuffledTickets = this.fisherYatesShuffle(filteredTickets);

    if (shuffledTickets.length <= maxShuffleCount) {
      // Kosongkan temporary table jika jumlah tiket yang di-shuffle kurang dari maxShuffleCount
      await prismaClient.tmpShuffle.deleteMany();
    }

    // Jika jumlah tiket yang di-shuffle kurang dari maxShuffleCount, tambahkan dari tmpShuffle
    //   if (shuffledTickets.length < maxShuffleCount) {
    //     const additionalTickets : any = tempTickets.slice(0, maxShuffleCount - shuffledTickets.length);
    //     shuffledTickets = shuffledTickets.concat(additionalTickets);
    //     shuffledTickets = this.fisherYatesShuffle(shuffledTickets); // Shuffle ulang dengan tambahan data
    // }

    // Batasi jumlah array yang di-shuffle ke maxShuffleCount elemen
    shuffledTickets = shuffledTickets.slice(0, maxShuffleCount);

    await this.updateTickets(shuffledTickets);

    // // Kosongkan tabel tmpShuffle sebelum menyimpan data baru
    // await prismaClient.tmpShuffle.deleteMany({});

    await this.updateTempTickets(shuffledTickets);

    // Kembalikan tiket yang sudah di-shuffle dengan field yang dibutuhkan
    return shuffledTickets.map(ticket => ({
      name: ticket.contact.fullname, // Asumsi 'contact' memiliki field 'fullname'
      contactId: ticket.contactId,
      ticket: ticket.id, // Asumsi 'contact' memiliki field 'fullname'
      }));
  }

  static fisherYatesShuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  static async updateTickets(shuffledTickets: any[]): Promise<void> {
    // Pertama, update tiket yang di-shuffle dengan status 'got this'
    for (const ticket of shuffledTickets) {
        await prismaClient.ticket.update({
            where: { id: ticket.id },
            data: { 
                status: 'win'
            }
        });
    }

    // Kedua, update tiket yang tidak di-shuffle dengan status 'try again'
    const shuffledTicketIds = shuffledTickets.map(ticket => ticket.id); // Ambil ID dari tiket yang di-shuffle

    await prismaClient.ticket.updateMany({
        where: {
            id: {
                notIn: shuffledTicketIds // Tiket yang ID-nya tidak ada dalam array shuffledTicketIds
            },
            status: 'confirmed' // Hanya update tiket dengan status 'confirmed'
        },
        data: {
            status: 'try again'
        }
    });
}


  static async updateTempTickets(shuffledTickets: any[]): Promise<void> {
    // Setelah menghapus data di tmpShuffle, sekarang kita bisa menambahkan data baru
    for (const ticket of shuffledTickets) {
      await prismaClient.tmpShuffle.create({
        data: {
          isShuffle: true,
          shuffledAt: new Date(),
          contact: {
            connect: {
              id: ticket.contactId
            }
          },
          ticket: {
            connect: {
              id: ticket.id
            }
          }
        }
      });
    }
  }

  static async getShuffle(): Promise<TmpShuffle[]> {
    return await prismaClient.tmpShuffle.findMany({
      // Jika Anda ingin meng-include relasi, uncomment kode di bawah ini
      include: {
        contact: true,
        ticket: true,
      },
    });
  }
}


// export class ShuffleService {
//   static async shuffleTickets(maxShuffleCount: number = 6): Promise<any[]> {
//     const tickets = await prismaClient.ticket.findMany({
//       where: {
//         status: 'confirmed' // Hanya ambil tiket dengan status 'confirmed'
//       },
//       include: {
//         contact: true // Asumsikan 'contact' adalah relasi untuk mendapatkan detail kontak
//       }
//     });

//     // Jika tidak ada tiket dengan status confirmed, return error
//     if (tickets.length === 0) {
//       throw new Error('Data tidak ditemukan'); // Lempar error jika tiket tidak ditemukan
//     }

//     const tempTickets = await prismaClient.tmpShuffle.findMany();

//     // Filter tiket untuk mengecualikan yang sudah di-shuffle berdasarkan contactId
//     let filteredTickets = tickets.filter(ticket => {
//       return !tempTickets.some(temp => temp.contactId === ticket.contactId);
//     });

//     // Shuffle semua tiket, tanpa membatasi maxShuffleCount
//     let shuffledTickets = this.fisherYatesShuffle(filteredTickets);

//     // Langsung ekspor hasil pengacakan semua tiket ke file JSON
//     this.saveShuffledTicketsToFile(shuffledTickets);

//     // Lanjutkan ke proses lainnya (update status, update tmpShuffle)
//     await this.updateTickets(shuffledTickets); // Update status 'win' dan 'try again'
//     await this.updateTempTickets(shuffledTickets); // Update tabel tmpShuffle

//     // Kembalikan tiket yang sudah di-shuffle dengan field yang dibutuhkan
//     return shuffledTickets.map(ticket => ({
//       name: ticket.contact.fullname,
//       contactId: ticket.contactId,
//       ticketId: ticket.id,
//     }));
//   }

//   static fisherYatesShuffle<T>(array: T[]): T[] {
//     let currentIndex = array.length, randomIndex;

//     while (currentIndex !== 0) {
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex--;

//       [array[currentIndex], array[randomIndex]] = [
//         array[randomIndex], array[currentIndex]];
//     }

//     return array;
//   }

//   static async updateTickets(shuffledTickets: any[]): Promise<void> {
//     // Pertama, update tiket yang di-shuffle dengan status 'win'
//     for (const ticket of shuffledTickets) {
//       await prismaClient.ticket.update({
//         where: { id: ticket.id },
//         data: { 
//           status: 'win'
//         }
//       });
//     }

//     // Kedua, update tiket yang tidak di-shuffle dengan status 'try again'
//     const shuffledTicketIds = shuffledTickets.map(ticket => ticket.id);

//     await prismaClient.ticket.updateMany({
//       where: {
//         id: {
//           notIn: shuffledTicketIds
//         },
//         status: 'confirmed'
//       },
//       data: {
//         status: 'try again'
//       }
//     });
//   }

//   static async updateTempTickets(shuffledTickets: any[]): Promise<void> {
//     // Setelah menghapus data di tmpShuffle, sekarang kita bisa menambahkan data baru
//     for (const ticket of shuffledTickets) {
//       await prismaClient.tmpShuffle.create({
//         data: {
//           isShuffle: true,
//           shuffledAt: new Date(),
//           contact: {
//             connect: {
//               id: ticket.contactId
//             }
//           },
//           ticket: {
//             connect: {
//               id: ticket.id
//             }
//           }
//         }
//       });
//     }
//   }

//   // Fungsi untuk langsung mengekspor tiket yang sudah di-shuffle ke JSON
//   static saveShuffledTicketsToFile(shuffledTickets: any[]): void {
//     const filePath = path.join(__dirname, 'shuffledTickets.json'); // Path file JSON
//     const dataToSave = shuffledTickets.map(ticket => ({
//       name: ticket.contact.fullname,
//       contactId: ticket.contactId,
//       ticketId: ticket.id,
//       status: 'shuffled' // Status sementara hanya sebagai indikasi pengacakan
//     }));

//     fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2), (err) => {
//       if (err) {
//         console.error('Error saving shuffled tickets to file:', err);
//       } else {
//         console.log('Shuffled tickets successfully saved to shuffledTickets.json');
//       }
//     });
//   }

//   static async getShuffle(): Promise<TmpShuffle[]> {
//         return await prismaClient.tmpShuffle.findMany({
//           // Jika Anda ingin meng-include relasi, uncomment kode di bawah ini
//           include: {
//             contact: true,
//             ticket: true,
//           },
//         });
//       }
// }