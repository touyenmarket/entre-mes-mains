import { Suspense } from "react";
import { Container, Badge, HaloStrong } from "@/components/ui";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Connexion" };

function ErreurLien({ searchParams }: { searchParams: { erreur?: string } }) {
  if (searchParams.erreur !== "lien") return null;
  return (
    <p className="mb-4 rounded-xl border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-glow">
      Ce lien n’est plus valable. Demandez-en un nouveau ci-dessous.
    </p>
  );
}

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const params = await searchParams;

  return (
    <Container className="relative flex max-w-lg flex-col py-20 sm:py-28">
      <HaloStrong className="left-1/2 top-0 h-[360px] w-[520px] -translate-x-1/2" />
      <div className="relative">
        <Badge>Espace patient</Badge>
        <h1 className="mt-6 font-serif text-4xl font-medium leading-tight text-cream">
          Se connecter
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-cream/65">
          Indiquez votre email : vous recevez un lien unique. Aucun mot de passe
          à retenir.
        </p>
        <div className="mt-8">
          <ErreurLien searchParams={params} />
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
