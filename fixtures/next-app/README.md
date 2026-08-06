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

## The two pages

| Route | File | What it is for |
| --- | --- | --- |
| `/` | [app/page.tsx](app/page.tsx) | The curated page. It is the surface the client-bundle assertions measure, so what it renders is deliberately limited. |
| `/all` | [app/all/page.tsx](app/all/page.tsx) | Coverage. Imports **every** value export of the barrel and renders every one a server can render. |

Both are Server Components. `/all` exists because the curated page cannot be
both things at once: it renders Lexical, date-fns and sonner on purpose, which
is exactly what the leak assertion says must not appear — so the assertions are
scoped to `/`'s own chunks via `app-build-manifest.json`, and `/all` is asserted
by building at all.

`/all` also lists, at the bottom of the file, the exports it cannot render:
token maps, class helpers, hooks, the imperative `toast()` / `snackbar()`
callers, and `ResourceModal`, whose required `onClose` is a function — the one
thing a Server Component may not pass. That list is the fixture's coverage gap,
written down rather than implied.

## What a green run proves

- [app/page.tsx](app/page.tsx) is a **Server Component** with no `"use client"`,
  so everything it imports is evaluated under the `react-server` condition.
- Every export renders on the server, not just the ones a page happened to use.
  This is the half that was missing when `Tag`, `Chip` and `Pagination` shipped
  handlers on DOM props (I-15): the modules were imported here, and importing
  only evaluates module scope — a handler crosses the boundary at render time.
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
- `Select` is **rendered** from the Server Component (I-27). It reaches the page
  through a barrel, which is the only way the barrel's export shape becomes
  observable — see the assertions below.

## Client-bundle assertions (I-27)

A green `next build` was never enough: for a whole milestone this fixture built
fine while handing consumers the entire library. `check:rsc` now measures the
chunks Next lists for `/` in `.next/app-build-manifest.json` and fails on either
count:

- **Unrendered modules must be absent.** `/` renders no Lexical, date-fns or
  sonner, so a marker for any of them in *its* client chunks means a barrel
  dragged it across the boundary. This is the sharp instrument — it names the
  problem. It reads one route's chunks, not the whole `static/chunks` directory:
  `/all` renders those three legitimately, and a directory-wide glob would have
  turned this assertion into a permanent false positive.
- **Client JS on `/` < 1,000,000 B.** The blunt safety net, for a leak through a
  dependency nobody thought to name. Measured: **892,157 B** today, **869,581 B**
  before Next 16 and before `Pagination` became a client module, **1,336,571 B**
  while two barrels used `export *`. `/all` is reported next to it and
  deliberately not asserted — at **1,358,313 B** its weight is the whole
  library, by design. The whole `static/chunks` directory is 1,624,214 B, which
  is why the assertion had to stop reading it.

`pnpm check:barrels` catches the same defect statically, without a build. Both
are worth keeping: the guard knows the *shape* that causes it, the fixture knows
the *bytes* — and only the fixture would notice a new way to produce them.

## Measuring client-bundle weight by hand

Flipping one directive in the **installed** copy and rebuilding gives a clean
before/after. Read the files Next lists for the route rather than the whole
directory — `/all` shares that directory and would drown the delta:

```bash
node -e "const m=require('./.next/app-build-manifest.json').pages['/page'];\
console.log(m.filter(f=>f.endsWith('.js')).reduce((n,f)=>n+require('fs').statSync('.next/'+f).size,0))"
```

Reproducible to the byte across runs (845,026 with the A2 group server-rendered
and before `Select` was added to the page; `Select` itself accounts for 24.5 kB
of the current 869,581).

⚠️ **Hold every other variable fixed.** The `export *` model in the plan's §3.5
was wrong because its "one variable" test left six other barrels spread in both
arms — a single spread barrel does not leak; it takes two. If a measurement is
meant to show that X causes Y, one arm has to differ *only* in X.

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
component actually renders. That table was measured when the fixture referenced
most client components without rendering them — `/all` closes exactly that gap
for every export it can render, and the remaining blind spot is the list at the
bottom of `app/all/page.tsx`.

So the checks are complementary, and none is sufficient alone:

- `pnpm check:client` — static, catches *any* client API without a directive
- `pnpm check:barrels` — static, catches a barrel spreading a client module
- `pnpm check:rsc` — integration, catches boundary and packaging breakage, and
  is the only one that measures what a consumer actually downloads
