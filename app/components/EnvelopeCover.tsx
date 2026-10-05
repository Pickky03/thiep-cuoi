'use client';

import { useEffect, useRef, useState } from 'react';
import { Lottie } from 'lottie-react';
import { useMusic } from './MusicProvider';
import envelopeAnimation from './envelope-open.json';

const INTRO_LENGTH_MS = 7600;

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

  const frameRef = useRef<HTMLDivElement>(null);
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
    if ('decode' in imgPoster) imgPoster.decode().catch(() => { });

    const imgButterflyBody = new Image();
    imgButterflyBody.src = '/images/butterfly-body-hd.png';
    if ('decode' in imgButterflyBody) imgButterflyBody.decode().catch(() => { });

    const imgButterflyLeft = new Image();
    imgButterflyLeft.src = '/images/butterfly-wing-left-hd.png';
    if ('decode' in imgButterflyLeft) imgButterflyLeft.decode().catch(() => { });

    const imgButterflyRight = new Image();
    imgButterflyRight.src = '/images/butterfly-wing-right-hd.png';
    if ('decode' in imgButterflyRight) imgButterflyRight.decode().catch(() => { });

    return () => {
      document.body.classList.remove('wedding-intro-active');
      unlockPageScroll();
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      if (preloadTimerRef.current) clearTimeout(preloadTimerRef.current);
    };
  }, []);

  // Đảm bảo Canvas Context luôn kích hoạt chế độ làm mượt ảnh (Image Smoothing) cao nhất
  useEffect(() => {
    if (!opening) return;
    const applySmoothing = () => {
      const canvas = frameRef.current?.querySelector('canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
        }
      }
    };
    applySmoothing();
    const timer = setInterval(applySmoothing, 80);
    return () => clearInterval(timer);
  }, [opening]);

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
    }, 4800);

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

    // Safety fallback: kích hoạt timeline sau 3.2s nếu onComplete gặp sự cố trên thiết bị yếu
    setTimeout(() => {
      startTimeline();
    }, 3200);
  };

  if (finished) return null;

  return (
    <div
      className={`intro-cover ${timelineStarted ? 'intro-opening' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mở thiệp cưới Văn Hải và Kim Hường"
      onAnimationEnd={(e) => {
        if (e.animationName === 'intro-cover-out') {
          finishIntro();
        }
      }}
    >
      <div className="intro-film">
        <div className="intro-film-frame" ref={frameRef}>
          {/* ==============================================================
              LOTTIE CANVAS ANIMATION MỞ THIỆP CHUẨN IN-VITELY
              - 100% Canvas, KHÔNG dùng thẻ <video>
              - Hoàn toàn miễn nhiễm với lỗi Zalo iOS Native Player!
              - Tự động phát khi người dùng bấm mở thiệp
              - DPR theo devicePixelRatio cho độ nét chuẩn Retina
              - Image smoothing Enabled khử vỡ hạt pixel
          ============================================================== */}
          {opening ? (
            <Lottie
              renderer="canvas"
              rendererSettings={{
                dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2.5) : 1,
                preserveAspectRatio: 'xMidYMid slice',
                clearCanvas: true,
              }}
              src={envelopeAnimation}
              loop={false}
              autoplay={true}
              subscriptions={{
                ready: () => {
                  const canvas = frameRef.current?.querySelector('canvas');
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.imageSmoothingEnabled = true;
                      ctx.imageSmoothingQuality = 'high';
                    }
                  }
                },
                frame: () => {
                  const canvas = frameRef.current?.querySelector('canvas');
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx && (!ctx.imageSmoothingEnabled || ctx.imageSmoothingQuality !== 'high')) {
                      ctx.imageSmoothingEnabled = true;
                      ctx.imageSmoothingQuality = 'high';
                    }
                  }
                },
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
          <span className="intro-butterfly-body" />
        </div>

        <div className="intro-copy intro-copy-invite">
          <span className="intro-invite-flourish" aria-hidden="true" />
          <p className="intro-invite-line">THÂN MỜI</p>
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
          <p className="intro-invite-sub">ĐẾN THAM DỰ BỮA TIỆC</p>
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