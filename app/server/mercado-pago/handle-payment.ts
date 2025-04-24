import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
    const metadata = paymentData.metadata;
    const userEmail = metadata?.userEmail;
    const testeId = metadata?.testeId;
    console.log("Pagamento aprovado", paymentData);
}
