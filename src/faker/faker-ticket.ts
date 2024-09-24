import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function generateAndInsertFakeTickets(count: number) {
  // Ambil semua contact dari database
  const contacts = await prisma.contact.findMany({
    select: { id: true }  // Hanya ambil id dari contact
  });

  if (contacts.length === 0) {
    console.error('No contacts found in the database.');
    return;
  }

  for (let i = 0; i < count; i++) {
    // Pilih contactId secara acak dari database
    const randomContact = contacts[Math.floor(Math.random() * contacts.length)];

    // Buat data tiket palsu
    const ticket = await prisma.ticket.create({
      data: {
        seatNumber: faker.string.alphanumeric(5),// Buat nomor kursi acak
        photo: faker.datatype.boolean() ? faker.image.avatar() : undefined,  // URL gambar acak
        purchaseDate: faker.date.past(),  // Tanggal pembelian acak di masa lalu
        status: faker.helpers.arrayElement(['paid', 'pending', 'cancelled']),  // Status acak
        showId: 1,  // Tetapkan showId menjadi 1
        contactId: randomContact.id  // Tetapkan contactId dari database
      }
    });

    console.log(`Created ticket for contactId: ${randomContact.id}, seatNumber: ${ticket.seatNumber}`);
  }

  console.log(`${count} tickets created successfully!`);
}

// Jalankan skrip untuk membuat dan menyimpan tiket palsu
generateAndInsertFakeTickets(500)
  .then(() => {
    console.log('Ticket generation completed');
  })
  .catch((error) => {
    console.error('Error generating tickets:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

//    npx ts-node src/faker/faker-ticket.ts