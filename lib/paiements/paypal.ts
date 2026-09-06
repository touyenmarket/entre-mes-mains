import { getSiteUrl } from "@/lib/site-url";

function paypalConfigured() {
  return Boolean(
    process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET
  );
}

export function isPaypalEnabled() {
  return (
    process.env.NEXT_PUBLIC_PAYMENT_MODE === "paypal" && paypalConfigured()
  );
}

function apiBase() {
  return (
    process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com"
  ).replace(/\/$/, "");
}

async function accessToken() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("Clés PayPal manquantes.");

  const res = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = (await res.json()) as { access_token?: string; error?: string };
  if (!res.ok || !data.access_token) {
    throw new Error(data.error || "Auth PayPal impossible.");
  }
  return data.access_token;
}

export async function creerCommandePaypal(opts: {
  numero: string;
  totalCents: number;
  label: string;
}) {
  const token = await accessToken();
  const origin = getSiteUrl();
  const amount = (opts.totalCents / 100).toFixed(2);

  const res = await fetch(`${apiBase()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: opts.numero,
          description: opts.label.slice(0, 127),
          custom_id: opts.numero,
          amount: { currency_code: "EUR", value: amount },
        },
      ],
      application_context: {
        brand_name: "Entre mes mains",
        locale: "fr-FR",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${origin}/reserver/paiement/retour?numero=${encodeURIComponent(opts.numero)}`,
        cancel_url: `${origin}/reserver/confirmation/${encodeURIComponent(opts.numero)}?annule=1`,
      },
    }),
  });

  const data = (await res.json()) as {
    id?: string;
    links?: { rel: string; href: string }[];
    message?: string;
  };
  if (!res.ok || !data.id) {
    throw new Error(data.message || "Création de la commande PayPal impossible.");
  }
  const approve = data.links?.find((l) => l.rel === "approve")?.href;
  if (!approve) throw new Error("Lien d’approbation PayPal introuvable.");
  return { id: data.id, approveUrl: approve };
}

export async function capturerCommandePaypal(orderId: string) {
  const token = await accessToken();
  const res = await fetch(`${apiBase()}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = (await res.json()) as {
    id?: string;
    status?: string;
    message?: string;
  };
  if (!res.ok) {
    throw new Error(data.message || "Capture PayPal impossible.");
  }
  return data;
}
