import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";
import {Address, Contact, User, Theater, Show, Showtime, Ticket} from "@prisma/client";

export class UserTest {

    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                username: "test"
            }
        })
    }

    static async create() {
        await prismaClient.user.create({
            data: {
                username: "test",
                name: "test",
                password: await bcrypt.hash("test", 10),
                token: "test",
                isAdmin: true
            }
        })
    }

    static async get(): Promise<User> {
        const user = await prismaClient.user.findFirst({
            where: {
                username: "test"
            }
        })

        if (!user) {
            throw new Error("User is not found");
        }

        return user;
    }

}

export class ContactTest {

    static async deleteAll() {
        await prismaClient.contact.deleteMany({
            where: {
                username: "test"
            }
        })
    }

    static async create() {
        await prismaClient.contact.create({
            data: {
                fullname: "test",
                email: "test@example.com",
                phone: "08999999",
                username: "test"
            }
        });
    }

    static async get(): Promise<Contact> {
        const contact = await prismaClient.contact.findFirst({
            where: {
                username: "test"
            }
        });

        if (!contact) {
            throw new Error("Contact is not found");
        }

        return contact;
    }

}

export class AddressTest {

    static async deleteAll() {
        await prismaClient.address.deleteMany({
            where: {
                contact: {
                    username: "test"
                }
            }
        })
    }

    static async create() {
        const contact = await ContactTest.get();
        await prismaClient.address.create({
            data: {
                contactId: contact.id,
                street: "Jalan test",
                city: "Kota test",
                province: "Provinsi test",
                country: "Indonesia",
                postal_code: "11111"
            }
        })
    }

    static async get(): Promise<Address> {
        const address = await prismaClient.address.findFirst({
            where: {
                contact: {
                    username: "test"
                }
            }
        });

        if (!address) {
            throw new Error("Address is not found")
        }

        return address;
    }

}

export class TheaterTest {

    static async deleteAll() {
        await prismaClient.show.deleteMany({
            where: {
                theater: {
                    name: "test"
                }
            }
        });
        
        await prismaClient.theater.deleteMany({
            where: {
                name: "test"
            }
        })
    }

    static async create() {
        // const theater = await TheaterTest.create();y
        await prismaClient.theater.create({
            data: {
                name: "test",
                location: "test",
                capacity: "test"
            }
        })

    }

    static async get(): Promise<Theater[]> {
        const theaters = await prismaClient.theater.findMany();
        if (!theaters.length) {
            throw new Error("No theaters found");
        }
        return theaters;
    }

    static async getById(): Promise<Theater> {
        const theater = await prismaClient.theater.findFirst();

        if (!theater) {
            throw new Error("Theater is not found");
        }
        return theater;
    }
}

export class ShowTest {

    static async deleteAll() {
        await prismaClient.show.deleteMany({
            where: {
                title: "test"
            }
        });
    }

    static async create() {
        const theater = await TheaterTest.getById();
        await prismaClient.show.create({
            data: {
                title: "test",
                description: "test",
                duration: "test",
                rating: "test",
                theaterId: theater.id               
            }
        })
    }

    static async get(): Promise<Show[]> { // Change the return type to Show[]
        const shows = await prismaClient.show.findMany();

        if (!shows.length) {
            throw new Error("Shows not found");
        }

        return shows;
    }

    static async getById(): Promise<Show> {
        const show = await prismaClient.show.findFirst();

        if (!show) {
            throw new Error("Theater is not found");
        }
        return show;
    }

}

export class ShowtimeTest {

    static async deleteAll() {
        await prismaClient.showtime.deleteMany({
            where: {
                showTime: "test" // Assuming you want to delete based on showTime being "test"
            }
        });
    }

    static async create() {
        const show = await ShowTest.getById();
        // const validDatetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await prismaClient.showtime.create({
            data: {
                // showDate: validDatetime,
                showTime: "test", // Assign a string value for showTime
                showId: show.id
            }
        });
    }

    static async get(): Promise<Showtime[]> {
        const showtimes = await prismaClient.showtime.findMany();

        if (!showtimes.length) {
            throw new Error("Shows not found");
        }

        return showtimes;
    }

    static async getById(): Promise<Showtime> {
        const showtime = await prismaClient.showtime.findFirst();

        if (!showtime) {
            throw new Error("Showtime not found");
        }
        return showtime;
    }
}


export class TicketTest {
    static async deleteAll() {
        await prismaClient.ticket.deleteMany({
            where: {
                seatNumber : "test" // Assuming you want to delete based on ticket being "test"
            }
        });
    }

    static async create() {
        const show = await ShowTest.getById();
        const contact = await ContactTest.get();
        // const validDatetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await prismaClient.ticket.create({
            data: {
                seatNumber: "test",
                price: "10000",
                photo: "test",
                showId: show.id,
                contactId: contact.id
            }
        });
    }

    static async get(): Promise<Ticket[]> {
        const tickets = await prismaClient.ticket.findMany();

        if (!tickets.length) {
            throw new Error("Shows not found");
        }

        return tickets;
    }

    static async getById(): Promise<Ticket> {
        const ticket = await prismaClient.ticket.findFirst();

        if (!ticket) {
            throw new Error("ticket not found");
        }
        return ticket;
    }
}