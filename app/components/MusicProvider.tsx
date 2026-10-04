'use client';

import {
  createContext,
  useContext,
  useEffect,
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
  // Dung new Audio() thay vi the <audio> trong DOM.
  // Zalo WebView quet DOM tim the <audio> va intercept thanh native player.
  // Khi tao bang JS thuan (khong append vao DOM), Zalo khong detect duoc.
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const pathname = usePathname();

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio('/music/nhac-nen.mp3');
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = 'none';

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    void audio.play().catch(() => {
      console.warn('Trinh duyet chua cho phep phat nhac.');
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
      {/* Khong co the <audio> trong DOM - Zalo se khong intercept */}
      {children}

      {pathname.startsWith('/thiep-cuoi') && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Tat nhac nen' : 'Bat nhac nen'}
          aria-pressed={isPlaying}
          className="fixed right-4 bottom-5 z-50 flex items-center gap-2 rounded-full border border-white/50 px-4 py-3 text-sm text-white shadow-lg transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
        >
          {isPlaying ? <SoundOutlined /> : <MutedOutlined />}
        </button>
      )}
    </MusicContext.Provider>
  );
}
