'use client';

import { useEffect, useRef, useState } from 'react';
import { useMusic } from './MusicProvider';

const NORMAL_INTRO_LENGTH_MS = 14200;
const ZALO_INTRO_LENGTH_MS = 18500;
const ZALO_WEBP_DURATION_MS = 8200;

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
      const preloadWebp = new Image();

      preloadWebp.src =
        '/videos/preview-zalo.webp';

      preloadWebp
        .decode?.()
        .catch(() => {});
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
      ZALO
      ==============================

      Không dùng video.
      Chỉ chạy Animated WebP.

      Sau 8.2 giây:
      đánh dấu WebP đã hoàn thành,
      lúc đó CSS mới chạy paper,
      butterfly và text.
    */
    if (mediaMode === 'zalo') {
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
              ZALO → WEBP
          ========================= */}

          {isZalo ? (
            opening ? (
              <img
                src="/videos/zalo2.webp"
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
              onPlaying={() =>
                startTimeline(false)
              }
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