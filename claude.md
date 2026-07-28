# packages/ui — Component Development Guide

Workflow for adding a new component to this package, from Figma to a demoable Storybook story.

## Workflow

1. Pull design context from Figma for the target node (`get_design_context` / `get_variable_defs` / `get_screenshot`).
2. Map every Figma variable/style to an existing token — see `TOKENS.md` and `src/styles/global.css` / `src/tokens/tailwind.extend.ts`. Do not hardcode a hex/px value or invent a new CSS variable. If a token is genuinely missing, add it properly (register in `global.css` / `tailwind.extend.ts`, log it in `TOKENS.md`'s "Missing Tokens" table) before using it — never as a one-off inline value.
3. Build the component under `src/components/{kebab-case-name}/`.
4. Barrel-export it from `src/index.ts`.
5. Add a demo story in `apps/storybook/src/stories/{kebab-case-name}/{ComponentName}.stories.tsx` — the story folder mirrors the component folder.

## File & folder conventions

- Folder name: kebab-case (`dropdown-menu/`, `input-group/`), matching existing components.
- Every element `forwardRef`s to its underlying DOM/Radix node, sets `displayName`, and merges `className` via `cn()` — never string concatenation.
- Props interfaces are named `{Component}Props` and extend the relevant HTML/Radix prop type.

## Base structure: prefer Radix primitives

- For anything interactive/overlay/accessible (menu, popover, dialog, tooltip, tabs, select, accordion...), wrap the matching `@radix-ui/react-*` primitive. Follow the pattern in `dropdown-menu.tsx` / `dialog/dialog.tsx`: alias Radix parts (`const X = XPrimitive.Part`), forward refs, only add Tailwind classes — never touch Radix's own behavior/ARIA handling.
- `@radix-ui/react-dialog`, `-dropdown-menu`, `-popover`, `-select`, `-tabs`, `-tooltip`, `-slot`, and the all-in-one `radix-ui` package are already installed — check there before adding a new Radix dependency.
- Use `@radix-ui/react-slot`'s `Slot` (`asChild`) when consumers should be able to swap the rendered element, same as `Button`/`*Trigger`.

## Animation & UX

- Reuse the existing enter/exit pattern from Dialog/DropdownMenu/Select: `data-[state=open]:animate-in data-[state=closed]:animate-out` with `fade-in-0`/`fade-out-0`, `zoom-in-95`/`zoom-out-95`, `slide-in-from-{side}-2` keyed off `data-[side=...]`. Don't invent new keyframes or animation utility names.
- Durations/easing must come from the motion tokens in `TOKENS.md` (`duration-150/200/300`, `ease-out`/`ease-in-out`...), never arbitrary values.
- Style states via Radix's own `data-[state]` / `data-[disabled]` / `focus-visible:` attributes rather than tracking state in JS.

## Styling rules (tokens only)

- Every color, spacing, radius, shadow, font-size/weight/leading/tracking, duration, and z-index class must map to a token already defined in `TOKENS.md` (e.g. `bg-popover`, `text-neutral-muted`, `rounded-lg`, `shadow-sm`, `duration-200`).
- Never write raw hex colors or arbitrary values (`text-[13px]`) as a shortcut. If Figma needs a value with no existing token, add it properly first (see rule 2 above).
- Add a short comment block at the top of the file mapping Figma node → token → Tailwind class (see `popover/Popover.tsx` for the format), so the Figma-to-code trace stays visible.

## DX / API design

- Keep the public API small and composable (compound components: `<Thing><ThingTrigger/><ThingContent>...`), matching `Popover`/`DropdownMenu`/`Dialog`.
- Support the standard escape hatches: `className`, ref forwarding, spreading `...rest` onto the underlying element.
- Export every part individually (Root/Trigger/Content/Item/...) — no default exports, no namespace objects.
- Add the export to `src/index.ts` (`export * from './components/{name}'`).

## Storybook demo

- One file per component, in a folder mirroring the component's: `apps/storybook/src/stories/{kebab-case-name}/{ComponentName}.stories.tsx` (e.g. `src/components/calendar/DatePicker.tsx` → `src/stories/calendar/DatePicker.stories.tsx`).
- Import only from `'@echoit/itui.css'` (Storybook's Vite config aliases this straight to `packages/ui/src`, so no build step is needed to see changes).
- Use the CSF3 format already in use (see `DropdownMenu.stories.tsx`): `const meta = { title: 'UI/{ComponentName}', component: X } satisfies Meta<typeof X>`, `export const Default: Story = { render: () => (...) }`.
- Cover a `Default` story plus one story per meaningfully different variant/state.
