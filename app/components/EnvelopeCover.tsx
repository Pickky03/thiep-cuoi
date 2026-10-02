'use client';

import { useEffect, useRef, useState } from 'react';
import { useMusic } from './MusicProvider';

const NORMAL_INTRO_LENGTH_MS = 14700;
const ZALO_INTRO_LENGTH_MS = 17200;
const ZALO_WEBP_DURATION_MS = 6200;

type MediaMode = 'unknown' | 'zalo' | 'browser';

function unlockPageScroll() {
  document.body.style.removeProperty('overflow');
  document.documentElement.style.removeProperty('overflow');
}

function detectZaloWebView() {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent.toLowerCase();

  return (
    ua.includes('zalo') ||
    ua.includes('zalowebview')
  );
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zaloVideoRef = useRef<HTMLVideoElement>(null);

  const finishTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const preloadTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const webpTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const timelineStartedRef = useRef(false);

  const [mediaMode, setMediaMode] =
    useState<MediaMode>('unknown');

  const [opening, setOpening] =
    useState(false);

  const [timelineStarted, setTimelineStarted] =
    useState(false);

  const [webpFinished, setWebpFinished] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  useEffect(() => {
    document.body.classList.add('wedding-intro-active');

    const zalo = detectZaloWebView();

    setMediaMode(
      zalo ? 'zalo' : 'browser',
    );

    /*
      Preload WebP trên Zalo.

      Mục đích:
      tải/decode trước khi người dùng bấm con dấu,
      giúp giảm giật ở frame đầu.
    */
    if (zalo) {
      /*
        Nạp trước file video MP4 vào HTTP Cache để khi bấm mở là phát tức thì.
      */
      if (typeof fetch !== 'undefined') {
        fetch('/videos/envelope-open.mp4', { cache: 'force-cache' }).catch(() => {});
      }

      /*
        Preload cánh bướm CSS:
        Đảm bảo khi chuyển sang tờ giấy thiệp cưới, bướm hiện tức thì.
      */
      const preloadButterfly = new Image();
      preloadButterfly.src = '/images/butterfly.png';
      if ('decode' in preloadButterfly) {
        preloadButterfly.decode().catch(() => {});
      }
    }

    window.scrollTo(0, 0);

    document.body.style.overflow =
      'hidden';

    document.documentElement.style.overflow =
      'hidden';

    return () => {
      document.body.classList.remove('wedding-intro-active');
      unlockPageScroll();

      if (finishTimerRef.current) {
        clearTimeout(
          finishTimerRef.current,
        );
      }

      if (preloadTimerRef.current) {
        clearTimeout(
          preloadTimerRef.current,
        );
      }

      if (webpTimerRef.current) {
        clearTimeout(
          webpTimerRef.current,
        );
      }
    };
  }, []);

  /*
    ZALO VIDEO-TO-CANVAS ANIMATION LOOP:
    Vẽ từng frame của video MP4 phần cứng lên <canvas>.
    Trình duyệt Zalo không nhận diện được thẻ video hiển thị nên KHÔNG BUNG Native Player.
    Video MP4 chạy siêu mượt 60fps từ chip giải mã phần cứng GPU, loại bỏ 100% hiện tượng khựng/giật của WebP!
  */
  useEffect(() => {
    if (!opening || mediaMode !== 'zalo') return;

    const video = zaloVideoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isRunning = true;

    const draw = () => {
      if (!isRunning) return;

      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      if (!video.ended) {
        animId = requestAnimationFrame(draw);
      }
    };

    draw();

    const handlePlaying = () => {
      draw();
    };

    const handleEnded = () => {
      if (ctx && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    };

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('ended', handleEnded);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('ended', handleEnded);
    };
  }, [opening, mediaMode]);

  const finishIntro = () => {
    document.body.classList.remove('wedding-intro-active');
    unlockPageScroll();

    const url = new URL(
      '/thiep-cuoi',
      window.location.origin,
    );

    if (guestName !== 'Quý khách') {
      url.searchParams.set(
        'guest',
        guestName,
      );
    }

    window.history.replaceState(
      null,
      '',
      `${url.pathname}${url.search}`,
    );

    setFinished(true);
    onFinished?.();
  };

  const startTimeline = (
    zaloMode: boolean,
  ) => {
    if (
      timelineStartedRef.current
    ) {
      return;
    }

    timelineStartedRef.current =
      true;

    setTimelineStarted(true);

    preloadTimerRef.current = setTimeout(() => {
      onPreloadWeddingPage?.();
    }, zaloMode ? 14000 : 11800);

    finishTimerRef.current =
      setTimeout(
        finishIntro,
        zaloMode
          ? ZALO_INTRO_LENGTH_MS
          : NORMAL_INTRO_LENGTH_MS,
      );
  };

  const handleOpen = () => {
    if (
      opening ||
      mediaMode === 'unknown'
    ) {
      return;
    }

    /*
      startMusic phải nằm trực tiếp
      trong thao tác click của user.
    */
    startMusic();

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

    setOpening(true);

    if (reducedMotion) {
      finishTimerRef.current =
        setTimeout(
          finishIntro,
          100,
        );

      return;
    }

    /*
      ==============================
      ZALO: VIDEO-TO-CANVAS (CÁCH 2)
      ==============================
      Phát video MP4 chạy ngầm và vẽ từng frame lên <canvas>.
      Trình duyệt Zalo không nhận diện được thẻ video hiển thị nên KHÔNG BUNG Native Player.
      Video được giải mã bằng chip phần cứng GPU 60fps mượt mà, không tốn CPU, không bị giật.
    */
    if (mediaMode === 'zalo') {
      const zVideo = zaloVideoRef.current;
      if (zVideo) {
        try {
          zVideo.currentTime = 0;
          zVideo.playbackRate = 0.84;
          zVideo.muted = true;
          zVideo.defaultMuted = true;
        } catch {}

        void zVideo.play().catch(() => {});
      }

      startTimeline(true);

      webpTimerRef.current =
        setTimeout(() => {
          setWebpFinished(true);
        }, ZALO_WEBP_DURATION_MS);

      return;
    }

    /*
      ==============================
      BROWSER THƯỜNG / MESSENGER
      ==============================
    */

    const video =
      videoRef.current;

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

    void video
      .play()
      .catch(() => {
        startTimeline(false);
      });
  };

  if (finished) {
    return null;
  }

  const isZalo =
    mediaMode === 'zalo';

  const isReady =
    mediaMode !== 'unknown';

  return (
    <div
      className={[
        'intro-cover',

        isZalo
          ? 'intro-zalo'
          : '',

        timelineStarted
          ? 'intro-opening'
          : '',

        webpFinished
          ? 'intro-webp-finished'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="dialog"
      aria-modal="true"
      aria-label="Mở thiệp cưới Văn Hải và Kim Hường"
    >
      <div className="intro-film">
        <div className="intro-film-frame">

          {/* =========================
              ZALO → WEBP
          ========================= */}

          {isZalo ? (
            <>
              {/* Thẻ video chạy ngầm dùng chip giải mã phần cứng 60fps, không bung Native Player */}
              <video
                ref={zaloVideoRef}
                src="/videos/envelope-open.mp4"
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
                tabIndex={-1}
                style={{
                  position: 'absolute',
                  width: '1px',
                  height: '1px',
                  opacity: 0.001,
                  pointerEvents: 'none',
                  zIndex: -1,
                }}
                {...{
                  'webkit-playsinline': 'true',
                  'x5-playsinline': 'true',
                  'x5-video-player-type': 'h5-page',
                  'x5-video-player-fullscreen': 'false',
                  'x5-video-orientation': 'portrait',
                }}
              />
              {opening ? (
                <canvas
                  ref={canvasRef}
                  width={720}
                  height={1280}
                  className="intro-envelope-animation"
                  aria-hidden="true"
                />
              ) : (
                <img
                  src="/images/envelope-poster.jpg"
                  alt=""
                  className="intro-envelope-poster"
                  draggable={false}
                  aria-hidden="true"
                />
              )}
            </>
          ) : mediaMode ===
            'browser' ? (

            /* =========================
               BROWSER → MP4
            ========================= */

            <video
              ref={videoRef}
              src="/videos/envelope-open.mp4"
              poster="/images/envelope-poster.jpg"
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          ) : (

            /*
              Chờ detect browser.
              Chỉ hiện poster,
              chưa mount video.
            */

            <img
              src="/images/envelope-poster.jpg"
              alt=""
              className="intro-envelope-poster"
              draggable={false}
              aria-hidden="true"
            />
          )}

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
        </div>
      </div>

      {/* =========================
          PAPER

          Trên Zalo: KHÔNG mount phần này trong lúc WebP chạy.
          Chỉ mount sau khi webpFinished=true để giảm layout,
          animation và paint cạnh tranh tài nguyên với Animated WebP.
      ========================= */}

      {(!isZalo || webpFinished) && (
        <div
          className="intro-paper"
          aria-hidden={!timelineStarted}
        >
          <div
            className="intro-butterfly"
            aria-hidden="true"
          >
            <span className="intro-wing intro-wing-left" />
            <span className="intro-wing intro-wing-right" />
          </div>

          <div className="intro-copy intro-copy-invite">
            <p className="intro-invite-line">
              TRÂN TRỌNG KÍNH MỜI
            </p>

            <h5 className="intro-guest-name">
              {guestName}
            </h5>

            <p className="intro-invite-line">
              ĐẾN CHUNG VUI
            </p>
          </div>

          <div className="intro-copy intro-copy-names">
            <p>
              CHÚNG MÌNH SẮP VỀ CHUNG MỘT NHÀ
            </p>

            <h1>
              <span>Văn Hải</span>
              <em>&amp;</em>
              <span>Kim Hường</span>
            </h1>

            <p>06 · 11 · 2026</p>
          </div>
        </div>
      )}
      {!opening && (
        <p className="intro-tap-hint">
          Chạm vào con dấu để mở
          thiệp ♪
        </p>
      )}
    </div>
  );
}