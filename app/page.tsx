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
  const [mountWeddingPage, setMountWeddingPage] = useState(false);

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
    - Trong giai đoạn đầu mở phong bì: Chỉ chạy EnvelopeCover để GPU/CPU dồn 100% tài nguyên
      cho chuyển động mở thiệp và 14 frames, giúp Zalo và mobile cực kỳ mượt mà.
    - Từ 9.5s (khi tên cặp đôi đang hiện): Pre-mount WeddingPage bên dưới.
    - Từ 11.6s -> 12.8s: EnvelopeCover mờ dần (opacity 1 -> 0) làm lộ ra WeddingPage
      đang rõ dần bên dưới, tạo hiệu ứng tan mờ (crossfade) chuẩn điện ảnh, loại bỏ 100% màn trắng.
  */
  return (
    <>
      {(mountWeddingPage || introFinished) && (
        <div className="wedding-page-revealed">
          <WeddingPage
            wedding={wedding}
            gallery={gallery}
            mapsUrl={mapsUrl}
            guestName={guestName}
          />
        </div>
      )}

      {!introFinished && (
        <EnvelopeCover
          guestName={guestName}
          onPreloadWeddingPage={() => setMountWeddingPage(true)}
          onFinished={() => {
            setMountWeddingPage(true);
            setIntroFinished(true);
          }}
        />
      )}
    </>
  );
}
