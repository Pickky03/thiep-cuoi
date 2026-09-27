'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMusic } from './MusicProvider';

const INTRO_LENGTH_MS = 17000;
function unlockPageScroll() {
  document.body.style.removeProperty('overflow');
  document.documentElement.style.removeProperty('overflow');
}
export default function EnvelopeCover() {
  const router = useRouter();
  const { startMusic } = useMusic();
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    router.prefetch('/thiep-cuoi');
  
    window.scrollTo(0, 0);
  
    // Khóa cuộn trong lúc hiển thị cảnh mở đầu.
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  
    return () => {
      // Mở khóa khi component bị hủy hoặc chuyển trang.
      unlockPageScroll();
  
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [router]);

  const handleOpen = () => {
    if (opening) return;

    // Must remain in this actual user-initiated click handler.
    startMusic();
    setOpening(true);

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (!reducedMotion) {
      const video = videoRef.current;
      if (video) {
        try { video.currentTime = 0; } catch { /* metadata not loaded yet */ }
        void video.play().catch(() => {
          // CSS fallback still reveals the butterfly and invitation.
        });
      }
    }

    timerRef.current = setTimeout(
      () => {
        // Bắt buộc mở khóa trước khi điều hướng.
        unlockPageScroll();
    
        router.replace('/thiep-cuoi');
      },
      reducedMotion ? 100 : INTRO_LENGTH_MS,
    );
  };

  return (
    <div
      className={`intro-cover ${opening ? 'intro-opening' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mở thiệp cưới Văn Hải và Kim Hường"
    >
      {/* Original envelope-opening footage: 0–3.7 seconds only. */}
      <div className="intro-film">
        <div className="intro-film-frame">
          <video
            ref={videoRef}
            src="/videos/envelope-open.mp4"
            poster="/images/envelope-poster.jpg"
            playsInline
            muted
            preload="auto"
            aria-hidden="true"
          />

          {!opening && (
            <button
              type="button"
              className="intro-wax-button"
              onClick={handleOpen}
              aria-label="Chạm con dấu để mở thiệp và phát nhạc"
            >
              <img src="/images/wax-seal.png" alt="" width={92} height={92} />
            </button>
          )}
        </div>
      </div>

      {/* Personalized scene: butterfly and Vietnamese wedding copy. */}
      <div className="intro-paper" aria-hidden={!opening}>
      <div className="intro-butterfly" aria-hidden="true">
  <span className="intro-wing intro-wing-left" />
  <span className="intro-wing intro-wing-right" />
</div>

        <div className="intro-copy intro-copy-invite">
          <span>TRÂN TRỌNG</span>
          <strong>KÍNH MỜI</strong>
          <span>ĐẾN CHUNG VUI</span>
        </div>

        <div className="intro-copy intro-copy-names">
          <p>CHÚNG MÌNH SẮP VỀ CHUNG MỘT NHÀ</p>
          <h1>
            <span>Văn Hải</span>
            <em>&amp;</em>
            <span>Kim Hường</span>
          </h1>
          <p>06 · 11 · 2026</p>
        </div>
      </div>

      {!opening && (
        <p className="intro-tap-hint">Chạm vào con dấu để mở thiệp ♪</p>
      )}
    </div>
  );
}
