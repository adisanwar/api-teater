import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// A set to track unique emails, usernames, and national IDs
const usedUsernames = new Set<string>();
const usedEmails = new Set<string>();
const usedNationalIds = new Set<number>();

// Generate and insert fake users
async function generateAndInsertFakeUsers(count: number) {
    for (let i = 0; i < count; i++) {
        let username, email, nationalId;

        // Ensure username is unique
        do {
            username = faker.internet.userName();
        } while (usedUsernames.has(username));
        usedUsernames.add(username);

        // Ensure email is unique
        do {
            email = faker.internet.email();
        } while (usedEmails.has(email));
        usedEmails.add(email);

        // Ensure nationalId is unique
        do {
            nationalId = faker.number.int({ min: 100000, max: 999999 });
        } while (usedNationalIds.has(nationalId));
        usedNationalIds.add(nationalId);

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash('test123', 10);  // Password 'test123' will be hashed

        // Create user with hashed password and unique data
        const user = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,  // Use hashed password
                name: faker.name.fullName(),
                token: faker.datatype.boolean() ? faker.string.uuid() : null,
                isAdmin: faker.datatype.boolean(),
                contacts: {
                    create: generateFakeContacts(faker.number.int({ min: 1, max: 5 })) // Adjusted
                }
            }
        });

        console.log(`Created user: ${user.username}`);
    }

    console.log(`${count} users created!`);
}

// Generate fake contacts for each user
function generateFakeContacts(count: number) {
    const contacts = [];
    for (let i = 0; i < count; i++) {
        let email, nationalId;

        // Ensure email is unique within contacts
        do {
            email = faker.internet.email();
        } while (usedEmails.has(email));
        usedEmails.add(email);

        // Ensure nationalId is unique within contacts
        do {
            nationalId = faker.number.int({ min: 100000, max: 999999 });
        } while (usedNationalIds.has(nationalId));
        usedNationalIds.add(nationalId);

        contacts.push({
            fullname: faker.name.fullName(),
            photo: faker.datatype.boolean() ? faker.image.avatar() : undefined,
            email: email,
            phone: faker.phone.number().slice(0, 20),
            gender: faker.datatype.boolean() ? 'Male' : 'Female',
            amount: faker.number.int({ min: 100, max: 1000 }),
            dateofbirth: faker.date.past({ years: 30 }),
            ofcNo: faker.datatype.boolean() ? faker.phone.number().slice(0, 20) : undefined,
            nationalId: nationalId,
            // addresses: {
            //     create: generateFakeAddresses(faker.number.int({ min: 1, max: 3 })) // Adjusted
            // }
        });
    }

    return contacts;
}

// Generate fake addresses for each contact
// function generateFakeAddresses(count: number) {
//     const addresses = [];
//     for (let i = 0; i < count; i++) {
//         addresses.push({
//             street: faker.address.streetAddress(),
//             city: faker.address.city(),
//             province: faker.address.state(),
//             country: faker.address.country(),
//             postal_code: faker.address.zipCode()
//         });
//     }

//     return addresses;
// }

// Run the script
generateAndInsertFakeUsers(500)
    .then(() => {
        console.log('Data insertion completed');
    })
    .catch((error) => {
        console.error('Error inserting data:', error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


    //   npx ts-node src/faker/faker-user.ts