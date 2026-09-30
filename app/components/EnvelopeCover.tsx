'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMusic } from './MusicProvider';

const INTRO_LENGTH_MS = 13650;
function unlockPageScroll() {
  document.body.style.removeProperty('overflow');
  document.documentElement.style.removeProperty('overflow');
}
export default function EnvelopeCover({
  guestName,
}: {
  guestName: string;
}) {
  const router = useRouter();
  const { startMusic } = useMusic();
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [opening, setOpening] = useState(false);
  const [finished, setFinished] = useState(false);
  const [paperScene, setPaperScene] = useState(false);
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
    setPaperScene(true);
    // const reducedMotion = window.matchMedia(
    //   '(prefers-reduced-motion: reduce)',
    // ).matches;

    // if (!reducedMotion) {
    //   const video = videoRef.current;
    //   if (video) {
    //     try { video.currentTime = 0; } catch { /* metadata not loaded yet */ }
    //     void video.play().catch(() => {
    //       // CSS fallback still reveals the butterfly and invitation.
    //     });
    //   }
    // }

    // timerRef.current = setTimeout(
    //   () => {
    //     // Mở lại khả năng cuộn trang.
    //     unlockPageScroll();
    
    //     // Chỉ cập nhật đường dẫn, không điều hướng sang
    //     // một bản WeddingPage khác.
    //     const url = new URL('/thiep-cuoi', window.location.origin);
    
    //     if (guestName !== 'Quý khách') {
    //       url.searchParams.set('guest', guestName);
    //     }
    
    //     window.history.replaceState(
    //       null,
    //       '',
    //       `${url.pathname}${url.search}`
    //     );
    
    //     // Xóa lớp mở đầu, để lộ WeddingPage đã render phía sau.
    //     setFinished(true);
    //   },
    //   reducedMotion ? 100 : INTRO_LENGTH_MS,
    // );
  };
  if (finished) return null;
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
  <span className="intro-invite-flourish" aria-hidden="true" />

  <p className="intro-invite-line">Thân mời</p>

  <div className="intro-invite-rule" aria-hidden="true">
    <span />
    <i />
    <span />
  </div>

  <h5 className="intro-guest-name">{guestName}</h5>

  <div className="intro-invite-rule intro-invite-rule-soft" aria-hidden="true">
    <span />
    <i />
    <span />
  </div>

  <p className="intro-invite-sub">đến tham dự bữa tiệc</p>
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
