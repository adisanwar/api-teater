import {prismaClient} from "../src/application/database";
import bcrypt from "bcrypt";
import {Address, Contact, User} from "@prisma/client";

export class UserTest {

    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                username: "adi"
            }
        })
    }

    static async create() {
        await prismaClient.user.create({
            data: {
                username: "adi",
                name: "adi",
                password: await bcrypt.hash("adi", 10),
                token: "adi"
            }
        })
    }

    static async get(): Promise<User> {
        const user = await prismaClient.user.findFirst({
            where: {
                username: "adi"
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
                username: "adi"
            }
        })
    }

    static async create() {
        await prismaClient.contact.create({
            data: {
                first_name: "adi",
                last_name: "adi",
                email: "adi@example.com",
                phone: "08999999",
                username: "adi"
            }
        });
    }

    static async get(): Promise<Contact> {
        const contact = await prismaClient.contact.findFirst({
            where: {
                username: "adi"
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
                    username: "adi"
                }
            }
        })
    }

    static async create() {
        const contact = await ContactTest.get();
        await prismaClient.address.create({
            data: {
                contact_id: contact.id,
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
                    username: "adi"
                }
            }
        });

        if (!address) {
            throw new Error("Address is not found")
        }

        return address;
    }

}
