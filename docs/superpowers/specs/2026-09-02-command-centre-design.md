# Command Centre — system design

A private project and calendar console at `todo.romeotkoduah.org`, for two
people: the owner and a personal assistant.

The premise is that commitments arrive as WhatsApp screenshots, voice notes and
pasted text, not as typed form fields. The app's job is to turn any of those
into a structured, scheduled item, and to ask about whatever it could not work
out on its own.

This document records the architecture and the decisions taken before build. It
is written in the portfolio repo because that is where the working session
started; it moves to the new repo in phase 1.

## Decisions taken

| Question | Decision |
|---|---|
| Repo and stack | New repo, portfolio house pattern |
| Reminder channels | Web Push, Telegram, Twilio voice |
| Transcription | Deepgram Nova-3 with keyterms, provider swappable |
| Private items | Three-level `visibility` enum |
| Hosting | Existing VPS, nginx + PM2, no Docker |

## Deltas from the original brief

Each of these replaces something in the brief. The reasoning matters more than
the change, so it is recorded here rather than left implicit in the code.

**1. No Docker, no Caddy.** The VPS already runs ten production sites behind
nginx with PM2, Postgres and Redis installed. Caddy would contend with nginx
for ports 80 and 443. This app becomes an eleventh vhost following the same
pattern, which also means `deploy.ps1`, `migrate.mjs` and `create-admin.mjs`
carry over nearly unchanged.

**2. No Auth.js.** Two credential users do not justify it. The existing
argon2id + `jose` session code already covers hashing, cookies and rotation;
this adds TOTP and per-account lockout on top.

**3. Drizzle for queries, existing runner for migrations.** Type-safe queries
earn their keep across a fourteen-table schema, but `drizzle-kit` generates plain
SQL files, so the numbered-migration runner and `deploy.ps1 -Migrate` keep
working.

**4. No SMS.** Ghana permits no two-way SMS, numeric sender IDs fail to MTN,
Airtel and Glo, and alphanumeric sender IDs have been mandatory on MTN since 8
July 2026 with a two-to-three week registration lead time. SMS therefore cost
money, could not carry an acknowledgement, and would have blocked phase 5 for
three weeks. Web Push covers the early rungs at zero cost; Telegram carries
escalation and acknowledgement with native one-tap buttons; Twilio voice fires
only on the last rung. Around $3–6 per month, no registration, no lead time.

**5. `is_private` becomes a three-level `visibility` enum.** An item the
assistant cannot see is an item they will double-book over. `shared`, `private`
and `secret` govern both the assistant's view and the external calendar push,
so one field serves both audiences and the two can never contradict.

**6. Postgres is the source of truth for reminders; Redis is only the runner.**
The brief implied a durable queue, which would have meant enabling AOF
persistence server-wide and affecting ten other sites. Instead the dispatcher
scans the `reminders` table every minute. A Redis flush costs nothing but a
delayed tick.

**7. Media is not served by nginx.** The portfolio exposes `/media/` as a public
nginx alias. Captures here are screenshots of private messages and recordings of
private thoughts, so they live outside every web root and are served only
through an authenticated route.

**8. Three new tables the brief implies but does not list:** `settings`,
`job_log` and `glossary_terms`. The brief asks for editable schedules, a
readable job log and correct handling of Ghanaian proper nouns; each needs
somewhere to live.

## Architecture

Two PM2 processes, one database, one Redis keyspace.

```
nginx  todo.romeotkoduah.org  ──►  todo-app     (Next standalone, port 3009)
                                   todo-worker  (BullMQ, no HTTP listener)
                                        │
                              Postgres  todoapp  ·  Redis db 3, prefix todo:
                                        │
                     media  /var/www/todo-media  (outside every web root)
```

The port and Redis database index above are proposals; both get confirmed
against the running box in phase 1, since ten other apps already hold ports and
keyspaces there.

Splitting the worker from the web process matters: a Next.js server that also
runs BullMQ loses its jobs on every deploy reload. Separated, the app can
restart mid-ladder without dropping a scheduled call.

**Failure visibility.** A single VPS means a single point of failure, and the
one thing this app must never do quietly is fail to remind. The dispatcher pings
an external uptime monitor on every tick. If the box, the worker or the network
dies, the alert comes from something that is not the box.

## Data model

Fourteen tables. Changes from the brief are marked.

- **`users`** — id, name, email, phone_e164, role, password_hash, totp_secret,
  timezone (default `Africa/Accra`), notification_prefs
- **`push_subscriptions`** *(new)* — user_id, endpoint, p256dh, auth,
  user_agent, last_seen_at. One row per device; a person carries several.
- **`projects`** — id, name, colour, kind, status, description, archived_at
- **`items`** — id, project_id, type, title, notes, starts_at, ends_at,
  all_day, timezone, status, priority, **visibility** *(replaces `is_private`)*,
  capture_id, created_by, extraction_confidence
- **`application_meta`** — funder, award_value, portal_url,
  decision_expected_on, required_documents JSONB, referees JSONB
- **`captures`** — kind, storage_path, raw_text, transcript, model_response
  JSONB, state, created_by
- **`clarifications`** — item_id, field_name, question_text, **options JSONB**
  *(new — see below)*, answer_text, resolved_at
- **`reminders`** — item_id, channel, fire_at, offset_label, state,
  attempt_count, **claimed_at** *(new)*, provider_message_id, acknowledged_at
- **`calendar_accounts`** — provider, calendar_id, access_token_enc,
  refresh_token_enc, expires_at, sync_token, sync_direction, subscription_id,
  subscription_expires_at
- **`calendar_links`** — item_id, calendar_account_id, external_event_id,
  external_etag, last_synced_at, origin
- **`audit_log`** — actor_user_id, action, entity, entity_id, before JSONB,
  after JSONB
- **`settings`** *(new)* — key, value JSONB, updated_by, updated_at. Every
  schedule, threshold and reminder hour lives here, never in code.
- **`job_log`** *(new)* — worker, job_id, state, started_at, finished_at,
  error, payload JSONB
- **`glossary_terms`** *(new)* — term, kind (person, institution, place,
  project), aliases. Fed to both Deepgram keyterms and the extraction prompt.

All timestamps UTC, rendered in the user's timezone. Status values as specified:
`needs_details`, `scheduled`, `in_progress`, `blocked`, `done`, `cancelled`.

### The visibility enum

| Level | Assistant sees | External calendar gets |
|---|---|---|
| `shared` | Everything | Full event |
| `private` | Time only, titled "Blocked" | Untitled busy block |
| `secret` | Nothing at all | Nothing |

Default for anything marked private is `private`, not `secret`. `secret` is the
deliberate choice to accept a double-booking risk.

This is enforced by a single `visibleItemsFor(user)` predicate applied in SQL,
used by every query, digest and count. Filtering in React would leak the row
into the JSON payload; filtering in one place in SQL cannot.

## Capture and extraction

One capture box accepting pasted text, dropped or pasted images, and recorded or
uploaded audio, installable as a PWA. On Android it registers as a **Web Share
Target**, so a WhatsApp screenshot can be shared straight into the app rather
than saved and re-uploaded. iOS has no share target support; paste works there.

Three paths converge on one extraction call:

- **Text** goes straight to DeepSeek.
- **Images** go to the vision model. The text models reject images with a 400.
  The vision model is experimental, so the provider is an interface and every
  model ID is an environment variable. The live DeepSeek documentation gets
  checked for the request shape before the call is written, not assumed.
- **Audio** is transcribed by Deepgram Nova-3 first, with `glossary_terms` sent
  as keyterms, then the transcript goes to DeepSeek. The transcript is stored on
  the capture so a bad extraction can be read against what was actually heard.

Nova-3 does not support Twi or Akan, and its code-switching mode covers nine
unrelated languages, so Twi phrases will come back approximate. The glossary
repair pass below absorbs most of the damage, and the transcription provider is
swappable by environment variable if it proves too lossy.

The extraction call uses JSON output mode with a strict schema, returns an
**array** because one voice note often holds several commitments, and receives
the project list, the glossary and the capture timestamp in `Africa/Accra`. Per
item it returns type, title, project guess, notes, start, end, all_day,
location, attendees, suggested reminders, **per-field confidence**, and
`missing_fields`.

Four rules bind it: never invent a date or time; resolve relative dates against
the capture timestamp and record the reasoning in the notes; match projects
against the supplied list and propose a new one rather than force a bad match;
score confidence per field, not per item. The glossary also serves as a
correction list, so mangled proper nouns are repaired during structuring.

Any item with a null start, or any field below the configurable confidence
threshold, is created as `needs_details` and goes to the queue rather than the
calendar.

## The clarification loop

A full screen, not a modal. Original capture on the left, one question on the
right.

Questions carry enumerated `options` wherever the ambiguity is enumerable —
"which Thursday, the 10th or the 17th?" renders as two tappable dates, not an
empty field. Free text is the fallback, not the default.

Fully keyboard operable, because it gets cleared fast: `j`/`k` to move, `1`–`9`
to choose, `Enter` to confirm, `Esc` to skip. Answering the last open question
promotes the item to `scheduled` and pushes it to the connected calendars.
Anything still unresolved at 18:00 goes out as a short Telegram list.

## Reminders

Postgres holds the ladder; BullMQ only runs the clock.

Default ladder for a deadline, overridable per item:

1. 7 days — Web Push
2. 48 hours — Web Push
3. 12 hours — Telegram, with Acknowledge and Snooze buttons
4. 2 hours — Twilio voice call, reading title and time remaining, gathering a
   keypress to confirm or snooze
5. Unacknowledged — repeat the call every 30 minutes, three attempts maximum

Acknowledging anywhere cancels the rest of the ladder for that item.

**Idempotency is structural, not defensive:** a unique index on
`(item_id, offset_label)` makes ladder recomputation an upsert, and the
dispatcher claims work with a conditional `UPDATE ... WHERE claimed_at IS NULL
RETURNING`. A crash mid-send cannot produce a second call, because the second
attempt cannot claim the row.

Delivery status callbacks are recorded for every channel, so "sent" and
"actually arrived" stay distinguishable.

`sms` remains a valid channel value with an unimplemented Arkesel driver behind
the `MessagingProvider` interface, so adding it later is configuration.

## Workers

Six named BullMQ workers, each independently testable, each writing to
`job_log`.

- **Intake** — processes captures, backs off on provider failure, fails after
  three attempts with a readable reason.
- **Clarifier** — nudges on stale `needs_details` items at a configurable hour.
- **Scheduler** — recomputes reminder rows whenever an item's dates change and
  cancels the obsolete ones.
- **Dispatcher** — every minute: claim due reminders, send, record the response,
  ping the uptime monitor.
- **Calendar sync** — delta pull every five minutes, subscription renewal daily
  ahead of expiry.
- **Digest** — 06:00 daily covering today plus seven days, Sunday evening for
  the week ahead.

Every schedule and threshold reads from `settings` and is editable from the
admin screen. Changing a reminder hour must never require a deploy.

## Calendar sync

Two-way with Google Calendar and Microsoft 365.

Google uses the calendar events scope, `syncToken` incremental sync, and watch
channels pointed at a webhook on the domain, with the app's item id stored in a
private extended property so events match back without a lookup table scan.
Microsoft uses Graph with `Calendars.ReadWrite`, delta queries and change
notification subscriptions; those expire in days, so the renewal job is load
bearing.

Rules: the app owns items it created, external calendars own events created
elsewhere; on conflict the newer modification wins and **every conflict is
logged rather than silently resolved**; a remote event the app did not create is
never deleted, only unlinked; sync is idempotent, so a repeated run creates no
duplicates and a failed run is safe to retry.

**A Google trap worth naming now:** OAuth apps left in "Testing" issue refresh
tokens that expire after seven days, which would break sync every week. The app
gets published to production and the unverified-app warning accepted once.

## Security

- No secret reaches the client bundle; all model and telephony calls are server
  side.
- OAuth tokens encrypted at rest with AES-256-GCM, key from the environment.
- Captures live in `/var/www/todo-media`, outside every web root, served only
  through an authenticated route issuing short-lived signed URLs.
- Webhook signatures validated for Google, Microsoft and Twilio. Unsigned
  requests rejected, not logged and accepted.
- No public signup, no email password reset. The assistant account is created
  from an owner-only screen.
- Login rate limited per IP and per account. Sessions rotate.
- Every assistant action writes a before and after snapshot to `audit_log`, with
  an activity view for scanning a day's changes.
- Nightly `pg_dump`, encrypted, pushed off the box. **A restore is tested before
  this is called done.**
- HSTS, security headers, strict CSP.

## Design direction

A private operations console, not a consumer to-do app. Calm, dense where
density helps, readable at arm's length at six in the morning.

The hero is a horizontal fourteen-day runway, commitments positioned along it
and colour coded by project, with urgency carried by position and weight rather
than badges. The clarification queue and today's list sit below it.

One grotesque with a wide weight range, tabular figures on every time and date
so columns align, and a real type scale. A deep neutral base with **one signal
colour reserved strictly for overdue and unacknowledged** — if it appears
decoratively it stops meaning anything. Six project colours that stay legible
beside each other.

Radix supplies behaviour; its token layer is replaced entirely. Motion answers
actions — an item moving, a reminder acknowledged — and nothing else.

Avoided, because they are what every generated dashboard looks like: cream and
terracotta, identical rounded cards with one radius and one soft shadow,
gradient washes, 01/02/03 markers on things that are not sequences,
fade-and-slide-up on every section, arrows appended to button text.

Quality floor: responsive to mobile, visible keyboard focus, reduced motion
respected, and the clarification queue fully keyboard operable.

## Phases

Each ships working before the next begins.

1. **Foundation** — schema, migrations, auth with TOTP, both roles, audit log,
   nginx vhost, PM2 processes, TLS live on the real domain.
2. **Manual core** — projects and items with full CRUD, the runway, the today
   list. Entirely usable by hand before any model touches it.
3. **Text capture** — DeepSeek extraction with JSON schema output, and the
   clarification queue.
4. **Screenshot and audio** — vision model and Deepgram, glossary repair.
5. **Reminders** — ladder, dispatcher, Web Push, Telegram, voice,
   acknowledgement.
6. **Calendar** — Google and Microsoft two-way sync.
7. **Operations** — digests, admin settings, backups, restore test.

## Open items

Needed from the owner, none blocking phase 1: a Telegram bot token from
BotFather; a Twilio account and a US number for caller ID; DeepSeek and Deepgram
API keys; a Google Cloud project; and a decision on whether the Microsoft
account is personal or work.

One question still open: where the encrypted nightly dump is pushed. Backblaze
B2 has a free tier well above this database's size and works with rclone, which
is the cheapest thing that is genuinely off-box.
