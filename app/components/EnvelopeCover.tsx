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

  const [renderVideo, setRenderVideo] = useState(false);
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

  useEffect(() => {
    if (videoRef.current) {
      // Ép trực tiếp vào Native DOM, bỏ qua bộ lọc của React
      videoRef.current.setAttribute('playsinline', 'true');
      videoRef.current.setAttribute('webkit-playsinline', 'true');
      videoRef.current.muted = true;
    }
  }, [renderVideo]);

  // Preload video dưới dạng Blob URL:
  // blob: URL không chứa extension .mp4 → Zalo/WebView không nhận ra
  // là media file để intercept → video phát inline bình thường.
  const videoBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let blobUrl: string | null = null;
    fetch('/videos/envelope-open.mp4')
      .then((r) => r.blob())
      .then((blob) => {
        blobUrl = URL.createObjectURL(blob);
        videoBlobUrlRef.current = blobUrl;
      })
      .catch(() => { /* fallback sang URL thường */ });

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
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

    // 1. Kích hoạt render thẻ video vào DOM
    setRenderVideo(true);

    // 2. Đợi DOM cập nhật xong (50ms) rồi mới gán src và phát
    setTimeout(() => {
      const video = videoRef.current;
      if (!video) {
        startTimeline();
        return;
      }

      // Thiết lập thuộc tính chuẩn trực tiếp trên native DOM
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.muted = true;

      // Lắng nghe sự kiện nếu vô tình bị dính native player thì tắt đi
      const onNativePlayer = () => {
        video.pause();
        const v = video as HTMLVideoElement & { webkitExitFullscreen?: () => void };
        v.webkitExitFullscreen?.();
        startTimeline();
      };
      video.addEventListener('webkitbeginfullscreen', onNativePlayer, { once: true });

      // Nạp luồng video (Blob URL hoặc URL thường)
      const src = videoBlobUrlRef.current ?? '/videos/envelope-open.mp4';
      video.src = src;
      video.load();

      try {
        video.currentTime = 0;
        video.playbackRate = 0.82;
      } catch {
        /* ignore */
      }

      video.onplaying = () => startTimeline();
      video.onended = () => startTimeline();

      // Thực hiện phát
      void video
        .play()
        .then(() => {
          video.removeEventListener('webkitbeginfullscreen', onNativePlayer);
        })
        .catch((err) => {
          console.log('iOS Play Error: ', err);
          video.removeEventListener('webkitbeginfullscreen', onNativePlayer);
          startTimeline();
        });
    }, 50); // Độ trễ băm nhỏ giúp vượt qua bộ quét tự động của Zalo
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
          {/* Ảnh poster tĩnh hiển thị khi thẻ video chưa được mount */}
          <img
            src="/images/envelope-poster.jpg"
            alt=""
            className="intro-envelope-poster"
            draggable={false}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />

          {/* ==============================================================
              VIDEO MP4 MỞ THIỆP CHUẨN IN-VITELY
              - Chỉ khi bấm nút, thẻ video mới được sinh ra trong DOM.
              - Lúc trang vừa load: 100% không có thẻ <video> trong DOM,
                Zalo WebView iOS quét DOM hoàn toàn không tìm thấy video
                → triệt tiêu hoàn toàn lỗi tự động giật Native Player Fullscreen!
          ============================================================== */}
          {renderVideo && (
            <video
              ref={videoRef}
              poster="/images/envelope-poster.jpg"
              muted
              playsInline={true}
              webkit-playsinline=""
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            />
          )}

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