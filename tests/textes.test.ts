import assert from "node:assert/strict";
import { test } from "node:test";
import { t, TEXTES_DEFAUT } from "../lib/textes.ts";

test("catalogue textes non vide", () => {
  assert.ok(TEXTES_DEFAUT.length > 50);
  assert.ok(TEXTES_DEFAUT.every((row) => row.cle && row.page && row.label));
});

test("t() reprend le défaut si champ vide", () => {
  assert.equal(t({}, "accueil.h1"), "Prendre soin de soi, en douceur et en confiance");
  assert.equal(t({ "accueil.h1": "   " }, "accueil.h1"), "Prendre soin de soi, en douceur et en confiance");
});

test("t() privilégie la valeur enregistrée", () => {
  assert.equal(t({ "accueil.h1": "Nouveau titre" }, "accueil.h1"), "Nouveau titre");
});
