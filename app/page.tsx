
'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useMusic } from './components/MusicProvider';

export default function InvitationPage() {
  const router = useRouter();

  const { startMusic } = useMusic();

  const [opening, setOpening] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleOpen = () => {
    if (opening) return;

    // Quan trọng: phát nhạc ngay trong sự kiện click.
    startMusic();

    // Bắt đầu hiệu ứng mở thiệp.
    setOpening(true);

    // Đợi hiệu ứng chạy xong rồi chuyển trang.
    timerRef.current = setTimeout(() => {
      router.push('/thiep-cuoi');
    }, 1000);
  };

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#ede4da] px-4 py-10">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('/images/DUY08901.JPG')] bg-cover bg-center" />

      <div className="absolute inset-0 bg-[#271b1b]/60 backdrop-blur-[3px]" />

      {/* Invitation card */}
      <div
        className={`invitation-envelope relative z-10 w-full max-w-110 overflow-hidden border border-[#d6baaa] bg-[#faf7f0] p-3 shadow-[0_25px_80px_rgba(0,0,0,.3)] ${
          opening ? 'invitation-opening' : ''
        }`}
      >
        <div className="invitation-letter relative border border-[#dfcfc2] px-5 py-13 text-center sm:px-8 sm:py-16">

          <div className="mb-6 font-[var(--font-playfair)] text-3xl text-[#a17c6d]">
            ❧
          </div>

          <p className="text-[11px] font-semibold tracking-[0.3em] text-[#782f38]">
            THE WEDDING INVITATION
          </p>

          <p className="mt-8 font-[var(--font-playfair)] text-xl italic text-[#806e64]">
            Trân trọng kính mời
          </p>

          <h1 className="mt-6 font-[var(--font-playfair)] text-[clamp(40px,11vw,62px)] leading-[1.15] text-[#54272e]">
            Văn Hải

            <span className="my-2 block text-[0.55em] italic text-[#aa836f]">
              &
            </span>

            Kim Hường
          </h1>

          <div className="mx-auto my-8 h-px w-18 bg-[#c8b3a3]" />

          <p className="text-sm leading-relaxed text-[#806e64]">
            Sự hiện diện của bạn là niềm hạnh phúc
            <br />
            trong ngày vui của chúng mình.
          </p>

          <p className="mt-6 font-[var(--font-playfair)] text-lg tracking-[0.12em] text-[#782f38]">
            06 · 11 · 2026
          </p>

          <button
            type="button"
            onClick={handleOpen}
            disabled={opening}
            className="mt-10 min-h-12 border border-[#782f38] bg-[#782f38] px-8 py-3 text-xs font-semibold tracking-[0.18em] text-white uppercase transition-all duration-300 hover:bg-[#54272e] disabled:cursor-wait"
          >
            {opening ? 'Đang mở thiệp...' : 'Mở thiệp cưới ♡'}
          </button>

          <p className="mt-5 text-xs text-[#a17c6d]">
            ♪ Nhạc nền sẽ phát khi mở thiệp
          </p>

        </div>
      </div>
    </main>
  );
}
