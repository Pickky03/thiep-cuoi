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

  const finishTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const animationStartedRef = useRef(false);

  const [opening, setOpening] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
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

  const startAnimationTimeline = () => {
    if (animationStartedRef.current) return;

    animationStartedRef.current = true;
    setAnimationStarted(true);

    finishTimerRef.current = setTimeout(
      finishIntro,
      INTRO_LENGTH_MS,
    );
  };

  const handleOpen = () => {
    if (opening) return;

    // Phải gọi trực tiếp trong thao tác click để tránh autoplay restriction.
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
    }
  };

  if (finished) {
    return null;
  }

  return (
    <div
      className={[
        'intro-cover',
        animationStarted ? 'intro-opening' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="dialog"
      aria-modal="true"
      aria-label="Mở thiệp cưới Văn Hải và Kim Hường"
    >
      <div className="intro-film">
        <div className="intro-film-frame">
          {!opening ? (
            <>
              <img
                src="/images/envelope-poster.jpg"
                alt=""
                className="intro-envelope-poster"
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
          ) : (
            <img
              src="/videos/preview.webp"
              alt=""
              className="intro-envelope-animation"
              draggable={false}
              aria-hidden="true"
              onLoad={startAnimationTimeline}
              onError={startAnimationTimeline}
            />
          )}
        </div>
      </div>

      <div
        className="intro-paper"
        aria-hidden={!animationStarted}
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
