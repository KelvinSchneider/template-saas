import { MercadoPagoConfig } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export default mpClient;

export function validadeMercadoPagoWebhook(request: NextRequest) {
    const xSignature = request.headers.get("x-signature");
    const xRequestId = request.headers.get("x-request-id");
    if (!xSignature || !xRequestId) {
        return NextResponse.json({ error: "Headers inválidos" }, { status: 400 });
    }

    const signatureParts = xSignature.split(",");
    let ts = "";
    let v1 = "";
    signatureParts.forEach(part => {
        const [key, value] = part.split("=");
        if (key === "ts") ts = value.trim();
        if (key === "v1") v1 = value.trim();
    });

    if (!ts || !v1) {
        return NextResponse.json({ error: "Invalid x-signature header format" }, { status: 400 });
    }

    const url = new URL(request.url);
    const dataId = url.searchParams.get("data_id");

    let manifest = "";
    if (dataId) {
        manifest += `id:${dataId}`;
    }
    if (xRequestId) {
        manifest += `request-id:${xRequestId}`;
    }
    manifest += `ts:${ts}`;

    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET!;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(manifest);
    const computedSignature = hmac.digest("hex");

    if (computedSignature !== v1) {
        return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
    }

}
