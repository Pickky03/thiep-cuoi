'use client';

import { useEffect, useRef, useState } from 'react';
import { Lottie } from 'lottie-react';
import { useMusic } from './MusicProvider';
import envelopeAnimation from './envelope-open.json';

const INTRO_LENGTH_MS = 15200;

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

  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timelineStartedRef = useRef(false);

  const [opening, setOpening] = useState(false);
  const [timelineStarted, setTimelineStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    document.body.classList.add('wedding-intro-active');

    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Preload poster và hình ảnh
    const imgPoster = new Image();
    imgPoster.src = '/images/envelope-poster.jpg';
    if ('decode' in imgPoster) imgPoster.decode().catch(() => {});

    const imgButterfly = new Image();
    imgButterfly.src = '/images/butterfly.png';
    if ('decode' in imgButterfly) imgButterfly.decode().catch(() => {});

    return () => {
      document.body.classList.remove('wedding-intro-active');
      unlockPageScroll();
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      if (preloadTimerRef.current) clearTimeout(preloadTimerRef.current);
    };
  }, []);

  const finishIntro = () => {
    document.body.classList.remove('wedding-intro-active');
    unlockPageScroll();
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    if (preloadTimerRef.current) clearTimeout(preloadTimerRef.current);

    const url = new URL('/thiep-cuoi', window.location.origin);
    if (guestName !== 'Quý khách') {
      url.searchParams.set('guest', guestName);
    }
    window.history.replaceState(null, '', `${url.pathname}${url.search}`);

    setFinished(true);
    onPreloadWeddingPage?.();
    onFinished?.();
  };

  const startTimeline = () => {
    if (timelineStartedRef.current) return;
    timelineStartedRef.current = true;
    setTimelineStarted(true);

    preloadTimerRef.current = setTimeout(() => {
      onPreloadWeddingPage?.();
    }, INTRO_LENGTH_MS - 2700);

    finishTimerRef.current = setTimeout(finishIntro, INTRO_LENGTH_MS);
  };

  const handleOpen = () => {
    if (opening) return;

    startMusic();
    setOpening(true);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      finishTimerRef.current = setTimeout(finishIntro, 100);
      return;
    }

    // Safety fallback: kích hoạt timeline sau 3.8s nếu onComplete gặp sự cố trên thiết bị yếu
    setTimeout(() => {
      startTimeline();
    }, 3800);
  };

  if (finished) return null;

  return (
    <div
      className={`intro-cover ${timelineStarted ? 'intro-opening' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mở thiệp cưới Văn Hải và Kim Hường"
    >
      <div className="intro-film">
        <div className="intro-film-frame">
          {/* ==============================================================
              LOTTIE CANVAS ANIMATION MỞ THIỆP CHUẨN IN-VITELY
              - 100% Canvas, KHÔNG dùng thẻ <video>
              - Hoàn toàn miễn nhiễm với lỗi Zalo iOS Native Player!
              - Tự động phát khi người dùng bấm mở thiệp
          ============================================================== */}
          {opening ? (
            <Lottie
              src={envelopeAnimation}
              loop={false}
              autoplay={true}
              subscriptions={{
                complete: startTimeline,
              }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
              }}
            />
          ) : (
            <img
              src="/images/envelope-poster.jpg"
              alt=""
              className="intro-envelope-poster"
              draggable={false}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          )}

          {/* ==============================================================
              LỚP BẤM MỞ TOÀN MÀN HÌNH (IN-VITELY TOUCH OVERLAY)
              - Phủ trọn màn hình với z-index: 20
              - Mọi cú chạm của người dùng đều rơi vào thẻ button này
          ============================================================== */}
          {!opening && (
            <button
              type="button"
              className="intro-touch-overlay"
              onClick={handleOpen}
              aria-label="Chạm để mở thiệp và phát nhạc"
            >
              <div className="intro-wax-button">
                <img
                  src="/images/wax-seal.png"
                  alt=""
                  width={92}
                  height={92}
                  draggable={false}
                />
              </div>
              <p className="intro-tap-hint">Chạm vào con dấu để mở thiệp ♪</p>
            </button>
          )}
        </div>
      </div>

      {/* SCENE 2: TỜ THIỆP + BƯỚM VỖ CÁNH 3D + THÔNG TIN MỜI */}
      <div
        className="intro-paper"
        aria-hidden={!timelineStarted}
      >
        <div className="intro-butterfly" aria-hidden="true">
          <span className="intro-wing intro-wing-left" />
          <span className="intro-wing intro-wing-right" />
        </div>

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
      </div>
    </div>
  );
}