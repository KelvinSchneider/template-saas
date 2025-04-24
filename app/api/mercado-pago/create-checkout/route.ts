import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "@/app/lib/mercado-pago";

export async function POST(request: NextRequest) {
    const { testeId, userEmail } = await request.json();

    try {
        const preference = new Preference(mpClient);
        const createPreference = await preference.create({
            body: {
                external_reference: testeId, //isso impacta na pontuacao do MercadoPago
                metadata: {
                    testeId: testeId, //Essa variavel é convertida para snake_case -> teste_id
                    userEmail: userEmail,
                },
                ...(userEmail && {payer: {email: userEmail}}), //Também é importante para a pontuação do MercadoPago
                items: [
                    {
                        id: "",
                        description: "",
                        title: "",
                        quantity: 1,
                        unit_price: 1,
                        currency_id: "BRL",
                        category_id: "services"
                    }
                ],
                payment_methods: {
                    installments: 12,
                    // excluded_payment_methods: [
                    //     {
                    //         id: "bolbradesco"
                    //     },
                    //     {
                    //         id: "pec"
                    //     }
                    // ],
                    // excluded_payment_types: [
                    //     {
                    //         id: "debit_card"
                    //     },
                    //     {
                    //         id: "credit_card"
                    //     }
                    // ],
                    
                },
                auto_return: "approved",
                back_urls: {
                    success: `${request.headers.get("origin")}/api/mercado-pago/pending`,
                    failure: `${request.headers.get("origin")}/api/mercado-pago/pending`,
                    pending: `${request.headers.get("origin")}/api/mercado-pago/pending`
                },
                
            }
        });

        if(!createPreference.id){
            return NextResponse.json({error: "Erro ao criar preferencia"}, {status: 500});
        }

        return NextResponse.json({preferenceId: createPreference.id, initPoint: createPreference.init_point}, {status: 200});


    } catch (error) {
        console.error("Erro ao criar preferencia", error);
        return NextResponse.json({ error: "Erro ao criar preferencia" }, { status: 500 });
    }




}   