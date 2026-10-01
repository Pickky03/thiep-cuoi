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
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guest = params.get('guest')?.trim();

    setGuestName(
      guest ? guest.slice(0, 80) : 'Quý khách',
    );
  }, []);

  // Chờ trình duyệt đọc URL để tránh hiển thị sai tên khách.
  if (guestName === null) {
    return <main className="min-h-svh bg-[#faf7f0]" />;
  }

  /*
    Quan trọng cho Zalo:
    Không mount WeddingPage trong lúc intro đang chạy.

    Như vậy:
    - Sakura chưa chạy
    - countdown chưa setInterval
    - ảnh lớn của WeddingPage chưa decode/render
    - Reveal/IntersectionObserver chưa khởi tạo
    - Ant Design/Gallery chưa phải render cùng lúc với WebP
  */
  if (!introFinished) {
    return (
      <EnvelopeCover
        guestName={guestName}
        onFinished={() => setIntroFinished(true)}
      />
    );
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
