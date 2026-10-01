'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMusic } from './MusicProvider';

const INTRO_LENGTH_MS = 13650;

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

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [opening, setOpening] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    router.prefetch('/thiep-cuoi');

    window.scrollTo(0, 0);

    // Khóa cuộn trong lúc intro đang hiển thị.
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      unlockPageScroll();

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [router]);

  const handleOpen = () => {
    if (opening) return;

    // Nhạc phải được gọi trực tiếp từ thao tác click.
    startMusic();

    // Khi opening = true:
    // poster biến mất và animated WebP mới được mount.
    setOpening(true);

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    timerRef.current = setTimeout(
      () => {
        unlockPageScroll();

        const url = new URL(
          '/thiep-cuoi',
          window.location.origin,
        );

        if (guestName !== 'Quý khách') {
          url.searchParams.set('guest', guestName);
        }

        // Chỉ đổi URL, không reload/chuyển sang WeddingPage khác.
        window.history.replaceState(
          null,
          '',
          `${url.pathname}${url.search}`,
        );

        // WeddingPage phía sau đã render sẵn.
        setFinished(true);
      },
      reducedMotion ? 100 : INTRO_LENGTH_MS,
    );
  };

  if (finished) {
    return null;
  }

  return (
    <div
      className={`intro-cover ${opening ? 'intro-opening' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mở thiệp cưới Văn Hải và Kim Hường"
    >
      {/* =========================
          ENVELOPE INTRO
      ========================= */}

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
            />
          )}
        </div>
      </div>

      {/* =========================
          PAPER / BUTTERFLY
      ========================= */}

      <div
        className="intro-paper"
        aria-hidden={!opening}
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