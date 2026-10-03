'use client';

import { useEffect, useRef, useState } from 'react';
import { useMusic } from './MusicProvider';

const NORMAL_INTRO_LENGTH_MS = 14700;
const ZALO_INTRO_LENGTH_MS = 16200;

type MediaMode = 'unknown' | 'zalo' | 'browser';

function unlockPageScroll() {
  document.body.style.removeProperty('overflow');
  document.documentElement.style.removeProperty('overflow');
}

function detectZaloWebView() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('zalo') || ua.includes('zalowebview');
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

  const videoRef = useRef<HTMLVideoElement>(null);

  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timelineStartedRef = useRef(false);

  const [mediaMode, setMediaMode] = useState<MediaMode>('unknown');
  const [opening, setOpening] = useState(false);
  const [timelineStarted, setTimelineStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    document.body.classList.add('wedding-intro-active');

    const zalo = detectZaloWebView();
    setMediaMode(zalo ? 'zalo' : 'browser');

    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Preload poster và hình ảnh chung
    const imgPoster = new Image();
    imgPoster.src = '/images/envelope-poster.jpg';
    if ('decode' in imgPoster) imgPoster.decode().catch(() => {});

    const imgButterfly = new Image();
    imgButterfly.src = '/images/butterfly.png';
    if ('decode' in imgButterfly) imgButterfly.decode().catch(() => {});

    if (zalo) {
      // Zalo: Preload ảnh tờ giấy bên trong (CSS 3D)
      const imgPaper = new Image();
      imgPaper.src = '/images/frame14_clean_spotless_final.jpg';
      if ('decode' in imgPaper) imgPaper.decode().catch(() => {});
    }

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

  const startTimeline = (zaloMode: boolean) => {
    if (timelineStartedRef.current) return;
    timelineStartedRef.current = true;
    setTimelineStarted(true);

    const introLength = zaloMode ? ZALO_INTRO_LENGTH_MS : NORMAL_INTRO_LENGTH_MS;

    preloadTimerRef.current = setTimeout(() => {
      onPreloadWeddingPage?.();
    }, introLength - 2800);

    finishTimerRef.current = setTimeout(finishIntro, introLength);
  };

  const handleOpen = () => {
    if (opening || mediaMode === 'unknown') return;

    startMusic();
    setOpening(true);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      finishTimerRef.current = setTimeout(finishIntro, 100);
      return;
    }

    if (mediaMode === 'zalo') {
      // Zalo: Dùng CSS 3D (không dùng video/canvas/WebP)
      startTimeline(true);
      return;
    }

    // Browser thường: Dùng video MP4
    const video = videoRef.current;
    if (!video) {
      startTimeline(false);
      return;
    }

    try {
      video.currentTime = 0;
      video.playbackRate = 0.84;
    } catch {
      // Metadata chưa sẵn sàng.
    }

    video.onplaying = () => {
      startTimeline(false);
    };

    void video.play().catch(() => {
      startTimeline(false);
    });
  };

  if (finished) return null;

  const isZalo = mediaMode === 'zalo';
  const isReady = mediaMode !== 'unknown';

  return (
    <div
      className={[
        'intro-cover',
        isZalo ? 'intro-zalo-3d' : '',
        timelineStarted ? 'intro-opening' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="dialog"
      aria-modal="true"
      aria-label="Mở thiệp cưới Văn Hải và Kim Hường"
    >
      <div className="intro-film">
        <div className="intro-film-frame">

          {isZalo ? (
            /* =========================================
               ZALO → CSS 3D (Không giật, không lag)
               4 cánh phong bì lật mở chậm rãi 3D
            ========================================= */
            <div className="intro-envelope-3d" aria-hidden="true">

              {/* Tờ giấy thiệp cưới bên trong */}
              <div className="intro-envelope-letter">
                <img
                  src="/images/frame14_clean_spotless_final.jpg"
                  alt=""
                  className="intro-envelope-letter-bg"
                  draggable={false}
                />

                {/* Bướm 3D vỗ cánh lãng mạn */}
                <div className="intro-butterfly-box" aria-hidden="true">
                  <div className="intro-butterfly-shadow" />
                  <img
                    src="/images/butterfly.png"
                    alt=""
                    className="intro-butterfly-img"
                    draggable={false}
                  />
                </div>

                {/* Lời mời */}
                <div className="intro-copy intro-copy-invite">
                  <p className="intro-invite-line">TRÂN TRỌNG KÍNH MỜI</p>
                  <h5 className="intro-guest-name">{guestName}</h5>
                  <p className="intro-invite-line">ĐẾN CHUNG VUI</p>
                </div>

                {/* Tên cặp đôi */}
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

              {/* 4 CÁNH PHONG BÌ 3D LẬT MỞ */}
              <div className="intro-flaps-container">
                {/* Cánh trái */}
                <div className="intro-flap intro-flap-left">
                  <div className="intro-flap-face intro-flap-front">
                    <div className="intro-flap-graphic intro-flap-graphic-left" />
                    <div className="intro-flap-shadow intro-flap-shadow-left" />
                  </div>
                  <div className="intro-flap-face intro-flap-back">
                    <div className="intro-flap-lining intro-flap-lining-left" />
                  </div>
                </div>

                {/* Cánh phải */}
                <div className="intro-flap intro-flap-right">
                  <div className="intro-flap-face intro-flap-front">
                    <div className="intro-flap-graphic intro-flap-graphic-right" />
                    <div className="intro-flap-shadow intro-flap-shadow-right" />
                  </div>
                  <div className="intro-flap-face intro-flap-back">
                    <div className="intro-flap-lining intro-flap-lining-right" />
                  </div>
                </div>

                {/* Cánh trên */}
                <div className="intro-flap intro-flap-top">
                  <div className="intro-flap-face intro-flap-front">
                    <div className="intro-flap-graphic intro-flap-graphic-top" />
                    <div className="intro-flap-shadow intro-flap-shadow-top" />
                  </div>
                  <div className="intro-flap-face intro-flap-back">
                    <div className="intro-flap-lining intro-flap-lining-top" />
                  </div>
                </div>

                {/* Cánh dưới */}
                <div className="intro-flap intro-flap-bottom">
                  <div className="intro-flap-face intro-flap-front">
                    <div className="intro-flap-graphic intro-flap-graphic-bottom" />
                    <div className="intro-flap-shadow intro-flap-shadow-bottom" />
                  </div>
                  <div className="intro-flap-face intro-flap-back">
                    <div className="intro-flap-lining intro-flap-lining-bottom" />
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* =========================================
               BROWSER THƯỜNG → VIDEO MP4 (60fps GPU)
            ========================================= */
            <video
              ref={videoRef}
              src="/videos/envelope-open.mp4"
              poster="/images/envelope-poster.jpg"
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          )}

          {/* Con dấu sáp chạm mở */}
          <button
            type="button"
            className={`intro-wax-button ${opening ? 'is-opening' : ''}`}
            onClick={handleOpen}
            disabled={!isReady || opening}
            aria-label="Chạm con dấu để mở thiệp và phát nhạc"
            aria-disabled={!isReady || opening}
          >
            <img
              src="/images/wax-seal.png"
              alt=""
              width={92}
              height={92}
              draggable={false}
            />
          </button>

          {!opening && (
            <p className="intro-tap-hint">Chạm vào con dấu để mở thiệp ♪</p>
          )}

        </div>
      </div>

      {/* SCENE 2: TỜ THIỆP VÀ BƯỚM (chỉ Browser, sau khi video xong) */}
      {!isZalo && (
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
      )}

    
    </div>
  );
}