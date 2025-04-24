"use client";

import { useStripe } from "@/app/hooks/useStripe";
import { useMercadoPago } from "@/app/hooks/useMercadoPago";    

export default function Pagamentos() {

    const { createPaymentStripeCheckout, createSubscriptionStripeCheckout, handleCreateStripePortal } = useStripe();
    const { createMercadoPagoCheckout } = useMercadoPago();

    return (
        <div className="flex flex-col items-center justify-center h-screen flex-col gap-5">
            <h1 className="text-2xl font-bold">Pagamentos</h1>
            <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => createSubscriptionStripeCheckout({ testeId: "123" })}>Criar Checkout de Assinatura</button>
            <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => createPaymentStripeCheckout({ testeId: "123" })}>Criar Checkout de Pagamento</button>
            <button className="bg-blue-500 text-white p-2 rounded-md" onClick={handleCreateStripePortal}>Criar Portal</button>
        
            <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => createMercadoPagoCheckout({ testeId: "123", userEmail: "teste@teste.com" })}>Criar Pagamento Mercado Pago</button>
        </div>
    );
}
