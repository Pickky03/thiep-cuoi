
'use client';

import { useEffect, useRef, useState } from 'react';

import {
  SoundOutlined,
  MutedOutlined,
} from '@ant-design/icons';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [error, setError] = useState(false);

  // Thiết lập âm lượng ban đầu
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.8;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        setError(false);

        await audio.play();
      } catch (err) {
        console.error('Không thể phát nhạc:', err);
        setError(true);
      }
    } else {
      audio.pause();
    }
  };

  return (
    <>
      {/* Background audio */}
      <audio
        ref={audioRef}
        src="/music/nhac nen.mp3"
        loop
        preload="auto"
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setError(true)}
      />

      {/* Floating music button */}
      <div
        className="
          fixed
          right-4
          bottom-5
          z-40

          flex
          flex-col
          items-end
          gap-2

          sm:right-6
          sm:bottom-6
        "
      >
        {error && (
          <p
            role="status"
            className="
              rounded-lg
              bg-white/95
              px-3
              py-2
              text-xs
              text-[#782f38]
              shadow-md
            "
          >
            Không thể tải nhạc nền
          </p>
        )}

        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
          aria-pressed={isPlaying}
          className="
            group

            flex
            items-center
            gap-2.5

            rounded-full

            border
            border-white/50

            bg-[#782f38]/90

            px-4
            py-3

            text-white

            shadow-[0_5px_25px_rgba(0,0,0,.2)]

            backdrop-blur-md

            transition-all
            duration-300

            hover:scale-105
            hover:bg-[#54272e]

            active:scale-95

            sm:px-5
          "
        >
          {/* Icon */}
          <span className="relative flex size-5 items-center justify-center">
            {isPlaying ? (
              <SoundOutlined className="text-lg" />
            ) : (
              <MutedOutlined className="text-lg" />
            )}
          </span>

          {/* Text */}
          <span className="text-xs font-medium tracking-wide sm:text-sm">
            {isPlaying ? 'Đang phát nhạc' : 'Bật nhạc'}
          </span>

          {/* Playing indicator */}
          {isPlaying && (
            <span
              aria-hidden="true"
              className="flex h-4 items-end gap-0.5"
            >
              <span className="h-2 w-0.75 animate-pulse rounded-full bg-white" />
              <span className="h-4 w-0.75 animate-pulse rounded-full bg-white [animation-delay:150ms]" />
              <span className="h-2.5 w-0.75 animate-pulse rounded-full bg-white [animation-delay:300ms]" />
            </span>
          )}
        </button>
      </div>
    </>
  );
}
