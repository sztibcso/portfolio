// Verifies the SQL playground data against a real PGlite instance.
// Runs with Node's built-in test runner: npm run test:sql
import { test } from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { SCHEMA_SQL } from "../src/features/sql-playground/data/schema.js";
import { SEED_SQL } from "../src/features/sql-playground/data/seed.js";
import { GALLERY_QUERIES } from "../src/features/sql-playground/data/queries.js";
import { EDITOR_STARTER_SQL, EXPERIMENTS } from "../src/features/sql-playground/data/content.js";

async function seededDb() {
  const db = await PGlite.create();
  await db.exec(SCHEMA_SQL);
  await db.exec(SEED_SQL);
  return db;
}

/** @param {PGlite} db @param {string} sql */
async function rows(db, sql) {
  return (await db.query(sql)).rows;
}

test("gallery has 12 queries with unique ids", () => {
  assert.equal(GALLERY_QUERIES.length, 12);
  assert.equal(new Set(GALLERY_QUERIES.map((q) => q.id)).size, 12);
});

const RUNNABLE = [
  ...GALLERY_QUERIES.map((q) => ({ ...q, title: `gallery: ${q.title}` })),
  ...EXPERIMENTS.map((e) => ({ ...e, title: `experiment: ${e.title}` })),
  { title: "editor starter SQL", sql: EDITOR_STARTER_SQL },
];

for (const query of RUNNABLE) {
  test(query.title, async () => {
    const db = await seededDb();
    try {
      if (query.expectedErrorCode) {
        await assert.rejects(db.exec(query.sql), (err) => {
          assert.equal(err.code, query.expectedErrorCode);
          return true;
        });
      } else {
        const results = await db.exec(query.sql);
        assert.ok(results.some((r) => r.fields.length > 0), "returns a result set");
      }
    } finally {
      await db.close();
    }
  });
}

test("seed invariants", async () => {
  const db = await seededDb();
  try {
    const capacity = await rows(
      db,
      "SELECT venue_id, count(*)::int AS n FROM seat GROUP BY venue_id ORDER BY venue_id"
    );
    assert.deepEqual(capacity.map((r) => r.n), [50, 32, 18]);

    const [demoSeats] = await rows(
      db,
      `SELECT
         (SELECT venue_id || row_label || seat_number FROM seat WHERE id = 1)  AS seat1,
         (SELECT venue_id || row_label || seat_number FROM seat WHERE id = 83) AS seat83`
    );
    assert.deepEqual(demoSeats, { seat1: "1A1", seat83: "3A1" });

    const [{ tickets }] = await rows(db, "SELECT count(*)::int AS tickets FROM ticket");
    assert.ok(tickets >= 55 && tickets <= 65, `about 60 tickets, got ${tickets}`);

    const unsold = await rows(
      db,
      "SELECT e.id FROM event e WHERE NOT EXISTS (SELECT 1 FROM ticket t WHERE t.event_id = e.id)"
    );
    assert.deepEqual(unsold.map((r) => r.id), [7]);

    const [{ max_pct }] = await rows(
      db,
      `SELECT max(100.0 * sold / cap)::float AS max_pct FROM (
         SELECT e.id,
                (SELECT count(*) FROM ticket t WHERE t.event_id = e.id) AS sold,
                (SELECT count(*) FROM seat s WHERE s.venue_id = e.venue_id) AS cap
         FROM event e) x`
    );
    assert.ok(max_pct > 80, `one event above 80 %, got ${max_pct}`);

    const idle = await rows(
      db,
      "SELECT p.id FROM performer p WHERE NOT EXISTS (SELECT 1 FROM event_performer ep WHERE ep.performer_id = p.id)"
    );
    assert.deepEqual(idle.map((r) => r.id), [8]);

    const [{ biggest_lineup }] = await rows(
      db,
      "SELECT max(n)::int AS biggest_lineup FROM (SELECT count(*) AS n FROM event_performer GROUP BY event_id) x"
    );
    assert.equal(biggest_lineup, 3);

    const noPurchases = await rows(
      db,
      "SELECT c.id FROM customer c WHERE NOT EXISTS (SELECT 1 FROM purchase p WHERE p.customer_id = c.id) ORDER BY c.id"
    );
    assert.deepEqual(noPurchases.map((r) => r.id), [11, 12]);

    const statuses = await rows(db, "SELECT DISTINCT status FROM purchase ORDER BY status");
    assert.deepEqual(statuses.map((r) => r.status), ["CANCELLED", "PAID", "PENDING"]);

    const [{ discounted }] = await rows(
      db,
      "SELECT count(*)::int AS discounted FROM ticket t JOIN event e ON e.id = t.event_id WHERE t.price_paid <> e.base_price"
    );
    assert.ok(discounted > 0, "some tickets were sold below base_price");
  } finally {
    await db.close();
  }
});
