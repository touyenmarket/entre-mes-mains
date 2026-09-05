/** Petit utilitaire de classes — équivalent léger de clsx. */
export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}
