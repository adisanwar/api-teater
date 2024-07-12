import {Payment} from "@prisma/client";

export type PaymentResponse = {
    id: number;
    amount: string;
    paymentDate?: Date | null;
    metodePayment?: string | null;
    status?: string | null;
}

export type CreatePaymentRequest = {
    amount: string;
    paymentDate?: Date;
    metodePayment?: string;
    status?: string;
}

export type UpdatePaymentRequest = {
    id: number;
    amount: string;
    paymentDate?: Date;
    metodePayment?: string;
    status?: string;
}

// export type SearchPaymentRequest = {
//     name?: string;
//     phone?: string;
//     email?: string;
//     page: number;
//     size: number;
// }

export function toPaymentResponse(payment: Payment): PaymentResponse {
    return {
        id: payment.id,
        amount: payment.amount,
    paymentDate: payment.paymentDate,
    metodePayment: payment.metodePayment,
    status: payment.status
    }
}
