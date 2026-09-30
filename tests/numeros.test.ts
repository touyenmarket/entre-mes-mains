import assert from "node:assert/strict";
import { test } from "node:test";

const AFFICHE_RE = /\[\[AFFICHE:([^\]]+)\]\]/;

function extraireNumeroAffiche(details?: string | null) {
  const m = String(details || "").match(AFFICHE_RE);
  return m ? m[1].trim() : null;
}
function detailsSansAffiche(details?: string | null) {
  return String(details || "").replace(AFFICHE_RE, "").replace(/^\n+/, "").trim();
}
function detailsAvecAffiche(details: string, numeroAffiche: string) {
  const corps = detailsSansAffiche(details);
  return `[[AFFICHE:${numeroAffiche}]]${corps ? "\n" + corps : ""}`;
}

test("extrait le N° affiché", () => {
  assert.equal(extraireNumeroAffiche("[[AFFICHE:1]]\nNote"), "1");
  assert.equal(extraireNumeroAffiche("sans prefixe"), null);
});

test("cycle préfixe", () => {
  const s = detailsAvecAffiche("Pharmacie", "7");
  assert.equal(extraireNumeroAffiche(s), "7");
  assert.equal(detailsSansAffiche(s), "Pharmacie");
});
