import type { NextConfig } from 'next';

const config: NextConfig = {
  // Deliberately NO `transpilePackages`: the package has to work as a plain dependency.
  //
  // `cacheComponents` is what `create-next-app@16` scaffolds. Under it a Client Component
  // that reads `new Date()` or `Math.random()` while prerendering fails the build unless a
  // Suspense boundary sits above it (ISS-27). Three exports did; this fixture is the gate.
  cacheComponents: true,
};

export default config;
