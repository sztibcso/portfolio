// Pure ESM, no imports: also loaded by scripts/verify-sql-playground.mjs in Node.
//
// Deterministic seed: fixed timestamps, no random(), fixed insert order so the
// SERIAL ids below are stable. Ids the gallery and its error demos rely on:
//   venue 1 Danube Hall (Budapest)          seats  1-50  (rows A-E x 10)
//   venue 2 Great Forest Stage (Debrecen)   seats 51-82  (rows A-D x 8)
//   venue 3 Tisza Riverside Club (Szeged)   seats 83-100 (rows A-C x 6)
//   seat 1  = venue 1, row A, seat 1 -> already sold for event 1 (double-booking demo)
//   seat 83 = venue 3, row A, seat 1 -> wrong venue for event 1 (composite FK demo)
//   event 3 = first free seat is venue 2 A5 (transaction demo)
//   event 5 = 16 of 18 seats sold (88.9 % occupancy)
//   event 7 = zero tickets sold, no performers
//   event 6 = three performers
//   performer 8 = no events
//   customers 11 and 12 = no purchases
//   purchase 1 exists, purchase 9999 does not (FK violation demo)

export const SEED_SQL = `INSERT INTO venue (name, city) VALUES
  ('Danube Hall',          'Budapest'),
  ('Great Forest Stage',   'Debrecen'),
  ('Tisza Riverside Club', 'Szeged');

INSERT INTO seat (venue_id, row_label, seat_number)
SELECT v.venue_id, chr(64 + r.row_no), n.seat_number
FROM (VALUES (1, 5, 10), (2, 4, 8), (3, 3, 6)) AS v(venue_id, row_count, seats_per_row)
CROSS JOIN LATERAL generate_series(1, v.row_count) AS r(row_no)
CROSS JOIN LATERAL generate_series(1, v.seats_per_row) AS n(seat_number)
ORDER BY v.venue_id, r.row_no, n.seat_number;

INSERT INTO event (venue_id, title, starts_at, base_price) VALUES
  (1, 'Jazz Night',              '2026-11-14 20:00:00+01',  8900.00),
  (1, 'Rock Classics Live',      '2026-12-05 19:30:00+01', 12500.00),
  (2, 'Folk Fusion Evening',     '2027-01-16 19:00:00+01',  6500.00),
  (2, 'Electronic Sunrise',      '2027-02-20 22:00:00+01',  9900.00),
  (3, 'Stand-up Comedy Club',    '2027-03-06 20:00:00+01',  4500.00),
  (1, 'Symphonic Movie Scores',  '2027-04-10 19:00:00+02', 14900.00),
  (3, 'Acoustic Sessions',       '2027-05-22 20:00:00+02',  5500.00);

INSERT INTO performer (name) VALUES
  ('Budapest Jazz Trio'),
  ('The Iron Strings'),
  ('Hortobágy Folk Ensemble'),
  ('DJ Nova'),
  ('Laugh Lab Collective'),
  ('Danube Symphonic Orchestra'),
  ('Echo Valley'),
  ('Midnight Brass');

INSERT INTO event_performer (event_id, performer_id) VALUES
  (1, 1),
  (2, 2), (2, 7),
  (3, 3), (3, 7),
  (4, 4),
  (5, 5),
  (6, 6), (6, 1), (6, 2);

INSERT INTO customer (email, full_name) VALUES
  ('anna.kiss@example.com',       'Anna Kiss'),
  ('bence.toth@example.com',      'Bence Tóth'),
  ('csilla.varga@example.com',    'Csilla Varga'),
  ('daniel.horvath@example.com',  'Dániel Horváth'),
  ('eszter.nagy@example.com',     'Eszter Nagy'),
  ('ferenc.balogh@example.com',   'Ferenc Balogh'),
  ('greta.farkas@example.com',    'Gréta Farkas'),
  ('hunor.szilagyi@example.com',  'Hunor Szilágyi'),
  ('ildiko.papp@example.com',     'Ildikó Papp'),
  ('janos.lakatos@example.com',   'János Lakatos'),
  ('kinga.fekete@example.com',    'Kinga Fekete'),
  ('levente.simon@example.com',   'Levente Simon');

INSERT INTO purchase (customer_id, created_at, status) VALUES
  ( 1, '2026-09-01 10:00:00+02', 'PAID'),
  ( 2, '2026-09-02 11:15:00+02', 'PAID'),
  ( 3, '2026-09-03 09:30:00+02', 'PAID'),
  ( 4, '2026-09-05 18:45:00+02', 'PENDING'),
  ( 5, '2026-09-06 14:00:00+02', 'PAID'),
  ( 6, '2026-09-07 16:20:00+02', 'CANCELLED'),
  ( 1, '2026-09-08 08:05:00+02', 'PAID'),
  ( 7, '2026-09-10 12:40:00+02', 'PAID'),
  ( 8, '2026-09-11 19:10:00+02', 'PAID'),
  ( 9, '2026-09-12 21:00:00+02', 'PENDING'),
  (10, '2026-09-14 10:30:00+02', 'PAID'),
  ( 2, '2026-09-15 13:25:00+02', 'PAID'),
  ( 3, '2026-09-16 15:50:00+02', 'CANCELLED'),
  ( 4, '2026-09-18 17:35:00+02', 'PAID'),
  ( 5, '2026-09-20 09:00:00+02', 'PAID'),
  ( 6, '2026-09-21 20:15:00+02', 'PAID'),
  ( 7, '2026-09-22 11:45:00+02', 'PAID'),
  ( 8, '2026-09-24 16:05:00+02', 'PENDING'),
  ( 1, '2026-09-25 18:30:00+02', 'PAID');

-- One row per block of adjacent seats; price_paid below base_price = discount.
INSERT INTO ticket (purchase_id, event_id, seat_id, venue_id, price_paid)
SELECT b.purchase_id, e.id, s.id, e.venue_id, b.price_paid
FROM (VALUES
  ( 1, 1, 'A', 1, 2,  8900.00),
  ( 1, 5, 'A', 1, 1,  4500.00),
  ( 2, 1, 'A', 3, 5,  7900.00),
  ( 3, 2, 'B', 1, 4, 12500.00),
  ( 4, 2, 'B', 5, 6, 12500.00),
  ( 5, 3, 'A', 1, 4,  6500.00),
  ( 6, 4, 'A', 1, 2,  9900.00),
  ( 7, 2, 'C', 1, 2, 11250.00),
  ( 8, 5, 'A', 2, 6,  4500.00),
  ( 9, 5, 'B', 1, 6,  4000.00),
  (10, 5, 'C', 1, 4,  4500.00),
  (11, 1, 'B', 1, 5,  8900.00),
  (12, 2, 'D', 1, 3, 12500.00),
  (13, 1, 'C', 1, 3,  8900.00),
  (14, 3, 'B', 1, 4,  5850.00),
  (15, 4, 'B', 1, 2,  9900.00),
  (16, 2, 'E', 1, 2, 12500.00),
  (17, 6, 'A', 1, 3, 14900.00),
  (18, 6, 'A', 4, 5, 14900.00),
  (19, 6, 'A', 6, 6, 13410.00)
) AS b(purchase_id, event_id, row_label, first_seat, last_seat, price_paid)
JOIN event e ON e.id = b.event_id
JOIN seat s ON s.venue_id = e.venue_id
           AND s.row_label = b.row_label
           AND s.seat_number BETWEEN b.first_seat AND b.last_seat
ORDER BY b.purchase_id, s.id;
`;
