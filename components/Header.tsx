"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { OFFER_LINKS, TOOL_LINKS } from "@/lib/config";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const offerClass = (href: string) =>
    cn(
      "font-serif text-[17px] font-semibold tracking-wide transition-colors",
      pathname === href
        ? "text-glow"
        : "text-cream hover:text-glow",
    );

  const toolClass = (href: string) =>
    cn(
      "text-[12px] uppercase tracking-[0.14em] transition-colors",
      pathname === href ? "text-cream/80" : "text-cream/45 hover:text-cream/75",
    );

  return (
    <header className="sticky top-0 z-50 border-b border-bronze/15 bg-forest-deep/85 backdrop-blur-md">
      <div className="mx-auto flex h-[88px] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="relative flex items-center pl-6"
        >
          <span className="pointer-events-none absolute left-0 top-2 h-[72px] w-[72px]" aria-hidden>
            <svg viewBox="0 0 72 72" className="h-full w-full overflow-visible">
              <path d="M28 8l1.6 4.8H35l-4.2 3 1.6 4.8L28 17.6 23.6 20.6l1.6-4.8L21 12.8h5.4z" fill="#e8c4a0"/>
              <path d="M8 30l2.4 7.2H18l-6.2 4.6 2.4 7.2L8 44.6 1.8 49.2l2.4-7.2L-2 37.2h7.6z" fill="#a39171" transform="translate(8 0)"/>
              <path d="M26 42l1.5 4.4H33l-4 3 1.5 4.4L26 51.2 22 54.2l1.5-4.4-4-3h5.5z" fill="#c2b298"/>
            </svg>
          </span>
          <Image
            src="/images/logo.png"
            alt="Entre mes mains"
            width={160}
            height={100}
            priority
            className="relative z-10 h-[84px] w-auto drop-shadow-[0_4px_14px_rgba(232,213,163,0.55)]"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6">
            {OFFER_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={offerClass(l.href)}>
                {l.label}
              </Link>
            ))}
          </div>
          <span className="h-6 w-px bg-bronze/25" aria-hidden />
          <div className="flex items-center gap-5">
            {TOOL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={toolClass(l.href)}>
                {l.label}
              </Link>
            ))}
          </div>
          <Link
            href="/reserver"
            className="rounded-full bg-bronze px-5 py-2 text-sm font-semibold text-forest-deep transition-colors hover:bg-glow"
          >
            Réserver
          </Link>
          <span
            title="Prestations accessibles aux personnes sourdes et malentendantes"
            aria-label="Accessible aux personnes sourdes et malentendantes"
            className="inline-flex items-center rounded-full border border-sage/40 p-2 text-sage-light"
          >
            <Image
              src="/images/signante.png"
              alt="Accessible aux personnes sourdes et malentendantes"
              width={32}
              height={34}
              className="h-[34px] w-auto drop-shadow-[0_2px_6px_rgba(232,213,163,0.4)]"
            />
          </span>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <span
            title="Prestations accessibles aux personnes sourdes et malentendantes"
            aria-label="Accessible aux personnes sourdes et malentendantes"
            className="inline-flex items-center rounded-full border border-sage/40 p-1.5 text-sage-light"
          >
            <Image
              src="/images/signante.png"
              alt="Accessible aux personnes sourdes et malentendantes"
              width={28}
              height={30}
              className="h-[30px] w-auto drop-shadow-[0_2px_6px_rgba(232,213,163,0.4)]"
            />
          </span>
          <button
            className="text-cream"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-bronze/15 bg-forest-deep/95 px-5 pb-6 pt-3 md:hidden">
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-bronze">
            Les offres
          </p>
          <div className="flex flex-col gap-3">
            {OFFER_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={offerClass(l.href)}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="mb-2 mt-5 text-[10px] uppercase tracking-[0.2em] text-bronze/70">
            Espace
          </p>
          <div className="flex flex-col gap-3">
            {TOOL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={toolClass(l.href)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/reserver"
              onClick={() => setOpen(false)}
              className="rounded-full bg-bronze px-5 py-2.5 text-center text-sm font-semibold text-forest-deep"
            >
              Réserver
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
