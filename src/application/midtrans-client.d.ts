declare module 'midtrans-client' {
    // You can declare the types here as needed, or leave it as any for now.

    interface SnapTransaction {
        token: string;
        redirect_url: string;
    }

    class Snap {
        constructor(config: { isProduction: boolean; serverKey: string; clientKey: string });
        createTransaction(parameter: any): Promise<SnapTransaction>;
        transaction: {
            status(orderId: string): Promise<TransactionStatusResponse>;
        };
    }

    export { Snap };
}
