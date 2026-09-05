import type { NextConfig } from "next";

/**
 * En temps normal (dev + production Vercel), configuration standard.
 *
 * EXPORT=1 npm run build → génère une version 100% statique du site
 * dans le dossier `out/`, utilisable sur n'importe quel hébergeur
 * statique (Netlify Drop, etc.) pour partager l'avancement.
 *
 * allowedDevOrigins : autorise l'hôte de l'aperçu en direct
 * (l'URL change à chaque session de travail).
 */
const isExport = process.env.EXPORT === "1";

const PREVIEW_ORIGIN = process.env.PREVIEW_ORIGIN;

const nextConfig: NextConfig = {
  images: {
    unoptimized: isExport,
  },
  ...(isExport ? { output: "export" as const } : {}),
  ...(PREVIEW_ORIGIN
    ? { allowedDevOrigins: PREVIEW_ORIGIN.split(",").filter(Boolean) }
    : {}),
};

export default nextConfig;
