'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMusic } from './MusicProvider';

const INTRO_LENGTH_MS = 14200;

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
  const finishTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);
  const timelineStartedRef = useRef(false);

  const [opening, setOpening] = useState(false);
  const [timelineStarted, setTimelineStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
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

    const url = new URL('/thiep-cuoi', window.location.origin);

    if (guestName !== 'Quý khách') {
      url.searchParams.set('guest', guestName);
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

    // Nhạc vẫn phải bắt đầu trực tiếp từ thao tác click.
    startMusic();

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) {
      setOpening(true);

      finishTimerRef.current = setTimeout(
        finishIntro,
        100,
      );

      return;
    }

    const video = videoRef.current;

    /*
      Video đã autoplay muted + loop từ lúc trang load.
      Khi bấm con dấu chỉ đưa video về frame đầu.
      TUYỆT ĐỐI không gọi video.play() ở đây.
    */
    if (video) {
      try {
        video.currentTime = 0;
      } catch {
        // Nếu metadata chưa sẵn sàng thì video vẫn tiếp tục autoplay.
      }
    }

    // Gỡ poster tĩnh phía trên để lộ video đang chạy.
    setOpening(true);

    // Bắt đầu timeline CSS ngay từ lúc bấm mở.
    startTimeline();
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
          {/*
            Cách giống hero video của trang tham chiếu:
            autoplay + muted + loop + playsInline,
            không gọi video.play() bằng JavaScript.
          */}
          <video
            ref={videoRef}
            src="/videos/envelope-open.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="intro-envelope-video"
          />

          {/*
            Video chạy sẵn phía dưới nhưng người dùng chỉ thấy
            poster tĩnh cho tới khi bấm con dấu.
          */}
          {!opening && (
            <>
              <img
                src="/images/envelope-poster.jpg"
                alt=""
                className="intro-envelope-start-poster"
                draggable={false}
                aria-hidden="true"
              />

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
          )}
        </div>
      </div>

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
