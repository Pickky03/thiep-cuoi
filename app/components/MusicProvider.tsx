
'use client';

import {
  createContext,
  useContext,
  useRef,
  useState,
} from 'react';

import {
  SoundOutlined,
  MutedOutlined,
} from '@ant-design/icons';

import { usePathname } from 'next/navigation';

interface MusicContextType {
  startMusic: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function useMusic() {
  const context = useContext(MusicContext);

  if (!context) {
    throw new Error('useMusic must be used inside MusicProvider');
  }

  return context;
}

export default function MusicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const pathname = usePathname();

  const [isPlaying, setIsPlaying] = useState(false);

  const startMusic = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.35;

    // Gọi trực tiếp khi khách nhấn nút mở thiệp.
    void audio.play().catch(() => {
      console.warn('Trình duyệt chưa cho phép phát nhạc.');
    });
  };

  const toggleMusic = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      startMusic();
    } else {
      audio.pause();
    }
  };

  return (
    <MusicContext.Provider value={{ startMusic }}>
      {/* playsInline + x-webkit-airplay="deny": bắt buộc phát inline trong WebView Zalo,
          ngăn Zalo/iOS mở native media player.
          preload="none": không tải trước, tránh Zalo intercept media stream khi load trang. */}
      <audio
        ref={audioRef}
        src="/music/nhac-nen.mp3"
        loop
        preload="none"
        playsInline
        // @ts-expect-error – thuộc tính WebKit không chuẩn, cần thiết cho Zalo iOS
        x-webkit-airplay="deny"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {children}

      {/* Chỉ hiện nút điều khiển tại trang thiệp cưới */}
      {pathname.startsWith('/thiep-cuoi') && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
          aria-pressed={isPlaying}
          className="fixed right-4 bottom-5 z-50 flex items-center gap-2 rounded-full border border-white/50  px-4 py-3 text-sm text-white shadow-lg transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
        >
          {isPlaying ? <SoundOutlined /> : <MutedOutlined />}

          {/* <span>
            {isPlaying ? 'Đang phát nhạc' : 'Bật nhạc'}
          </span> */}
        </button>
      )}
    </MusicContext.Provider>
  );
}
