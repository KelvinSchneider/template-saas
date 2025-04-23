import stripe from "@/app/lib/stripe";
import { handleStripeSubscriptionCancel } from "@/app/server/stripe/handle-cancel";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const headersList = await headers();
        const signature = headersList.get("stripe-signature");

        if (!signature || !secret) {
            return NextResponse.json({ error: "No signature or secret" }, { status: 400 });
        }

        const event = stripe.webhooks.constructEvent(body, signature, secret);

        switch (event.type) {
            case "checkout.session.completed": // pagamento aprovado
                const metadata = event.data.object.metadata;
                if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
                    await handleStripePayment(event);
                }
                if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
                    await handleStripeSubscription(event);
                }
                break;
            case "checkout.session.expired": // pagamento expirado
                console.log("Enviar email para o usuario avisando que o pagamento expirou");
                break;
            case "checkout.session.async_payment_succeeded": // boleto pago
                console.log("Enviar email para o usuario avisando que o boleto foi pago");
                break;
            case "checkout.session.async_payment_failed": // boleto falhou
                console.log("Enviar email para o usuario avisando que o boleto falhou");
                break;
            case "customer.subscription.created": // assinatura criada
                console.log("Enviar email para o usuario avisando que a assinatura foi criada");
                break;
            case "customer.subscription.updated": // assinatura atualizada
                console.log("Enviar email para o usuario avisando que a assinatura foi atualizada");
                break;
            case "customer.subscription.deleted": // assinatura cancelada
                console.log("Enviar email para o usuario avisando que a assinatura foi cancelada");
                await handleStripeSubscriptionCancel(event);
                break;
        }

        return NextResponse.json({ message: "Evento processado com sucesso" }, { status: 200 });
    } catch (error) {
        console.error("Erro ao processar o evento do webhook", error);
        return NextResponse.json({ error: "Erro ao processar o evento do webhook" }, { status: 500 });
    }
}
