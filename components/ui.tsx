import Link from "next/link";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Mise en page ---------- */

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/* ---------- Éléments décoratifs ---------- */

/** Halo doré d'arrière-plan (rétroéclairage). */
export function Halo({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("halo pointer-events-none absolute", className)}
    />
  );
}

export function HaloStrong({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("halo-strong pointer-events-none absolute", className)}
    />
  );
}

/** Séparateur ornemental feuille. */
export function LeafDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 text-bronze/70",
        className,
      )}
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-bronze/40" />
      <Leaf size={16} />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-bronze/40" />
    </div>
  );
}

/* ---------- Typographie ---------- */

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-bronze/40 bg-bronze/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-glow",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center", className)}>
      {eyebrow && <Badge>{eyebrow}</Badge>}
      <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-cream sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[15px] leading-relaxed text-cream/65">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ---------- Surfaces ---------- */

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("glass-card rounded-2xl p-6 sm:p-7", className)}>
      {children}
    </div>
  );
}

/* ---------- Actions ---------- */

type ButtonVariant = "primary" | "ghost" | "light";

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-bronze text-forest-deep hover:bg-glow",
    ghost: "border border-cream/25 text-cream hover:border-glow hover:text-glow",
    light: "bg-champagne text-forest-deep hover:bg-glow-light",
  };
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

/* ---------- Prix ---------- */

export function Price({ amount, prefix }: { amount: number; prefix?: string }) {
  return (
    <span className="font-serif text-2xl font-medium text-glow">
      {prefix && <span className="mr-1 text-sm text-cream/50">{prefix}</span>}
      {amount}&nbsp;€
    </span>
  );
}
