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

    // ── Phát hiện WebView trong app (Zalo, Facebook, Messenger…) ──────────────
    // iOS WebView (WKWebView): UA KHÔNG chứa "Safari/" — đây là dấu hiệu tin cậy
    //   vì Mobile Safari LUÔN có "Safari/xxx.x" nhưng WKWebView thì không.
    // Android WebView: UA chứa flag "wv".
    // Trong WebView của Zalo, WKWebView được cấu hình allowsInlineMediaPlayback=false
    //   ở cấp native → mọi video.play() đều bị iOS đẩy ra native player.
    //   Giải pháp duy nhất: bỏ qua video, chỉ dùng CSS animation.
    const ua = navigator.userAgent;
    const isIOSWebView = /iP(hone|ad|od)/i.test(ua) && !/Safari\//i.test(ua);
    const isAndroidWebView = /Android/i.test(ua) && /wv\b/i.test(ua);

    if (isIOSWebView || isAndroidWebView) {
      // Môi trường bị giới hạn → bỏ video, CSS animation tự xử lý
      startTimeline();
      return;
    }
    // ──────────────────────────────────────────────────────────────────────────

    const video = videoRef.current;
    if (!video) {
      startTimeline();
      return;
    }

    // Gán src tại đây (không để src trong DOM) để Zalo quét trang
    // không thấy media URL nào → không mở native player.
    if (!video.src || video.src === window.location.href) {
      video.src = '/videos/envelope-open.mp4';
      video.load();
    }

    try {
      video.currentTime = 0;
      // Mở chậm từ từ, trang trọng theo kỹ thuật in-vitely (0.82x)
      video.playbackRate = 0.82;
    } catch {
      // ignore
    }

    video.onplaying = () => {
      startTimeline();
    };

    video.onended = () => {
      // Đảm bảo timeline đã chạy khi video kết thúc
      startTimeline();
    };

    void video.play().catch(() => {
      // Fallback nếu trình duyệt chặn autoplay video
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
            playsInline
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