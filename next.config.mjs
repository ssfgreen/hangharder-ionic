// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'));

// This is required as the libraries are not automatically transpiled by next.js
import withTmInitializer from 'next-transpile-modules';
const withTM = withTmInitializer([
  '@ionic/react',
  '@ionic/core',
  '@stencil/core',
  'ionicons'
]);

/** @type {import("next").NextConfig} */
const config = {
  basePath: '',
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
};
export default withTM(config);
