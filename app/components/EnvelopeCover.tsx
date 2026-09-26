'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useMusic } from './MusicProvider';

export default function EnvelopeCover() {
  const router = useRouter();
  const { startMusic } = useMusic();

  const [opening, setOpening] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    router.prefetch('/thiep-cuoi');

    // Đưa trang về đầu và khóa cuộn khi chưa mở thiệp.
    window.scrollTo(0, 0);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [router]);

  const handleOpen = () => {
    if (opening) return;

    // Phát nhạc trực tiếp từ thao tác chạm con dấu.
    startMusic();

    setOpening(true);

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Chờ hiệu ứng hoàn thành rồi đổi URL.
    timerRef.current = setTimeout(
      () => {
        router.replace('/thiep-cuoi');
      },
      reducedMotion ? 80 : 5000,
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Phong bì thiệp cưới Văn Hải và Kim Hường"
      className={`invite-cover ${opening ? 'invite-opening' : ''}`}
    >
      {/* Nền trang mở đầu */}
      <div className="invite-background" />

      <div className="invite-content">

        <p className="invite-eyebrow">
          THE WEDDING INVITATION
        </p>

        <h1 className="invite-heading">
          Văn Hải
          <span className="mx-3 italic text-[#ae8778]">&</span>
          Kim Hường
        </h1>

        <p className="invite-date">
          06 · 11 · 2026
        </p>

        {/* Phong bì */}
        <div className="invite-envelope">

          <div className="invite-stage">

            {/* Mặt sau */}
            <div className="invite-back" />

            {/* Ảnh Hero nằm trong phong bì */}
            <div className="invite-preview">
              <div className="invite-preview-photo" />
              <div className="invite-preview-overlay" />
            </div>

            {/* Nắp phong bì */}
            <div className="invite-flap" />

            {/* Thân phong bì phía dưới */}
            <div className="invite-front" />

            {/* Con dấu sáp */}
            <button
              type="button"
              onClick={handleOpen}
              disabled={opening}
              aria-label="Chạm để mở thiệp cưới và phát nhạc"
              className="invite-seal invite-seal-image"
            >
           
            </button>

          </div>
        </div>

        <div className="invite-instruction">
          <p className="font-[var(--font-playfair)] text-xl italic">
            Một lời mời gửi đến bạn
          </p>

          <p className="mt-3 text-xs tracking-widest">
            Chạm con dấu sáp để mở thiệp ♡
          </p>
        </div>

      </div>
    </div>
  );
}