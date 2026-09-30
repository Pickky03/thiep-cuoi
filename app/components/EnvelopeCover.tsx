'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import { useMusic } from './MusicProvider';

/*
  Animated WebP dài khoảng 3.7 giây.

  Sau ~3.1 giây bắt đầu crossfade sang paper,
  tức vẫn còn khoảng 0.6 giây animation để
  hai scene chồng lên nhau mượt hơn.
*/
const WEBP_TO_PAPER_MS = 3100;

/*
  Paper scene sau khi bắt đầu:
  invitation -> names -> fade cover.
*/
const PAPER_SCENE_LENGTH_MS = 9950;

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

  /*
    URL Blob của animated WebP.

    Ta preload bằng fetch() nhưng chưa tạo <img>
    hiển thị, vì vậy animation chưa chạy.

    Khi user click seal thì <img> mới mount.
  */
  const [animationSrc, setAnimationSrc] =
    useState<string>(
      '/videos/envelope-open.webp',
    );

  const [opening, setOpening] =
    useState(false);

  const [paperScene, setPaperScene] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  /*
    Ngăn timeline bị bắt đầu nhiều lần
    nếu onLoad chạy lại.
  */
  const timelineStartedRef =
    useRef(false);

  const transitionTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const finishTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const blobUrlRef =
    useRef<string | null>(null);

  /* =========================================
     INITIAL
  ========================================= */

  useEffect(() => {
    router.prefetch('/thiep-cuoi');

    window.scrollTo(0, 0);

    document.body.style.overflow = 'hidden';

    document.documentElement.style.overflow =
      'hidden';

    return () => {
      unlockPageScroll();

      if (transitionTimerRef.current) {
        clearTimeout(
          transitionTimerRef.current,
        );
      }

      if (finishTimerRef.current) {
        clearTimeout(
          finishTimerRef.current,
        );
      }
    };
  }, [router]);

  /* =========================================
     PRELOAD ANIMATED WEBP

     Download trước nhưng chưa render,
     tránh click xong mới tải 2-3 MB.
  ========================================= */

  useEffect(() => {
    let cancelled = false;

    const preloadAnimation = async () => {
      try {
        const response = await fetch(
          '/videos/envelope-open.webp',
          {
            cache: 'force-cache',
          },
        );

        if (!response.ok) {
          return;
        }

        const blob = await response.blob();

        if (cancelled) {
          return;
        }

        const blobUrl =
          URL.createObjectURL(blob);

        blobUrlRef.current = blobUrl;

        setAnimationSrc(blobUrl);
      } catch {
        /*
          Nếu preload lỗi vẫn dùng URL public
          ban đầu, website không bị hỏng.
        */
      }
    };

    void preloadAnimation();

    return () => {
      cancelled = true;

      if (blobUrlRef.current) {
        URL.revokeObjectURL(
          blobUrlRef.current,
        );

        blobUrlRef.current = null;
      }
    };
  }, []);

  /* =========================================
     FINISH INTRO
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
      Chỉ đổi URL.
      Không navigation / reload WeddingPage.
    */
    window.history.replaceState(
      null,
      '',
      `${url.pathname}${url.search}`,
    );

    setFinished(true);
  };

  /* =========================================
     START WEBP TIMELINE

     Bắt đầu từ onLoad của <img>, không bắt đầu
     ngay từ click. Như vậy nếu Zalo load ảnh
     chậm một chút, timeline vẫn không lệch.
  ========================================= */

  const startAnimationTimeline = () => {
    if (timelineStartedRef.current) {
      return;
    }

    timelineStartedRef.current = true;

    transitionTimerRef.current =
      setTimeout(() => {
        setPaperScene(true);

        finishTimerRef.current =
          setTimeout(
            finishIntro,
            PAPER_SCENE_LENGTH_MS,
          );
      }, WEBP_TO_PAPER_MS);
  };

  /* =========================================
     OPEN
  ========================================= */

  const handleOpen = () => {
    if (opening) {
      return;
    }

    /*
      Phải gọi trực tiếp trong user click
      để Safari/Zalo cho phép audio.play().
    */
    startMusic();

    setOpening(true);
  };

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
          ENVELOPE ANIMATION
      ===================================== */}

      <div className="intro-film">
        <div className="intro-film-frame">
          {!opening ? (
            <>
              {/* Poster đứng yên trước khi click */}

              <img
                src="/images/envelope-poster.jpg"
                alt=""
                className="intro-envelope-poster"
                draggable={false}
                aria-hidden="true"
              />

              {/* Seal */}

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
            </>
          ) : (
            /*
              Animated WebP chỉ được mount
              sau khi click -> animation bắt đầu.
            */
            <img
              src={animationSrc}
              alt=""
              className="intro-envelope-animation"
              draggable={false}
              aria-hidden="true"
              onLoad={
                startAnimationTimeline
              }
            />
          )}
        </div>
      </div>

      {/* =====================================
          PAPER SCENE
          GIỮ NGUYÊN DESIGN CŨ
      ===================================== */}

      <div
        className="intro-paper"
        aria-hidden={!paperScene}
      >
        {/* BUTTERFLY */}

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

        {/* COUPLE */}

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