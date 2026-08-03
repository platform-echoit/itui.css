import type { NextConfig } from 'next';

const config: NextConfig = {
  // Deliberately NO `transpilePackages: ['@echoit/itui.css']`. apps/web needs it
  // today because the published bundle had no "use client" directives; if this
  // fixture builds without it, the package finally works as a plain dependency.
};

export default config;
