// The only CommonJS file in the package, and it exists purely to fail with a
// sentence instead of a code.
//
// Without a `require` condition, `require('@echoit/itui.css')` died with
// ERR_PACKAGE_PATH_NOT_EXPORTED: No "exports" main defined. That reads like the
// package forgot to declare an entry point — the truth is the opposite, `.` is
// declared and deliberately declared under `import` only. Consumers went bug
// hunting in our packaging for a constraint the README already states.
//
// Every entry point points its `require` condition here — `.`, `./icons` and
// the per-component `./*` — so the message is the same wherever CJS knocks.
//
// Copied to dist/ by `build:cjs`; tsup's entry glob only picks up .ts/.tsx.

throw new Error(
  '@echoit/itui.css is ESM-only. Use `import` from an ESM module, or ' +
    "`await import('@echoit/itui.css')` from CommonJS. There is no CJS build — " +
    'see the Requirements section of the README.',
);
