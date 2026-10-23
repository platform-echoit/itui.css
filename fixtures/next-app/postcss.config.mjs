// dist/index.css starts with `@import "tailwindcss"`, which the consumer's
// Tailwind has to resolve — that is the contract I-11 wants made explicit.
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
