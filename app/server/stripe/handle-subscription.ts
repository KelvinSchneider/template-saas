import { db } from "@/app/lib/firebase";
import Stripe from "stripe";

export async function handleStripeSubscription(event: Stripe.CheckoutSessionCompletedEvent) {
    if (event.data.object.payment_status === "paid") {
        console.log("Pagamento realizado com sucesso. Liberar acesso ao usuario");

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