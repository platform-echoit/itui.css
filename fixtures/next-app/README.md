# RSC fixture

Acceptance test for **I-01** (`next build` crashing with
`TypeError: (0, y.createContext) is not a function`).

```bash
pnpm build      # from packages/ui — produces dist/
pnpm check:rsc  # packs dist/ into a tarball, installs it here, runs next build
```

`check:rsc` installs the **packed tarball**, not a workspace link. A symlink
would resolve `react` from `packages/ui/node_modules` and give the app two React
copies — a failure unrelated to what is under test. The tarball also exercises
the real `files` / `exports` contract.

## What a green run proves

- [app/page.tsx](app/page.tsx) is a **Server Component** with no `"use client"`,
  so everything it imports is evaluated under the `react-server` condition.
- The barrel pulls all 49 component modules plus the icon set; `next build` gets
  through *Collecting page data* and prerenders `/` as static.
- The five **Bảng B2** wrappers (`tooltip`, `tabs`, `PopoverRoot`,
  `dropdown-menu`, `OverflowMenu`) carry **no directive** on purpose — they rely
  on their Radix package shipping one. Node's `--conditions=react-server` probe
  cannot verify that because Node ignores `"use client"`; this fixture can, and
  they render fine.
- The eight **Bảng A2** wrappers (`Avatar`, `Lnb`, `Modal`, `Progress`, `Radio`,
  `ScrollArea`, `Slider`, `Toggle`) are **rendered**, not just referenced. They
  used to carry a directive; the Radix package each one wraps now ships its own,
  so the wrapper is server-renderable and the fixture is what proves it. A
  directive-less wrapper proves nothing until the server actually walks its JSX —
  referencing the module only exercises module scope.
- No prop in that section is a function. A Server Component cannot hand one to a
  Client Component, so display-only is both the legal case and the case worth
  protecting.
- [next.config.ts](next.config.ts) has **no `transpilePackages`**. The package
  works as a plain dependency.
- `.next/static/chunks/*.css` contains `--color-brand`, `--radius-lg`, `#009ce0`
  even though this app imports **no CSS at all** — proof that
  `import '@echoit/itui.css'` alone now delivers the stylesheet (I-03).

## Measuring client-bundle weight with it

`.next/static/chunks/*.js` is the whole client payload for `/`, so flipping one
directive in the **installed** copy and rebuilding gives a clean before/after:

```bash
find .next/static/chunks -name '*.js' | xargs wc -c | tail -1
```

Reproducible to the byte across runs (845,026 with the A2 group server-rendered).

⚠️ `pnpm install` will **not** undo a hand-patch inside
`node_modules/@echoit/itui.css`: the tarball's integrity hash still matches, so
pnpm leaves the extracted copy alone and the next measurement silently describes
the old state. Delete `node_modules/@echoit` and `node_modules/.pnpm/@echoit*`
before re-measuring — the numbers below were mis-read exactly this way once.

## What it does NOT catch

Verified by removing directives from `dist/` and rebuilding:

| Removed `"use client"` from | Result |
| --- | --- |
| `stepper/Stepper.js` — `createContext` at **module scope** | ✗ build fails with the original I-01 error |
| `rating/Rating.js` — `useState` inside a **component body** | ✓ build still passes |

A module-scope client API breaks on import; a hook only breaks when the
component actually renders, and this fixture references most client components
without rendering them (their prop shapes are not the fixture's business).

So the two checks are complementary, and neither is sufficient alone:

- `pnpm check:client` — static, catches *any* client API without a directive
- `pnpm check:rsc` — integration, catches boundary and packaging breakage
