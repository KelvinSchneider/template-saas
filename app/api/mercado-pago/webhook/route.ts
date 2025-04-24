import { NextRequest, NextResponse } from "next/server";
import mpClient, { validadeMercadoPagoWebhook } from "@/app/lib/mercado-pago";
import { Payment } from "mercadopago";
import { handleMercadoPagoPayment } from "@/app/server/mercado-pago/handle-payment";
export async function POST(request: NextRequest) {

    try {
        validadeMercadoPagoWebhook(request);

        const body = await request.json();
        const { type, data } = body;

        //webhook aqui

        switch(type){
            case "payment":
               const payment = new Payment(mpClient);
               const paymentData = await payment.get({ id: data.id });
               if(paymentData.status === "approved" || paymentData.date_approved !== null){
                await handleMercadoPagoPayment(paymentData);
                console.log("Pagamento aprovado", paymentData);
               }
               break;
            case "subscription.preapproval":
                console.log("Pré-pagamento criado", data);
                break;
            default:
                console.log("Evento não tratado", type);
                break;
                
        }
        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Erro ao processar webhook", error);
        return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 500 });
    }

}