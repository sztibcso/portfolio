// Pure ESM, no imports: also loaded by scripts/verify-sql-playground.mjs in Node.

export const SCHEMA_SQL = `CREATE TABLE venue (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL
);

CREATE TABLE seat (
  id          SERIAL PRIMARY KEY,
  venue_id    INT  NOT NULL REFERENCES venue(id) ON DELETE CASCADE,
  row_label   TEXT NOT NULL,
  seat_number INT  NOT NULL CHECK (seat_number > 0),
  UNIQUE (venue_id, row_label, seat_number),
  UNIQUE (id, venue_id)
);

CREATE TABLE event (
  id         SERIAL PRIMARY KEY,
  venue_id   INT NOT NULL REFERENCES venue(id),
  title      TEXT NOT NULL,
  starts_at  TIMESTAMPTZ NOT NULL,
  base_price NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
  UNIQUE (id, venue_id)
);

CREATE TABLE performer (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE event_performer (
  event_id     INT REFERENCES event(id) ON DELETE CASCADE,
  performer_id INT REFERENCES performer(id) ON DELETE RESTRICT,
  PRIMARY KEY (event_id, performer_id)
);

CREATE TABLE customer (
  id        SERIAL PRIMARY KEY,
  email     TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL
);

CREATE TABLE purchase (
  id          SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customer(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  status      TEXT NOT NULL CHECK (status IN ('PENDING','PAID','CANCELLED'))
);

CREATE TABLE ticket (
  id          SERIAL PRIMARY KEY,
  purchase_id INT NOT NULL REFERENCES purchase(id) ON DELETE CASCADE,
  event_id    INT NOT NULL,
  seat_id     INT NOT NULL,
  venue_id    INT NOT NULL,
  price_paid  NUMERIC(10,2) NOT NULL,
  FOREIGN KEY (event_id, venue_id) REFERENCES event(id, venue_id),
  FOREIGN KEY (seat_id,  venue_id) REFERENCES seat(id, venue_id),
  UNIQUE (event_id, seat_id)
);

CREATE INDEX ON ticket (purchase_id);
`;

/** Mermaid source for the ER diagram, kept next to the DDL it mirrors. */
export const ER_DIAGRAM = `erDiagram
  venue ||--|{ seat : "has"
  venue ||--o{ event : "hosts"
  event ||--o{ event_performer : "features"
  performer ||--o{ event_performer : "plays in"
  customer ||--o{ purchase : "makes"
  purchase ||--|{ ticket : "contains"
  event ||--o{ ticket : "sold for"
  seat ||--o{ ticket : "booked as"

  venue {
    int id PK
    text name
    text city
  }
  seat {
    int id PK
    int venue_id FK
    text row_label
    int seat_number
  }
  event {
    int id PK
    int venue_id FK
    text title
    timestamptz starts_at
    numeric base_price
  }
  performer {
    int id PK
    text name UK
  }
  event_performer {
    int event_id PK, FK
    int performer_id PK, FK
  }
  customer {
    int id PK
    text email UK
    text full_name
  }
  purchase {
    int id PK
    int customer_id FK
    timestamptz created_at
    text status
  }
  ticket {
    int id PK
    int purchase_id FK
    int event_id FK
    int seat_id FK
    int venue_id FK
    numeric price_paid
  }
`;
