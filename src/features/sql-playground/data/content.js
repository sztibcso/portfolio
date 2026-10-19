// Pure ESM, no imports: also loaded by scripts/verify-sql-playground.mjs in Node.
// Ids referenced in the SQL are documented in seed.js.

/**
 * @typedef {{ id: string, title: string, explanation: string, sql: string }} DesignDecision
 * @typedef {{ id: string, title: string, description: string, sql: string, expectedErrorCode?: string }} Experiment
 */

/** @type {ReadonlyArray<Readonly<DesignDecision>>} */
export const DESIGN_DECISIONS = Object.freeze(
  [
    {
      id: "composite-fk",
      title: "Composite foreign key on venue_id",
      explanation:
        "A ticket stores venue_id and references both (event_id, venue_id) and (seat_id, venue_id). The database itself guarantees that the seat belongs to the venue of the event, so no application code can sell a Budapest seat for a Szeged show.",
      sql: `FOREIGN KEY (event_id, venue_id) REFERENCES event(id, venue_id),
FOREIGN KEY (seat_id,  venue_id) REFERENCES seat(id, venue_id)`,
    },
    {
      id: "no-double-booking",
      title: "UNIQUE (event_id, seat_id)",
      explanation:
        "One seat can be sold only once per event. Because the rule lives in a unique index, two simultaneous checkouts cannot both win: the second insert fails even under a race condition.",
      sql: `UNIQUE (event_id, seat_id)`,
    },
    {
      id: "price-snapshot",
      title: "price_paid snapshot",
      explanation:
        "The ticket copies the price at the moment of purchase instead of reading event.base_price later. This deliberate denormalisation keeps historical revenue and discounts correct when base_price changes.",
      sql: `price_paid NUMERIC(10,2) NOT NULL  -- on ticket
base_price NUMERIC(10,2) NOT NULL  -- on event, may change`,
    },
    {
      id: "junction-table",
      title: "event_performer junction table",
      explanation:
        "An event can have several performers and a performer can play many events. The junction table's composite primary key models the N:M relation and prevents listing the same performer twice for one event.",
      sql: `CREATE TABLE event_performer (
  event_id     INT REFERENCES event(id) ON DELETE CASCADE,
  performer_id INT REFERENCES performer(id) ON DELETE RESTRICT,
  PRIMARY KEY (event_id, performer_id)
);`,
    },
  ].map((decision) => Object.freeze(decision))
);

/** @type {ReadonlyArray<Readonly<Experiment>>} */
export const EXPERIMENTS = Object.freeze(
  [
    {
      id: "break-fk",
      title: "Break a foreign key",
      description: "Schedule an event at a venue that does not exist and watch PostgreSQL refuse it.",
      sql: `-- There is no venue 42, so the foreign key on event.venue_id rejects this row.
INSERT INTO event (venue_id, title, starts_at, base_price)
VALUES (42, 'Ghost Gig', '2027-06-01 20:00:00+02', 1000.00);

-- Then try deleting a performer who is booked (ON DELETE RESTRICT):
-- DELETE FROM performer WHERE name = 'DJ Nova';`,
      expectedErrorCode: "23503",
    },
    {
      id: "double-book",
      title: "Double-book a seat",
      description: "Sell a seat that is already taken for Jazz Night, then pick a free one to make it pass.",
      sql: `-- Seat 12 (Danube Hall, row B, seat 2) is already sold for event 1.
-- Find free seats with:
--   SELECT s.id FROM seat s WHERE s.venue_id = 1 AND NOT EXISTS
--     (SELECT 1 FROM ticket t WHERE t.event_id = 1 AND t.seat_id = s.id);
INSERT INTO ticket (purchase_id, event_id, seat_id, venue_id, price_paid)
VALUES (2, 1, 12, 1, 8900.00);`,
      expectedErrorCode: "23505",
    },
    {
      id: "own-join",
      title: "Write your own JOIN",
      description: "Start from this four-table join and change the event, the columns or the filter.",
      sql: `-- Who sits where at the Stand-up Comedy Club (event 5)?
SELECT c.full_name, s.row_label, s.seat_number, pu.status
FROM ticket t
JOIN purchase pu ON pu.id = t.purchase_id
JOIN customer c  ON c.id = pu.customer_id
JOIN seat s      ON s.id = t.seat_id
WHERE t.event_id = 5
ORDER BY s.row_label, s.seat_number;`,
    },
  ].map((experiment) => Object.freeze(experiment))
);

export const EDITOR_STARTER_SQL = `-- Any PostgreSQL works here. Ctrl+Enter (Cmd+Enter on Mac) runs it.
SELECT e.title, v.city, e.starts_at, e.base_price
FROM event e
JOIN venue v ON v.id = e.venue_id
ORDER BY e.starts_at;`;
