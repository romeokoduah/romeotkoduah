-- Blog, comments, likes and gallery.
-- Applied by `npm run migrate`. Numbered files run once, in order.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

/* ---------------------------------------------------------------- posts -- */

CREATE TABLE IF NOT EXISTS posts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text        NOT NULL UNIQUE,
  title            text        NOT NULL,
  excerpt          text        NOT NULL DEFAULT '',
  body_md          text        NOT NULL DEFAULT '',
  cover_url        text,
  tags             text[]      NOT NULL DEFAULT '{}',
  status           text        NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft', 'published')),
  published_at     timestamptz,
  reading_minutes  integer     NOT NULL DEFAULT 1,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_published_idx
  ON posts (published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS posts_tags_idx ON posts USING gin (tags);

/* ------------------------------------------------------------- comments -- */

CREATE TABLE IF NOT EXISTS comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     uuid        NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
  parent_id   uuid        REFERENCES comments (id) ON DELETE CASCADE,
  -- NULL means the commenter chose to stay anonymous.
  author_name text,
  body        text        NOT NULL,
  status      text        NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  -- Salted hash only. The raw address is never stored or displayed.
  ip_hash     text,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_post_idx
  ON comments (post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS comments_pending_idx
  ON comments (created_at DESC) WHERE status = 'pending';

/* ---------------------------------------------------------------- likes -- */

CREATE TABLE IF NOT EXISTS likes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text        NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id   uuid        NOT NULL,
  -- Random UUID in a first-party cookie. Stops double-liking; not an identity.
  visitor_id  uuid        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (target_type, target_id, visitor_id)
);

CREATE INDEX IF NOT EXISTS likes_target_idx ON likes (target_type, target_id);

/* -------------------------------------------------------------- gallery -- */

CREATE TABLE IF NOT EXISTS albums (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        NOT NULL UNIQUE,
  title       text        NOT NULL,
  description text        NOT NULL DEFAULT '',
  sort        integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS photos (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id   uuid        REFERENCES albums (id) ON DELETE CASCADE,
  url        text        NOT NULL,
  thumb_url  text        NOT NULL,
  width      integer     NOT NULL,
  height     integer     NOT NULL,
  -- Average colour, used as a blur-up placeholder before the image loads.
  tone       text        NOT NULL DEFAULT '#e7e3df',
  caption    text        NOT NULL DEFAULT '',
  alt        text        NOT NULL DEFAULT '',
  taken_at   timestamptz,
  sort       integer     NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS photos_album_idx ON photos (album_id, sort, created_at);

-- Album cover is added after photos exists, so the reference resolves.
ALTER TABLE albums
  ADD COLUMN IF NOT EXISTS cover_photo_id uuid
  REFERENCES photos (id) ON DELETE SET NULL;

/* ----------------------------------------------------------------- auth -- */

CREATE TABLE IF NOT EXISTS admin_user (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text        NOT NULL UNIQUE,
  password_hash text        NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
