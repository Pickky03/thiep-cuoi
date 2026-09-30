'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useMusic } from './MusicProvider';

/*
  Video ~3.7s
  Paper scene ~9.95s
  Tổng vẫn gần 13.65s như bản cũ.
*/
const PAPER_SCENE_LENGTH_MS = 9950;

/*
  Safety fallback:
  nếu WebView/Zalo không bắn onEnded,
  sau khi JS hoạt động lại vẫn có đường thoát.
*/
const VIDEO_FALLBACK_MS = 6000;

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

  const paperTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const videoFallbackTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const paperStartedRef = useRef(false);

  const openingRef = useRef(false);

  const [opening, setOpening] = useState(false);
  const [paperScene, setPaperScene] = useState(false);
  const [finished, setFinished] = useState(false);

  /* =========================================
     INITIAL
  ========================================= */

  useEffect(() => {
    router.prefetch('/thiep-cuoi');

    window.scrollTo(0, 0);

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      unlockPageScroll();

      if (paperTimerRef.current) {
        clearTimeout(paperTimerRef.current);
      }

      if (videoFallbackTimerRef.current) {
        clearTimeout(videoFallbackTimerRef.current);
      }
    };
  }, [router]);

  /* =========================================
     FORCE VIDEO INLINE
  ========================================= */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    /*
      Safari / WebView
    */
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    /*
      Tencent/X5 compatibility trên Android.
    */
    video.setAttribute('x5-playsinline', 'true');
  }, []);

  /* =========================================
     FINISH WHOLE INTRO
  ========================================= */

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

    /*
      Không navigation.
      Chỉ đổi URL để WeddingPage phía sau
      không bị remount/reload.
    */
    window.history.replaceState(
      null,
      '',
      `${url.pathname}${url.search}`,
    );

    setFinished(true);
  };

  /* =========================================
     VIDEO -> PAPER
  ========================================= */

  const startPaperScene = () => {
    /*
      onEnded + timeupdate + fallback có thể
      cùng gọi hàm này.
    */
    if (paperStartedRef.current) {
      return;
    }

    paperStartedRef.current = true;

    if (videoFallbackTimerRef.current) {
      clearTimeout(
        videoFallbackTimerRef.current,
      );

      videoFallbackTimerRef.current = null;
    }

    setPaperScene(true);

    paperTimerRef.current = setTimeout(
      finishIntro,
      PAPER_SCENE_LENGTH_MS,
    );
  };

  /* =========================================
     OPEN
  ========================================= */

  const handleOpen = () => {
    if (openingRef.current) return;

    openingRef.current = true;

    /*
      Phải gọi trực tiếp từ thao tác click
      để audio được phép phát.
    */
    startMusic();

    setOpening(true);

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

    if (reducedMotion) {
      startPaperScene();
      return;
    }

    const video = videoRef.current;

    if (!video) {
      startPaperScene();
      return;
    }

    try {
      video.currentTime = 0;
    } catch {
      // Metadata chưa load.
    }

    /*
      Nếu Zalo/WebView không cho phát,
      bỏ video và tiếp tục scene giấy.
    */
    void video.play().catch(() => {
      startPaperScene();
    });

    /*
      Fallback cuối cùng nếu onEnded không chạy.
    */
    videoFallbackTimerRef.current =
      setTimeout(
        startPaperScene,
        VIDEO_FALLBACK_MS,
      );
  };

  /* =========================================
     WEBVIEW FALLBACK
  ========================================= */

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;

    if (
      !video ||
      paperStartedRef.current ||
      !Number.isFinite(video.duration) ||
      video.duration <= 0
    ) {
      return;
    }

    /*
      Một số WebView đôi khi không gọi onEnded.
      Chuyển scene khi còn khoảng 0.12s.
    */
    if (
      video.currentTime >=
      video.duration - 0.12
    ) {
      startPaperScene();
    }
  };

  /*
    Nếu Zalo đẩy video sang native player,
    khi quay lại WebView kiểm tra video đã hết chưa.
  */
  useEffect(() => {
    const checkVideoState = () => {
      if (
        !openingRef.current ||
        paperStartedRef.current
      ) {
        return;
      }

      const video = videoRef.current;

      if (!video) return;

      if (video.ended) {
        startPaperScene();
        return;
      }

      if (
        Number.isFinite(video.duration) &&
        video.duration > 0 &&
        video.currentTime >=
          video.duration - 0.2
      ) {
        startPaperScene();
      }
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState ===
        'visible'
      ) {
        checkVideoState();
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    );

    window.addEventListener(
      'pageshow',
      checkVideoState,
    );

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );

      window.removeEventListener(
        'pageshow',
        checkVideoState,
      );
    };
  }, []);

  /* =========================================
     REMOVE COVER
  ========================================= */

  if (finished) {
    return null;
  }

  return (
    <div
      className={[
        'intro-cover',
        opening ? 'intro-opening' : '',
        paperScene
          ? 'intro-paper-scene'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="dialog"
      aria-modal="true"
      aria-label="Mở thiệp cưới Văn Hải và Kim Hường"
    >
      {/* =====================================
          VIDEO
      ===================================== */}

      <div className="intro-film">
        <div className="intro-film-frame">
          <video
            ref={videoRef}
            src="/videos/envelope-open.mp4"
            poster="/images/envelope-poster.jpg"
            playsInline
            muted
            preload="metadata"
            controls={false}
            disablePictureInPicture
            onEnded={startPaperScene}
            onTimeUpdate={
              handleVideoTimeUpdate
            }
            aria-hidden="true"
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
        </div>
      </div>

      {/* =====================================
          PAPER
      ===================================== */}

      <div
        className="intro-paper"
        aria-hidden={!paperScene}
      >
        {/* BUTTERFLY - GIỮ NGUYÊN BẢN CŨ */}

        <div
          className="intro-butterfly"
          aria-hidden="true"
        >
          <span className="intro-wing intro-wing-left" />
          <span className="intro-wing intro-wing-right" />
        </div>

        {/* INVITATION */}

        <div className="intro-copy intro-copy-invite">
          <span
            className="intro-invite-flourish"
            aria-hidden="true"
          />

          <p className="intro-invite-line">
            Thân mời
          </p>

          <div
            className="intro-invite-rule"
            aria-hidden="true"
          >
            <span />
            <i />
            <span />
          </div>

          <h5 className="intro-guest-name">
            {guestName}
          </h5>

          <div
            className="intro-invite-rule intro-invite-rule-soft"
            aria-hidden="true"
          >
            <span />
            <i />
            <span />
          </div>

          <p className="intro-invite-sub">
            đến tham dự bữa tiệc
          </p>
        </div>

        {/* NAMES */}

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