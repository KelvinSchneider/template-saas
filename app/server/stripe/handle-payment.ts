import Stripe from "stripe";
import { db } from "@/app/lib/firebase";
export async function handleStripePayment(event: Stripe.CheckoutSessionCompletedEvent) {
    const metadata = event.data.object.metadata;

    if(metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {   
        console.log("Pagamento realizado com sucesso");

        const metadata = event.data.object.metadata;

        const userId = metadata?.userId;

        if (!userId) {
            console.error("Usuario nao encontrado");
            return;
        }

        await db.collection("users").doc(userId).update({
            stripeCustomerId: event.data.object.customer,
            stripeSubscriptionId: event.data.object.subscription,
            subscriptionStatus: "active",
        });
    }
}