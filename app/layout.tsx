import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TawkWidget from "@/components/TawkWidget";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Entre mes mains — Naturopathie & massage bien-être",
    template: "%s — Entre mes mains",
  },
  description:
    "Consultations de naturopathie en visio, massages bien-être à domicile et atelier de langue des signes pour bébé. Réservation en ligne, paiement sécurisé, lien visio automatique.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body className="antialiased">
        <Header />
        <main className="min-h-[65vh]">{children}</main>
        <Footer />
        <TawkWidget />
      </body>
    </html>
  );
}
