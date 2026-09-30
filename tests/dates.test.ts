import assert from "node:assert/strict";
import { test } from "node:test";
import { euros, parisLocalToIso } from "../lib/dates.ts";

test("euros formate les centimes", () => {
  const s = euros(8050);
  assert.match(s, /80/);
  assert.match(s, /50/);
});

test("21h30 à Paris n’est pas stocké comme 21h30 UTC", () => {
  const iso = parisLocalToIso("2026-09-30", 21, 30);
  const utcHour = new Date(iso).getUTCHours();
  assert.notEqual(utcHour, 21);
});
