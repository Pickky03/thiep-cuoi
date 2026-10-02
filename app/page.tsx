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
  const [preloadWeddingPage, setPreloadWeddingPage] = useState(false);
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
    Tối ưu hóa:
    - Trong phần lớn thời gian intro, không mount WeddingPage để tiết kiệm CPU/RAM (đặc biệt Zalo WebView).
    - Ở 2.5 giây cuối (lúc hiển thị tên cô dâu chú rể), WeddingPage được preload ngầm dưới EnvelopeCover.
    - Khi EnvelopeCover mờ dần (intro-cover-out), trang thiệp cưới hiện ra liền mạch, không bị chớp trắng hay giật.
  */
  return (
    <>
      {(preloadWeddingPage || introFinished) && (
        <WeddingPage
          wedding={wedding}
          gallery={gallery}
          mapsUrl={mapsUrl}
          guestName={guestName}
        />
      )}
      {!introFinished && (
        <EnvelopeCover
          guestName={guestName}
          onPreloadWeddingPage={() => setPreloadWeddingPage(true)}
          onFinished={() => setIntroFinished(true)}
        />
      )}
    </>
  );
}
