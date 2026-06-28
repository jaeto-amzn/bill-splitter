# Bill Splitter

Split a restaurant bill by **who ate what**. Tax and tip are divided
**proportionally** to each person's share of the food — so the big eaters
cover more of the tax and tip, and shared dishes are split only among the
people who actually shared them.

## How it works

1. **Add diners** — everyone at the table.
2. **Add items** — each dish with its pre-tax price. Tap the diners who
   shared it (tap "Everyone" for shared apps/dessert). A two-person split
   means each ate half.
3. **Enter tax** from the receipt, and pick a **tip** (preset %, custom %,
   or a fixed amount).
4. Read the **Who owes what** table — items, tax, tip, and total per person.

### Math

- All amounts are computed in **integer cents** (no floating-point drift).
- Each item is split equally among its sharers.
- Tax and tip are allocated across diners **in proportion to their item
  subtotals**, using the **largest-remainder method** so every cent is
  accounted for and the parts always sum back to the exact total.

State is saved to `localStorage` — nothing leaves the device.

## Stack

Vite + React + TypeScript, shadcn/ui primitives, Tailwind v4, Solar Dusk theme.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build -> dist/
npm run preview  # preview the production build
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes `dist/` to GitHub Pages. Enable Pages once under
**Settings → Pages → Source: GitHub Actions**.

Lives at `https://jaeto-amzn.github.io/bill-splitter/` (relative `base`).
