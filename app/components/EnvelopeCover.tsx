'use client';

import { useEffect, useRef, useState } from 'react';
import { useMusic } from './MusicProvider';

const NORMAL_INTRO_LENGTH_MS = 14200;
const ZALO_INTRO_LENGTH_MS = 16200;
const ZALO_WEBP_DURATION_MS = 5600;

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
  onFinished,
}: {
  guestName: string;
  onFinished?: () => void;
}) {
  const { startMusic } = useMusic();

  const videoRef = useRef<HTMLVideoElement>(null);

  const finishTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const webpTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const timelineStartedRef = useRef(false);

  const [mediaMode, setMediaMode] =
    useState<MediaMode>('unknown');

  const [webpKey, setWebpKey] =
    useState(0);

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
      Preload WebP trên Zalo qua fetch:
      File được nạp sẵn vào HTTP cache để hiện ngay lập tức khi click,
      nhưng KHÔNG dùng new Image() vì sẽ làm animation tự chạy ngầm trước,
      khiến WebP bị tua trước khi khách kịp bấm con dấu!
    */
    if (zalo) {
      fetch('/videos/zalo4.webp').catch(() => {});
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

      if (webpTimerRef.current) {
        clearTimeout(
          webpTimerRef.current,
        );
      }
    };
  }, []);

  /*
    Cấu hình thẻ <video> cho Browser thường / Messenger / Safari / Chrome:
    - playsinline, webkit-playsinline
    - Khắc phục React Muted Bug: gán DOM property muted = true
    - Chống bung player trên các WebView hỗ trợ inline
  */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('x5-playsinline', 'true');
    video.setAttribute('x5-video-player-type', 'h5-page');
    video.setAttribute('x5-video-player-fullscreen', 'false');
    video.setAttribute('x5-video-orientation', 'portrait');

    const handleBeginFullscreen = (e: Event) => {
      e.preventDefault();
      const videoEl = video as HTMLVideoElement & {
        webkitExitFullscreen?: () => void;
      };
      if (typeof videoEl.webkitExitFullscreen === 'function') {
        videoEl.webkitExitFullscreen();
      }
    };

    video.addEventListener('webkitbeginfullscreen', handleBeginFullscreen);
    return () => {
      video.removeEventListener('webkitbeginfullscreen', handleBeginFullscreen);
    };
  }, [mediaMode]);

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
      ZALO IN-APP BROWSER
      ==============================
      Trình duyệt nhúng Zalo bắt buộc dùng Animated WebP.
      TUYỆT ĐỐI không gọi video.play() trên Zalo vì tầng native
      WebView của Zalo luôn cưỡng chế video sang Native Player.
    */
    if (mediaMode === 'zalo') {
      setWebpKey(Date.now());
      startTimeline(true);

      webpTimerRef.current =
        setTimeout(() => {
          setWebpFinished(true);
        }, ZALO_WEBP_DURATION_MS);

      return;
    }

    /*
      ==============================
      BROWSER THƯỜNG / MESSENGER / SAFARI / CHROME
      ==============================
      Phát video MP4 60fps mượt mà inline.
    */
    const video =
      videoRef.current;

    if (!video) {
      startTimeline(false);
      return;
    }

    try {
      video.currentTime = 0;
      video.muted = true;
      video.defaultMuted = true;
    } catch {
      // Metadata chưa sẵn sàng.
    }

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
              ZALO: ANIMATED WEBP (100% INLINE KHÔNG BỊ NATIVE PLAYER)
              BROWSER THƯỜNG: VIDEO MP4 (60FPS INLINE)
          ========================= */}

          {isZalo ? (
            opening ? (
              <img
                key={webpKey}
                src="/videos/zalo4.webp"
                alt=""
                className="intro-envelope-animation"
                draggable={false}
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
            )
          ) : mediaMode === 'browser' ? (
            <video
              ref={videoRef}
              src="/videos/envelope-open.mp4"
              poster="/images/envelope-poster.jpg"
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              onPlaying={() =>
                startTimeline(false)
              }
              onError={() => {
                startTimeline(false);
              }}
              {...{
                'webkit-playsinline': 'true',
                'x5-playsinline': 'true',
                'x5-video-player-type': 'h5-page',
                'x5-video-player-fullscreen': 'false',
                'x5-video-orientation': 'portrait',
              }}
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

          {!opening && (
            <button
              type="button"
              className="intro-wax-button"
              onClick={handleOpen}
              disabled={!isReady}
              aria-label="Chạm con dấu để mở thiệp và phát nhạc"
              aria-disabled={!isReady}
            >
              <img
                src="/images/wax-seal.png"
                alt=""
                width={92}
                height={92}
                draggable={false}
              />
            </button>
          )}
        </div>
      </div>

      {/* =========================
          PAPER
          Trên Zalo: mount sau khi WebP kết thúc để tối ưu hiệu năng.
          Trên Browser: mount theo timeline chuẩn của video.
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