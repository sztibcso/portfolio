// Pure ESM, no imports: also loaded by scripts/verify-sql-playground.mjs in Node.
// Ids referenced in the SQL are documented in seed.js.

/**
 * @typedef {Object} GalleryQuery
 * @property {string} id
 * @property {string} title
 * @property {string} concept
 * @property {string} sql
 * @property {string} explanation
 * @property {string} [expectedErrorCode] SQLSTATE the query is designed to fail with.
 */

/** @type {ReadonlyArray<Readonly<GalleryQuery>>} */
export const GALLERY_QUERIES = Object.freeze(
  [
    {
      id: "upcoming-events",
      title: "Upcoming events with their venue",
      concept: "INNER JOIN",
      sql: `SELECT e.title, v.name AS venue, v.city, e.starts_at
FROM event e
JOIN venue v ON v.id = e.venue_id
-- fixed "today" keeps the demo reproducible
WHERE e.starts_at >= TIMESTAMPTZ '2026-12-01 00:00:00+01'
ORDER BY e.starts_at;`,
      explanation:
        "Each event row is matched with exactly one venue through the venue_id foreign key.",
    },
    {
      id: "performers-per-event",
      title: "Line-up of every event",
      concept: "N:M join",
      sql: `SELECT e.title,
       count(p.id) AS performer_count,
       string_agg(p.name, ', ' ORDER BY p.name) AS performers
FROM event e
LEFT JOIN event_performer ep ON ep.event_id = e.id
LEFT JOIN performer p ON p.id = ep.performer_id
GROUP BY e.id, e.title
ORDER BY e.starts_at;`,
      explanation:
        "The event_performer junction table resolves the many-to-many relation; LEFT JOIN keeps events with no performers (NULL line-up).",
    },
    {
      id: "occupancy",
      title: "Occupancy per event",
      concept: "LEFT JOIN + aggregation",
      sql: `SELECT e.title,
       v.name AS venue,
       cap.capacity,
       count(t.id) AS sold,
       round(100.0 * count(t.id) / cap.capacity, 1) AS occupancy_pct
FROM event e
JOIN venue v ON v.id = e.venue_id
JOIN (
  SELECT venue_id, count(*) AS capacity
  FROM seat
  GROUP BY venue_id
) cap ON cap.venue_id = e.venue_id
LEFT JOIN ticket t ON t.event_id = e.id
GROUP BY e.id, e.title, v.name, cap.capacity
ORDER BY occupancy_pct DESC, e.starts_at;`,
      explanation:
        "Capacity is derived from the seat table, and the LEFT JOIN lets unsold events show up with 0 tickets instead of disappearing.",
    },
    {
      id: "unsold-events",
      title: "Events with no tickets sold",
      concept: "Anti-join",
      sql: `SELECT e.id, e.title, e.starts_at
FROM event e
WHERE NOT EXISTS (
  SELECT 1 FROM ticket t WHERE t.event_id = e.id
)
ORDER BY e.starts_at;`,
      explanation:
        "NOT EXISTS returns the events for which no matching ticket row exists.",
    },
    {
      id: "idle-performers",
      title: "Performers who never performed",
      concept: "Orphans via LEFT JOIN",
      sql: `SELECT p.id, p.name
FROM performer p
LEFT JOIN event_performer ep ON ep.performer_id = p.id
WHERE ep.performer_id IS NULL;`,
      explanation:
        "Rows without a partner come back with NULLs on the right side, and the WHERE clause keeps only those.",
    },
    {
      id: "loyal-customers",
      title: "Customers with at least 3 paid tickets",
      concept: "GROUP BY + HAVING",
      sql: `SELECT c.full_name, c.email, count(t.id) AS paid_tickets
FROM customer c
JOIN purchase pu ON pu.customer_id = c.id AND pu.status = 'PAID'
JOIN ticket t ON t.purchase_id = pu.id
GROUP BY c.id
HAVING count(t.id) >= 3
ORDER BY paid_tickets DESC, c.full_name;`,
      explanation:
        "WHERE filters rows before grouping, HAVING filters the groups after the count is known.",
    },
    {
      id: "top-spenders",
      title: "Top spenders",
      concept: "CTE + window function",
      sql: `WITH spend AS (
  SELECT c.id, c.full_name,
         sum(t.price_paid) AS total_spent,
         count(t.id) AS tickets
  FROM customer c
  JOIN purchase pu ON pu.customer_id = c.id
  JOIN ticket t ON t.purchase_id = pu.id
  WHERE pu.status = 'PAID'
  GROUP BY c.id, c.full_name
)
SELECT RANK() OVER (ORDER BY total_spent DESC) AS spend_rank,
       full_name, total_spent, tickets
FROM spend
ORDER BY spend_rank, full_name
LIMIT 5;`,
      explanation:
        "The CTE computes totals per customer, then RANK() orders them without collapsing rows (ties share a rank).",
    },
    {
      id: "venue-revenue-share",
      title: "Revenue share within each venue",
      concept: "Window over partition",
      sql: `SELECT v.name AS venue,
       e.title,
       sum(t.price_paid) AS revenue,
       round(100 * sum(t.price_paid)
             / sum(sum(t.price_paid)) OVER (PARTITION BY e.venue_id), 1) AS venue_share_pct
FROM event e
JOIN venue v ON v.id = e.venue_id
JOIN ticket t ON t.event_id = e.id
JOIN purchase pu ON pu.id = t.purchase_id AND pu.status = 'PAID'
GROUP BY e.id, v.name
ORDER BY v.name, revenue DESC;`,
      explanation:
        "SUM() OVER (PARTITION BY venue) adds up the grouped revenues per venue, so each event can show its share next to its own total.",
    },
    {
      id: "buy-ticket-transaction",
      title: "Buy the first free seat",
      concept: "Transaction",
      sql: `BEGIN;

INSERT INTO purchase (customer_id, status)
VALUES (9, 'PAID')
RETURNING id, customer_id, created_at, status;

INSERT INTO ticket (purchase_id, event_id, seat_id, venue_id, price_paid)
SELECT currval(pg_get_serial_sequence('purchase', 'id')),
       e.id, s.id, e.venue_id, e.base_price
FROM event e
JOIN seat s ON s.venue_id = e.venue_id
WHERE e.id = 3
  AND NOT EXISTS (
    SELECT 1 FROM ticket t WHERE t.event_id = e.id AND t.seat_id = s.id
  )
ORDER BY s.row_label, s.seat_number
LIMIT 1;

COMMIT;

SELECT t.id AS ticket_id, t.purchase_id, s.row_label, s.seat_number, t.price_paid
FROM ticket t
JOIN seat s ON s.id = t.seat_id
WHERE t.purchase_id = currval(pg_get_serial_sequence('purchase', 'id'));`,
      explanation:
        "The purchase and its ticket are committed together or not at all; run it again and it books the next free seat.",
    },
    {
      id: "fk-violation",
      title: "Ticket for a purchase that does not exist",
      concept: "Expected error: FK violation",
      sql: `-- purchase 9999 does not exist
INSERT INTO ticket (purchase_id, event_id, seat_id, venue_id, price_paid)
VALUES (9999, 7, 83, 3, 5500.00);`,
      explanation:
        "The foreign key to purchase rejects the row, so orphan tickets cannot exist.",
      expectedErrorCode: "23503",
    },
    {
      id: "double-booking",
      title: "Selling the same seat twice",
      concept: "Expected error: unique violation",
      sql: `-- seat 1 (Danube Hall, row A, seat 1) is already sold for event 1
INSERT INTO ticket (purchase_id, event_id, seat_id, venue_id, price_paid)
VALUES (1, 1, 1, 1, 8900.00);`,
      explanation:
        "UNIQUE (event_id, seat_id) makes the second booking fail inside the database, even if two requests race.",
      expectedErrorCode: "23505",
    },
    {
      id: "seat-from-other-venue",
      title: "Seat from another venue",
      concept: "Expected error: composite FK",
      sql: `-- event 1 is at venue 1, seat 83 belongs to venue 3
INSERT INTO ticket (purchase_id, event_id, seat_id, venue_id, price_paid)
VALUES (1, 1, 83, 1, 8900.00);`,
      explanation:
        "Both (event_id, venue_id) and (seat_id, venue_id) must exist, so a seat can only be sold for events in its own venue.",
      expectedErrorCode: "23503",
    },
  ].map((query) => Object.freeze(query))
);
