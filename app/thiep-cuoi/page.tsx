
'use client';

import { useEffect, useState } from 'react';

import WeddingPage from './componets/weddingpage';

import {
  wedding,
  gallery,
  mapsUrl,
} from '../data/wedding';

export default function ThiepCuoiPage() {
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    // Đọc tên khách từ đường link
    const params = new URLSearchParams(window.location.search);

    const guest = params.get('guest')?.trim();

    setGuestName(
      guest ? guest.slice(0, 80) : 'Quý khách'
    );
  }, []);

  // Chờ đọc URL để tránh hiển thị sai tên khách
  if (guestName === null) {
    return <main className="min-h-svh bg-[#faf7f0]" />;
  }

  return (
    <WeddingPage
      wedding={wedding}
      gallery={gallery}
      mapsUrl={mapsUrl}
      guestName={guestName}
    />
  );
}
