// src/utils/midtransClient.ts


import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
    isProduction: false, // Set to true for production
    serverKey: process.env.MIDTRANS_SERVER_KEY || 'your-server-key',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || 'your-client-key',
});

export default snap;
