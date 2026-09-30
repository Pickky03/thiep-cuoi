import type { Metadata } from 'next';


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
  title: 'Văn Hải & Kim Hường | Thiệp cưới',
  description:
    'Trân trọng kính mời bạn chung vui trong ngày cưới của Văn Hải và Kim Hường.',
};


/* =========================
   ROOT LAYOUT
========================= */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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