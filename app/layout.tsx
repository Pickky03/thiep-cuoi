import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import {
  Be_Vietnam_Pro,
  Playfair_Display,
  Great_Vibes,
} from 'next/font/google';

import MusicProvider from './components/MusicProvider';

import 'antd/dist/reset.css';
import './globals.css';

/* =========================
   FONTS
========================= */

const greatVibes = Great_Vibes({
  subsets: ['latin', 'vietnamese'],
  weight: '400',
  variable: '--font-luxury-script',
  display: 'swap',
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

/* =========================
   METADATA
========================= */

export const metadata: Metadata = {
  metadataBase: new URL(
    'https://thiep-cuoi-one-iota.vercel.app'
  ),

  title: {
    default: 'Thiệp cưới Văn Hải & Kim Hường',
    template: '%s | Văn Hải & Kim Hường',
  },

  description:
    'Trân trọng kính mời bạn đến chung vui cùng Văn Hải & Kim Hường.',

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'vi_VN',

    url: 'https://thiep-cuoi-one-iota.vercel.app',

    siteName: 'Văn Hải & Kim Hường',

    title: 'Thiệp cưới Văn Hải & Kim Hường',

    description:
      'Trân trọng kính mời bạn đến chung vui cùng Văn Hải & Kim Hường.',

    images: [
      {
        url: 'https://thiep-cuoi-one-iota.vercel.app/images/preview.png',
        width: 1200,
        height: 630,
        alt: 'Thiệp cưới Văn Hải và Kim Hường',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: 'Thiệp cưới Văn Hải & Kim Hường',

    description:
      'Trân trọng kính mời bạn đến chung vui cùng Văn Hải & Kim Hường.',

    images: [
      'https://thiep-cuoi-one-iota.vercel.app/images/preview.png',
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

/* =========================
   ROOT LAYOUT
========================= */

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`
        ${beVietnam.variable}
        ${playfair.variable}
        ${greatVibes.variable}
      `}
    >
      <body>
        <MusicProvider>
          {children}
        </MusicProvider>
      </body>
    </html>
  );
}