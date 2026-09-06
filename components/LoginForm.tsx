"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) {
      setStatus("error");
      setMessage(
        "La connexion n’est pas encore configurée (clés Supabase manquantes sur Vercel)."
      );
      return;
    }

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus("error");
      const raw = error.message || "";
      if (/rate|too many/i.test(raw)) {
        setMessage("Trop de tentatives. Réessayez dans quelques minutes.");
      } else if (/invalid api key|jwt|apikey|unauthorized|401/i.test(raw)) {
        setMessage(
          "Clé Supabase refusée. Dans Vercel, utilise les clés « Legacy anon / service_role » (elles commencent par eyJ), puis Redeploy."
        );
      } else if (/redirect|url/i.test(raw)) {
        setMessage(
          "L’URL de redirection n’est pas autorisée. Vérifie Authentication → URL Configuration dans Supabase."
        );
      } else {
        setMessage(raw || "Impossible d’envoyer le lien. Réessayez.");
      }
      return;
    }

    setStatus("sent");
    setMessage(
      "Un lien de connexion vient d’être envoyé. Ouvrez-le depuis cet appareil pour accéder à votre espace."
    );
  }

  if (status === "sent") {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="font-serif text-2xl text-cream">Vérifiez votre boîte mail</p>
        <p className="mt-3 text-[15px] leading-relaxed text-cream/70">
          {message}
        </p>
        <p className="mt-4 text-sm text-cream/45">
          Pensez à regarder les courriers indésirables. Le lien expire au bout
          d’environ une heure.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass-card rounded-2xl p-8">
      <label htmlFor="email" className="block text-sm text-cream/70">
        Votre adresse email
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="vous@email.fr"
        className="mt-2 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-4 py-3 text-cream outline-none placeholder:text-cream/35 focus:border-glow"
      />
      {status === "error" && (
        <p className="mt-3 text-sm text-glow">{message}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 w-full rounded-full bg-bronze px-5 py-3 text-sm font-semibold text-forest-deep transition-colors hover:bg-glow disabled:opacity-60"
      >
        {status === "loading" ? "Envoi en cours…" : "Recevoir le lien de connexion"}
      </button>
      <p className="mt-4 text-center text-xs leading-relaxed text-cream/45">
        Pas de mot de passe. Un email unique vous connecte à votre espace
        (rendez-vous, factures, lien visio).
      </p>
    </form>
  );
}
