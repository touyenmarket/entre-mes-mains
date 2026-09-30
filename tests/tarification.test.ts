import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ZONE_FRANCHE_KM,
  TARIF_KM_EUR,
  supplementKm,
  kmFactures,
  totalAvecKm,
} from "../lib/tarification";

test("zone franche = 15 km", () => {
  assert.equal(ZONE_FRANCHE_KM, 15);
  assert.equal(TARIF_KM_EUR, 0.55);
});

test("pas de supplément dans la zone franche", () => {
  assert.equal(supplementKm(0), 0);
  assert.equal(supplementKm(15), 0);
  assert.equal(kmFactures(10), 0);
});

test("30 km → 8,25 €", () => {
  assert.equal(supplementKm(30), 8.25);
  assert.equal(kmFactures(30), 15);
});

test("total = base + km", () => {
  assert.equal(totalAvecKm(80, 30), 88.25);
  assert.equal(totalAvecKm(60, 5), 60);
});
