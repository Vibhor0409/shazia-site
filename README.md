# Sházia website

Next.js 15 (App Router) site for Sházia: a 3D scroll story of the bangle on a wrist, the collection, a live 3D customiser, and a two-step waitlist with a $50 refundable deposit.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

In development, waitlist sign-ups are saved to `.data/waitlist.jsonl` (gitignored).

## Environment variables

| Name | What it does | Needed for launch |
| --- | --- | --- |
| `WAITLIST_WEBHOOK_URL` | Where sign-ups are sent (a database, Google Sheet webhook or email tool). Without it, production returns "Sign-ups open shortly" instead of dropping sign-ups. | Yes |
| `WAITLIST_WEBHOOK_TOKEN` | Bearer token sent with each sign-up. | If the webhook needs it |
| `NEXT_PUBLIC_STRIPE_DEPOSIT_URL` | Stripe Payment Link for the $50 deposit. Set its success URL to `/reserve/confirmed`. Without it, the deposit step says deposits open soon. | Yes |

## Waitlist sheet (one-time setup, about 3 minutes)

Sign-ups go to the Google Sheet **Sházia waitlist sign-ups** through a small Apps Script in `waitlist-apps-script/` (gitignored, because it holds the shared token).

1. Go to [script.google.com](https://script.google.com), create a new project named "Sházia waitlist webhook".
2. Paste the contents of `waitlist-apps-script/Code.gs` into `Code.gs`, and save.
3. Choose the `authorize` function and press **Run** once; approve access to your sheets.
4. **Deploy → New deployment → Web app.** Execute as: *Me*. Who has access: *Anyone*. Deploy and copy the web app URL.
5. Paste that URL into `.env.local` as `WAITLIST_WEBHOOK_URL` (and later into Vercel's environment variables). The token is already set.

Each sign-up then appears as a row: time, email, first name, design, deposit paid (No), notes.

## Where things live

- `src/lib/content.ts` — all copy, designs, stats, FAQ. Every `TODO: CONFIRM` is a fact the team must sign off.
- `src/lib/bangle.ts` — procedural bangle and wrist-form geometry. Replace with the jeweller's CAD (GLB) when ready.
- `src/components/three/StoryScene.tsx` — scroll choreography: camera, bangle pose and callouts per chapter.
- `src/components/three/ViewerScene.tsx` — draggable bangle for design pages and Customise.
- `src/app/api/waitlist/route.ts` — validation, spam trap, same-origin check, basic rate limit.
- `next.config.ts` — security headers (CSP, HSTS, frame-ancestors, referrer, permissions).

## Before launch

- Storage for sign-ups (`WAITLIST_WEBHOOK_URL`) and a shared rate limiter (e.g. Upstash Redis).
- Stripe account under the company, Payment Link, and final deposit terms.
- Real product photos and on-wrist images; cut-outs instead of the blended renders.
- Swap the procedural bangle for the CAD model; redraw the Lumière pavé motif.
- Confirm every `TODO: CONFIRM` in the code: contact email, Instagram, launch timing, water rating, privacy wording, founding perks, engraving, sensing comparison rows, team section.
- Nonce-based CSP to drop `'unsafe-inline'` for scripts; cookie consent if analytics are added.
- Run `launch-qa-gate`, `aeo-check` and `website-security-audit`, then deploy on Vercel behind Cloudflare.
