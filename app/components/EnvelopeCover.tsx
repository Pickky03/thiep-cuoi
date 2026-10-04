'use client';

import { useEffect, useRef, useState } from 'react';
import { useMusic } from './MusicProvider';

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

  const videoRef = useRef<HTMLVideoElement>(null);
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

    const imgButterfly = new Image();
    imgButterfly.src = '/images/butterfly.png';
    if ('decode' in imgButterfly) imgButterfly.decode().catch(() => { });

    return () => {
      document.body.classList.remove('wedding-intro-active');
      unlockPageScroll();
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      if (preloadTimerRef.current) clearTimeout(preloadTimerRef.current);
    };
  }, []);

  // Preload video dưới dạng Blob URL:
  // blob: URL không chứa extension .mp4 → Zalo/WebView không nhận ra
  // là media file để intercept → video phát inline bình thường.
  const videoBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let blobUrl: string | null = null;
    fetch('/videos/envelope-open.mp4')
      .then((r) => r.blob())
      .then((blob) => {
        blobUrl = URL.createObjectURL(blob);
        videoBlobUrlRef.current = blobUrl;
      })
      .catch(() => { /* fallback sang URL thường */ });

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
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

    const video = videoRef.current;
    if (!video) {
      startTimeline();
      return;
    }

    // Nếu iOS đẩy video vào native player (fullscreen), sự kiện
    // webkitbeginfullscreen sẽ bắn ra. Ta tự exit fullscreen và
    // chạy CSS animation thay thế — không block video hoàn toàn.
    const onNativePlayer = () => {
      video.pause();
      const v = video as HTMLVideoElement & { webkitExitFullscreen?: () => void };
      v.webkitExitFullscreen?.();
      startTimeline();
    };
    video.addEventListener('webkitbeginfullscreen', onNativePlayer, { once: true });

    // Dùng blob URL nếu đã preload xong, fallback sang URL thường.
    // blob: URL không có đuôi .mp4 → Zalo không nhận ra để intercept.
    const src = videoBlobUrlRef.current ?? '/videos/envelope-open.mp4';
    if (!video.src || video.src === window.location.href || video.src !== src) {
      video.src = src;
      video.load();
    }

    try {
      video.currentTime = 0;
      video.playbackRate = 0.82;
    } catch { /* ignore */ }

    video.onplaying = () => startTimeline();
    video.onended = () => startTimeline();

    void video.play().catch(() => {
      video.removeEventListener('webkitbeginfullscreen', onNativePlayer);
      startTimeline();
    });
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
              VIDEO MP4 MỞ THIỆP CHUẨN IN-VITELY
              - KHÔNG để src trong JSX: Zalo quét DOM sẽ không thấy URL video
                → không intercept → không hiện native player.
              - src được gán qua JS khi người dùng nhấn nút (handleOpen).
              - preload="none": không tải trước khi chưa có src.
              - poster vẫn để để hiện ảnh nền thiệp khi chờ.
          ============================================================== */}
          <video
            ref={videoRef}
            poster="/images/envelope-poster.jpg"
            muted
            playsInline={true}
            webkit-playsinline="true"
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          />

          {/* ==============================================================
              LỚP BẤM MỞ TOÀN MÀN HÌNH (IN-VITELY TOUCH OVERLAY)
              - Phủ trọn màn hình với z-index: 20
              - Mọi cú chạm của người dùng đều rơi vào thẻ button này,
                hoàn toàn cách ly ngón tay khỏi thẻ video phía dưới.
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