import type { Metadata } from 'next';
import MusicProvider from './components/MusicProvider';
import {
  Be_Vietnam_Pro,
  Playfair_Display,
  Great_Vibes,
} from 'next/font/google';

import 'antd/dist/reset.css';
import './globals.css';
const greatVibes = Great_Vibes({
  subsets: ['latin', 'vietnamese'],
  weight: '400',
  variable: '--font-luxury-script',
  display: 'swap',
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: [
    '300',
    '400',
    '500',
    '600',
    '700',
  ],
  variable: '--font-be-vietnam',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: [
    '400',
    '500',
    '600',
    '700',
  ],
  style: [
    'normal',
    'italic',
  ],
  variable: '--font-playfair',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vanhai-kimhuong.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Văn Hải & Kim Hường | Thiệp cưới',
  description:
    'Trân trọng kính mời bạn chung vui trong ngày cưới của Văn Hải và Kim Hường.',
  openGraph: {
    title: 'Văn Hải & Kim Hường | Thiệp cưới',
    description:
      'Trân trọng kính mời bạn chung vui trong ngày cưới của Văn Hải và Kim Hường.',
    url: '/',
    siteName: 'Thiệp cưới Văn Hải & Kim Hường',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/images/DUY0811.jpg',
        width: 1200,
        height: 630,
        alt: 'Thiệp cưới Văn Hải & Kim Hường',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Văn Hải & Kim Hường | Thiệp cưới',
    description:
      'Trân trọng kính mời bạn chung vui trong ngày cưới của chúng mình.',
    images: ['/images/DUY0811.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} ${playfair.variable} ${greatVibes.variable}`}
    >
      <body>
        <MusicProvider>
          {children}
        </MusicProvider>

      </body>
    </html>
  );
}