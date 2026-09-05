"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { SITE } from "@/lib/config";

/**
 * Formulaire de contact — provisoire.
 * Tant que le back-office n'est pas branché, le message s'ouvre
 * dans l'application de messagerie du visiteur (mailto).
 */
export default function ContactForm() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sujet = encodeURIComponent(`Message depuis ${SITE.name} — ${nom}`);
  const corps = encodeURIComponent(`Nom : ${nom}\nEmail : ${email}\n\n${message}`);
  const href = `mailto:${SITE.email}?subject=${sujet}&body=${corps}`;

  const inputClass =
    "w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:border-glow focus:outline-none";

  return (
    <form className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Votre nom"
          className={inputClass}
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          className={inputClass}
        />
      </div>
      <textarea
        required
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Votre message… (motif, questions, disponibilités)"
        className={inputClass}
      />
      <a
        href={href}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-bronze px-6 py-3 text-sm font-semibold text-forest-deep transition-colors hover:bg-glow"
      >
        <Send size={15} /> Envoyer le message
      </a>
      <p className="text-[11px] leading-relaxed text-cream/40">
        Votre message s&apos;ouvrira dans votre application de messagerie. Le
        formulaire sera bientôt envoyé directement — sans quitter le site.
      </p>
    </form>
  );
}
