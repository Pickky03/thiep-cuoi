'use client';

import { useEffect, useState } from 'react';

import WeddingPage from './thiep-cuoi/componets/weddingpage';
import EnvelopeCover from './components/EnvelopeCover';

import {
  wedding,
  gallery,
  mapsUrl,
} from './data/wedding';

export default function HomePage() {
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const guest = params.get('guest')?.trim();

    setGuestName(
      guest ? guest.slice(0, 80) : 'Quý khách'
    );
  }, []);

  // Chờ trình duyệt đọc URL để tránh hiển thị sai tên khách.
  if (guestName === null) {
    return <main className="min-h-svh bg-[#faf7f0]" />;
  }

  return (
    <>
      <WeddingPage
        wedding={wedding}
        gallery={gallery}
        mapsUrl={mapsUrl}
        guestName={guestName}
      />

      <EnvelopeCover guestName={guestName} />
    </>
  );
}