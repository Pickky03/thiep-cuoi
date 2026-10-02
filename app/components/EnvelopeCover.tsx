'use client';

import { useEffect, useRef, useState } from 'react';
import { useMusic } from './MusicProvider';

const FRAME_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

function unlockPageScroll() {
  document.body.style.removeProperty('overflow');
  document.documentElement.style.removeProperty('overflow');
}

export default function EnvelopeCover({
  guestName,
  onPreloadWeddingPage,
  onFinished,
}: {
  guestName: string;
  onPreloadWeddingPage?: () => void;
  onFinished?: () => void;
}) {
  const { startMusic } = useMusic();

  const [opening, setOpening] = useState(false);
  const [timelineStarted, setTimelineStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const preloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.body.classList.add('wedding-intro-active');
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Preload & decode trước toàn bộ 14 frames vào GPU/RAM để chuyển frame siêu mượt
    for (let i = 1; i <= 14; i++) {
      const img = new Image();
      img.src = `/images/frame${i}.jpg`;
      if ('decode' in img) {
        img.decode().catch(() => {});
      }
    }

    const bImg = new Image();
    bImg.src = '/images/butterfly.png';
    if ('decode' in bImg) {
      bImg.decode().catch(() => {});
    }

    return () => {
      document.body.classList.remove('wedding-intro-active');
      unlockPageScroll();
      if (preloadTimerRef.current) clearTimeout(preloadTimerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, []);

  const finishIntro = () => {
    document.body.classList.remove('wedding-intro-active');
    unlockPageScroll();

    if (preloadTimerRef.current) clearTimeout(preloadTimerRef.current);
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);

    const url = new URL('/thiep-cuoi', window.location.origin);
    if (guestName !== 'Quý khách') {
      url.searchParams.set('guest', guestName);
    }
    window.history.replaceState(null, '', `${url.pathname}${url.search}`);

    setFinished(true);
    onPreloadWeddingPage?.();
    onFinished?.();
  };

  const handleOpen = () => {
    if (opening) return;

    // Kích hoạt nhạc theo thao tác người dùng (tương thích iOS / Android / Safari)
    startMusic();
    setOpening(true);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      finishIntro();
      return;
    }

    setTimelineStarted(true);

    // Pre-mount trang thiệp cưới ở giây 9.5 (khi tên cặp đôi đang hiện)
    // để trình duyệt chuẩn bị sẵn nội dung bên dưới, khi màn mở thiệp mờ tan ở 11.6s
    // thì trang thiệp cưới sẽ hiện ra dần dần, loại bỏ hoàn toàn màn trắng ngắt quãng.
    if (preloadTimerRef.current) clearTimeout(preloadTimerRef.current);
    preloadTimerRef.current = setTimeout(() => {
      onPreloadWeddingPage?.();
    }, 9500);

    // Màn mở thiệp mờ tan từ 11.6s -> 12.8s (1.2s crossfade mượt mà)
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    finishTimerRef.current = setTimeout(finishIntro, 12800);
  };

  if (finished) return null;

  return (
    <div
      className={`intro-cover intro-mode-blend ${timelineStarted ? 'intro-opening' : ''}`}
      style={
        {
          '--frame-step': '0.20s',
          '--frame-fade': '0.16s',
        } as React.CSSProperties
      }
      role="dialog"
      aria-modal="true"
      aria-label="Mở thiệp cưới Văn Hải và Kim Hường"
    >
      <div className="intro-film">
        <div className="intro-film-frame">

          {/* =========================================
              14 CSS FRAMES - UNIVERSAL CROSS-BROWSER
              Chế độ mở thiệp mượt mà chuẩn tiêu chuẩn
          ========================================= */}
          <div className="intro-envelope-frames">
            {FRAME_NUMBERS.map((num) => (
              <img
                key={num}
                src={`/images/frame${num}.jpg`}
                alt=""
                className={`intro-frame-img intro-frame-${num}`}
                draggable={false}
                aria-hidden="true"
                loading="eager"
              />
            ))}

            {/* Bướm 3D vỗ cánh chậm rãi, tạo cảm giác nhẹ nhàng, lãng mạn */}
            <div className="intro-butterfly-box" aria-hidden="true">
              <div className="intro-butterfly-shadow" />
              <img
                src="/images/butterfly.png"
                alt=""
                className="intro-butterfly-img"
                draggable={false}
              />
            </div>
          </div>

          {/* Con dấu sáp chạm mở */}
          <button
            type="button"
            className={`intro-wax-button ${opening ? 'is-opening' : ''}`}
            onClick={handleOpen}
            aria-label="Chạm con dấu để mở thiệp và phát nhạc"
          >
            <img
              src="/images/wax-seal.png"
              alt=""
              width={92}
              height={92}
              draggable={false}
            />
          </button>

          {/* Nội dung thiệp trên nền giấy Frame 14 */}
          <div className="intro-copy intro-copy-invite">
            <p className="intro-invite-line">TRÂN TRỌNG KÍNH MỜI</p>
            <h5 className="intro-guest-name">{guestName}</h5>
            <p className="intro-invite-line">ĐẾN CHUNG VUI</p>
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

          {!opening && (
            <p className="intro-tap-hint">Chạm vào con dấu để mở thiệp ♪</p>
          )}
        </div>
      </div>
    </div>
  );
}