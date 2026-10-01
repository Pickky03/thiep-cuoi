'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMusic } from './MusicProvider';

const INTRO_LENGTH_MS = 14200;

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
}: {
  guestName: string;
}) {
  const router = useRouter();
  const { startMusic } = useMusic();

  const videoRef = useRef<HTMLVideoElement>(null);

  const finishTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const timelineStartedRef = useRef(false);

  const [opening, setOpening] = useState(false);
  const [isZalo, setIsZalo] = useState(false);
  const [timelineStarted, setTimelineStarted] =
    useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setIsZalo(detectZaloWebView());

    router.prefetch('/thiep-cuoi');

    window.scrollTo(0, 0);

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      unlockPageScroll();

      if (finishTimerRef.current) {
        clearTimeout(finishTimerRef.current);
      }
    };
  }, [router]);

  const finishIntro = () => {
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
  };

  const startTimeline = () => {
    if (timelineStartedRef.current) return;

    timelineStartedRef.current = true;
    setTimelineStarted(true);

    finishTimerRef.current = setTimeout(
      finishIntro,
      INTRO_LENGTH_MS,
    );
  };

  const handleOpen = () => {
    if (opening) return;

    // Kiểm tra lại ngay tại thời điểm click.
    const zalo = detectZaloWebView();

    setIsZalo(zalo);

    // Phải gọi trực tiếp trong thao tác của người dùng.
    startMusic();

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    setOpening(true);

    if (reducedMotion) {
      finishTimerRef.current = setTimeout(
        finishIntro,
        100,
      );

      return;
    }

    // Zalo KHÔNG được gọi video.play().
    // Sau khi state render lại, WebP sẽ được mount.
    if (zalo) {
      return;
    }

    // Các trình duyệt bình thường sử dụng MP4.
    const video = videoRef.current;

    if (!video) {
      startTimeline();
      return;
    }

    try {
      video.currentTime = 0;
    } catch {}

    void video.play().catch(() => {
      // Nếu browser từ chối play,
      // vẫn tiếp tục intro thay vì treo.
      startTimeline();
    });
  };

  if (finished) {
    return null;
  }

  return (
    <div
      className={[
        'intro-cover',
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

          {/* =========================
              ZALO → ANIMATED WEBP
          ========================= */}

          {opening && isZalo ? (
            <img
              src="/videos/preview-zalo.webp"
              alt=""
              className="intro-envelope-animation"
              draggable={false}
              aria-hidden="true"
              onLoad={startTimeline}
              onError={startTimeline}
            />
          ) : (
            <>
              {/* =========================
                  BROWSER THƯỜNG → MP4
              ========================= */}

              <video
                ref={videoRef}
                src="/videos/envelope-open.mp4"
                poster="/images/envelope-poster.jpg"
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
                onPlaying={startTimeline}
              />

              {!opening && (
                <button
                  type="button"
                  className="intro-wax-button"
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
              )}
            </>
          )}
        </div>
      </div>

      {/* PAPER */}

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

      {!opening && (
        <p className="intro-tap-hint">
          Chạm vào con dấu để mở thiệp ♪
        </p>
      )}
    </div>
  );
}