
'use client';

import { useState } from 'react';

export default function TaoThiepPage() {
  const [guestName, setGuestName] = useState('');
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    const name = guestName.trim();

    if (!name) return;

    const url = new URL('/', window.location.origin);

    url.searchParams.set('guest', name);

    setLink(url.toString());
    setCopied(false);
  };

  const copyLink = async () => {
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      setCopied(false);
      alert('Không thể sao chép tự động. Hãy chọn và sao chép đường link.');
    }
  };

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#faf7f0] px-4 py-12">
      <div className="w-full max-w-lg border border-[#c8b3a3] bg-white p-6 shadow-xl sm:p-9">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-[#782f38]">
            WEDDING INVITATION
          </p>

          <h1 className="mt-4 font-[var(--font-playfair)] text-4xl text-[#54272e]">
            Tạo link thiệp mời
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#806e64]">
            Văn Hải &amp; Kim Hường
          </p>
        </div>

        <div className="mt-9">
          <label
            htmlFor="guest-name"
            className="mb-2 block text-sm font-medium text-[#54272e]"
          >
            Tên khách mời
          </label>

          <input
            id="guest-name"
            type="text"
            value={guestName}
            maxLength={80}
            onChange={(event) => {
              setGuestName(event.target.value);
              setLink('');
              setCopied(false);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                generateLink();
              }
            }}
            placeholder="Ví dụ: Bạn Hải"
            className="w-full rounded-md border border-[#c8b3a3] bg-[#faf7f0] px-4 py-3 text-base text-[#54272e] outline-none focus:border-[#782f38]"
          />

          <button
            type="button"
            onClick={generateLink}
            disabled={!guestName.trim()}
            className="mt-5 w-full rounded-md bg-[#782f38] px-5 py-3 font-medium text-white transition hover:bg-[#54272e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tạo link thiệp mời
          </button>
        </div>

        {link && (
          <div className="mt-7 border-t border-[#e8dcd3] pt-6">
            <p className="mb-3 text-sm font-medium text-[#54272e]">
              Link dành cho {guestName.trim()}
            </p>

            <div className="rounded-md bg-[#faf7f0] p-3">
              <p className="break-all text-sm leading-relaxed text-[#6f625c]">
                {link}
              </p>
            </div>

            <button
              type="button"
              onClick={copyLink}
              className="mt-4 w-full rounded-md border border-[#782f38] px-5 py-3 font-medium text-[#782f38] transition hover:bg-[#782f38] hover:text-white"
            >
              {copied ? 'Đã sao chép ✓' : 'Sao chép link'}
            </button>

            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center text-sm text-[#782f38] underline underline-offset-4"
            >
              Xem thử thiệp
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
