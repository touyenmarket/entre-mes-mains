"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/config";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const linkClass = (href: string) =>
    cn(
      "text-sm transition-colors",
      pathname === href ? "text-glow" : "text-cream/70 hover:text-cream",
    );

  return (
    <header className="sticky top-0 z-50 border-b border-bronze/15 bg-forest-deep/85 backdrop-blur-md">
      <div className="mx-auto flex h-[88px] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center"
        >
          <Image
            src="/images/logo.png"
            alt="Entre mes mains"
            width={160}
            height={100}
            priority
            className="h-[84px] w-auto drop-shadow-[0_4px_14px_rgba(232,213,163,0.55)]"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
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
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={linkClass(l.href)}
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
