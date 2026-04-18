import { defineConfig } from 'vite';
import react            from '@vitejs/plugin-react';
import { resolve }      from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  preview: {
    port: 4173,
    headers: securityHeaders(),
  },

  build: {
    // Warn if any chunk exceeds 500 kB
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Split vendor libraries into a separate chunk for better caching
        manualChunks: {
          react:  ['react', 'react-dom'],
          swiper: ['swiper'],
        },
      },
    },
  },

  server: {
    port: 3000,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    }
  }
});

/**
 * Returns HTTP security response headers shared between dev and preview servers.
 * In production (e.g. Netlify / Vercel) mirror these in your platform config.
 */
function securityHeaders() {
  return {
    // Prevent click-jacking
    'X-Frame-Options': 'DENY',

    // Stop MIME-type sniffing
    'X-Content-Type-Options': 'nosniff',

    // XSS filter for older browsers
    'X-XSS-Protection': '1; mode=block',

    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions policy – disable unneeded browser features
    'Permissions-Policy':
      'camera=(), microphone=(), geolocation=(), payment=()',

    // Strict Transport Security (HTTPS only; uncomment for production)
    // 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src  'self'",
      "style-src   'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
      "font-src    'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
      "img-src     'self' data: blob:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  };
}
