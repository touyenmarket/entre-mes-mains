import { Container, Badge, ButtonLink, HaloStrong } from "@/components/ui";

/** Page provisoire en attendant une étape de développement ultérieure. */
export default function ComingSoon({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="relative flex flex-col items-center py-28 text-center sm:py-36">
      <HaloStrong className="left-1/2 top-1/3 h-[420px] w-[640px] -translate-x-1/2" />
      <div className="relative flex flex-col items-center">
        <Badge>En construction</Badge>
        <h1 className="mt-6 max-w-xl font-serif text-4xl font-medium leading-tight text-cream sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-cream/60">
          {children}
        </p>
        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Me contacter
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
