'use client';

import {
  ArrowDownOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import SakuraPetals from './SakuraPetals';

import { Button, ConfigProvider } from 'antd';

import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import Gallery from './galerry';

type Wedding = {
  groom: string;
  bride: string;

  groomFamily: string[];
  brideFamily: string[];

  date: string;
  time: string;

  venue: string;
  address: string;

  countdownDate: string;
};

type GalleryPhoto = {
  src: string;
  alt: string;
};

interface WeddingPageProps {
  wedding: Wedding;
  gallery: GalleryPhoto[];
  mapsUrl: string | null;
  guestName?: string;
}

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const EMPTY_COUNTDOWN: Countdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const TIMELINE = [
  {
    time: '18:00',
    title: 'Đón khách',
    description:
      'Chào đón khách mời và cùng nhau lưu giữ những khoảnh khắc đầu tiên.',
    image: '/images/welcome.png',
  },
  {
    time: '18:30',
    title: 'Khai tiệc',
    description:
      'Cùng nâng ly chúc mừng và thưởng thức bữa tiệc chung vui.',
    image: '/images/dinner.png',
  },
  {
    time: 'Sau khai tiệc',
    title: 'Nhậu tới bến!',
    description:
      'Ăn hết mình, vui hết nấc và cùng nhau tạo nên những kỷ niệm đáng nhớ.',
    image: '/images/cheers.png',
  },
] as const;

function calculateCountdown(targetDate: string): Countdown {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const distance = target - now;

  if (!Number.isFinite(target) || distance <= 0) {
    return EMPTY_COUNTDOWN;
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

function Reveal({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`wedding-reveal ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

function CountdownItem({
  value,
  label,
}: {
  value: number | null;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <strong className="text-[28px] leading-none font-light tracking-[-0.03em] text-white tabular-nums sm:text-4xl md:text-[40px]">
        {value === null ? '--' : String(value).padStart(2, '0')}
      </strong>

      <span className="mt-2 text-[10px] font-medium tracking-[0.16em] text-white/80 uppercase sm:mt-3 sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

export default function WeddingPage({
  wedding,
  gallery,
  mapsUrl,
  guestName = 'Quý khách',
}: WeddingPageProps) {
  const [countdown, setCountdown] = useState<Countdown>(EMPTY_COUNTDOWN);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const update = () => {
      setCountdown(calculateCountdown(wedding.countdownDate));
      setReady(true);
    };

    update();

    const interval = window.setInterval(update, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [wedding.countdownDate]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#782f38',
          fontFamily: 'var(--font-be-vietnam, Arial), sans-serif',
          borderRadius: 2,
        },
      }}
    >
      <SakuraPetals />

      <main className="[font-family:var(--font-be-vietnam,Arial),sans-serif] overflow-x-hidden bg-[#faf7f0]">
        <section
          className="relative isolate h-svh min-h-167.5 max-h-230 overflow-hidden text-white"
          aria-label={`Thiệp cưới ${wedding.groom} và ${wedding.bride}`}
        >
          <div className="absolute inset-0 -z-20 scale-[1.01] bg-[url('/images/DUY08901.JPG')] bg-cover bg-[position:51%_center] md:bg-center" />

          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(25,20,18,.5)_0%,transparent_28%,rgba(25,20,18,.18)_48%,rgba(22,16,14,.86)_100%)]" />

          {/* <div className="absolute top-6 right-4.75 left-4.75 flex items-center justify-between pb-4 text-[9px] font-semibold tracking-[0.16em] [text-shadow:0_1px_10px_rgba(0,0,0,.45)] md:top-7.75 md:right-[4vw] md:left-[4vw] md:pb-5.25 md:text-[11px] md:tracking-[0.28em]">
            <span>THE WEDDING OF</span>
            <span>V · H & K · H</span>
          </div> */}

          <div className="absolute right-[4%] bottom-16 left-[4%] text-center [text-shadow:0_2px_22px_rgba(29,21,18,.7)] sm:bottom-20 md:right-[6%] md:bottom-24 md:left-[6%]">
            {/* <div
              className="flex items-center justify-center gap-3 [font-family:var(--font-be-vietnam,Arial),sans-serif] text-lg text-white/80"
              aria-hidden="true"
            >
              <span className="h-px w-10 bg-white/55 sm:w-14" />
              <span>✦</span>
              <span className="h-px w-10 bg-white/55 sm:w-14" />
            </div> */}

            <h1 className="mx-auto mt-3 mb-0 flex w-full flex-col items-center justify-center [font-family:var(--font-luxury-script),cursive] text-[clamp(40px,11vw,64px)] leading-[1.15] font-normal tracking-normal text-white sm:text-[68px] md:mt-4 md:text-[clamp(0px,7vw,80px)]">
              <span className="block">
                {wedding.groom}
              </span>

              <span className="my-0.5 block text-[0.55em] leading-none font-normal text-white/90 md:my-1">
                &amp;
              </span>

              <span className="block">
                {wedding.bride}
              </span>
            </h1>

            <p className="mt-3.5 mb-5 text-[10px] leading-snug italic text-white/95 sm:text-[17px] md:mt-5 md:mb-6 md:text-[clamp(18px,2vw,24px)]">
              Cùng chúng tôi viết tiếp câu chuyện yêu thương
            </p>

            <div
              className="mx-auto mb-5 flex w-full max-w-145 items-stretch justify-between rounded-2xl border border-white/15 bg-white/12 px-3 py-4 shadow-[0_10px_40px_rgba(0,0,0,.18)] backdrop-blur-[14px] backdrop-saturate-150 sm:mb-6 sm:rounded-3xl sm:px-5 sm:py-6 md:mb-7 md:px-6"
              aria-label="Bộ đếm ngược đến ngày cưới"
              aria-live="off"
            >
              <CountdownItem
                value={ready ? countdown.days : null}
                label="Ngày"
              />

              <span
                className="my-1 w-px self-stretch bg-white/25"
                aria-hidden="true"
              />

              <CountdownItem
                value={ready ? countdown.hours : null}
                label="Giờ"
              />

              <span
                className="my-1 w-px self-stretch bg-white/25"
                aria-hidden="true"
              />

              <CountdownItem
                value={ready ? countdown.minutes : null}
                label="Phút"
              />

              <span
                className="my-1 w-px self-stretch bg-white/25"
                aria-hidden="true"
              />

              <CountdownItem
                value={ready ? countdown.seconds : null}
                label="Giây"
              />
            </div>

            <a
              href="#loi-moi"
              className="inline-flex items-center gap-3 border border-white/85 px-4 py-3 text-[10px] font-medium tracking-[0.16em] uppercase transition-all duration-300 hover:bg-white hover:text-[#54272e] hover:[text-shadow:none] focus-visible:bg-white focus-visible:text-[#54272e] md:gap-4 md:px-6 md:py-3.5 md:text-xs"
            >
              Khám phá thiệp mời
              <ArrowDownOutlined className="hero-explore-icon" />
            </a>
          </div>
{/* 
          <div className="absolute right-4.75 bottom-4 left-4.75 flex items-center justify-between border-t border-white/40 pt-3 text-[8px] font-semibold tracking-[0.1em] [text-shadow:0_1px_10px_rgba(0,0,0,.45)] sm:text-[9px] md:right-[4vw] md:bottom-7 md:left-[4vw] md:pt-4 md:text-[11px] md:tracking-[0.28em]">
            <span>LOVE IS IN THE AIR</span>
            <span className="[font-family:var(--font-be-vietnam,Arial),sans-serif] text-xl font-normal md:text-3xl">
              ♡
            </span>
            <span>FOREVER BEGINS HERE</span>
          </div> */}
        </section>

        <section
          id="loi-moi"
          className="scroll-mt-6 mx-auto max-w-292.5 px-4.75 py-12 text-center md:px-6 md:py-18"
        >
          <Reveal>
            <div className="text-[11px] font-bold tracking-[0.32em] text-[#782f38]">
              A CELEBRATION OF LOVE
            </div>

          <div className="text-[42px] leading-none text-[#aa836f]">
            ❧
          </div>

          <div className="mx-auto my-10 grid max-w-205 grid-cols-1 items-center md:my-11.25 md:grid-cols-[1fr_80px_1fr]">
            <div className="px-3 py-3 md:py-5.5">
              <span className="text-xs font-bold tracking-[0.24em] text-[#782f38]">
                NHÀ TRAI
              </span>

              <div className="mx-auto my-3.25 h-px w-9.5 bg-[#bc9385] md:my-5.5" />

              <p className="m-0 text-[19px] leading-[1.7] text-[#54272e] md:text-[21px]">
                {wedding.groomFamily.map(
                  (member, index) => (
                    <span
                      key={`${member}-${index}`}
                    >
                      {member}

                      {index <
                        wedding.groomFamily.length -
                          1 && <br />}
                    </span>
                  ),
                )}
              </p>
            </div>

            <div
              className="my-2.5 text-[38px] leading-none italic text-[#a17c6d] md:my-0 md:text-[62px]"
              aria-hidden="true"
            >
              &
            </div>

            <div className="px-3 py-3 md:py-5.5">
              <span className="text-xs font-bold tracking-[0.24em] text-[#782f38]">
                NHÀ GÁI
              </span>

              <div className="mx-auto my-3.25 h-px w-9.5 bg-[#bc9385] md:my-5.5" />

              <p className="m-0 text-[19px] leading-[1.7] text-[#54272e] md:text-[21px]">
                {wedding.brideFamily.map(
                  (member, index) => (
                    <span
                      key={`${member}-${index}`}
                    >
                      {member}

                      {index <
                        wedding.brideFamily.length -
                          1 && <br />}
                    </span>
                  ),
                )}
              </p>
            </div>
          </div>

          <p className="mb-3 text-[16px] italic text-[#81756d]">
            Thân mời đến dự hôn lễ của chúng mình!
          </p>

        </Reveal>
        </section>

        <section
          className="relative h-120 overflow-hidden bg-[#d9cfbf] md:h-150"
          aria-label={`Ảnh cưới của ${wedding.groom} và ${wedding.bride}`}
        >
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="/images/DUY08862-bouquet.jpg"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover object-[50%_35%] transition-transform duration-500"
              />
            </div>

          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(39,25,19,.72),transparent_72%)] md:bg-[linear-gradient(90deg,transparent_32%,rgba(39,25,19,.52)_100%)]" />

          <div className="absolute right-[6%] bottom-8 left-[6%] z-10 text-center text-white [text-shadow:0_2px_15px_rgba(0,0,0,.45)] md:top-1/2 md:right-[7%] md:bottom-auto md:left-auto md:max-w-xl md:-translate-y-1/2 md:text-right">
            <span
              className="text-[86px] leading-[0.4] text-white/80"
              aria-hidden="true"
            >
              “
            </span>

            <p className="my-3 text-[19px] leading-[1.45] italic md:my-5 md:text-[clamp(30px,3vw,25px)]">
              Và rồi giữa muôn vàn cuộc gặp gỡ,
              <br />
              chúng mình đã tìm thấy nhau.
            </p>

            {/* <small className="text-[10px] tracking-[0.24em] text-white/90 md:text-[11px]">
              {wedding.groom.toUpperCase()}
              {'  &  '}
              {wedding.bride.toUpperCase()}
            </small> */}
          </div>
        </section>

        <section
          id="su-kien"
          className="scroll-mt-6 bg-[#f0eae0] px-4.75 py-16 text-center md:px-6 md:py-24"
        >
          <Reveal>
            <div className="relative mx-auto max-w-170 border border-[#c8b3a3] bg-[#faf7f0] px-6 py-10 shadow-[0_20px_60px_rgba(114,95,82,.08)] md:px-12 md:py-14">
              <div className="pointer-events-none absolute inset-1.75 border border-[#decfc4] md:inset-2.25" />

              <div className="relative">
                <div
                  className="mb-3 text-[28px] text-[#782f38]"
                  aria-hidden="true"
                >
                  ✦
                </div>

                <p className="mb-5 text-[12px] font-bold tracking-[0.3em] text-[#782f38]">
                  TIỆC BÁO HỶ
                </p>

                <div className="text-[18px] leading-tight text-[#54272e] md:text-[clamp(28px,4vw,38px)]">
                  {wedding.date || 'Ngày cưới sẽ được cập nhật'}
                </div>

                <div className="mx-auto my-6 h-px w-16 bg-[#c3a99b]" />

                <p className="mb-6 text-[16px] tracking-wide text-[#5b4d46] md:text-[17px]">
                  {wedding.time || 'Thời gian sẽ được cập nhật'}
                </p>

                <h3 className="mb-3 text-[24px] font-normal text-[#54272e] md:text-[26px]">
                  {wedding.venue || 'Địa điểm sẽ được cập nhật'}
                </h3>

                {wedding.address && (
                  <p className="mx-auto max-w-md text-[15px] leading-relaxed text-[#6a5c55] md:text-base">
                    {wedding.address}
                  </p>
                )}

                {mapsUrl ? (
                  <Button
                    type="primary"
                    icon={<EnvironmentOutlined />}
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-button"
                  >
                    Xem chỉ đường Google Maps
                  </Button>
                ) : (
                  <p className="mt-5 inline-flex items-center justify-center gap-2 text-[13px] leading-normal text-[#806e64] md:text-sm">
                    <EnvironmentOutlined />
                    <span>
                      Link chỉ đường sẽ hiển thị khi có địa chỉ tổ chức.
                    </span>
                  </p>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal className="relative mx-auto mt-10 max-w-170 border border-[#c8b3a3] bg-[#faf7f0] px-5 py-10 shadow-[0_20px_60px_rgba(114,95,82,.08)] sm:px-8 md:mt-14 md:px-12 md:py-14">
            <div className="pointer-events-none absolute inset-2 border border-[#decfc4]" />

            <div className="relative z-10 text-center">
              <div
                className="mb-3 text-3xl text-[#782f38]"
                aria-hidden="true"
              >
                ✦
              </div>

              <p className="text-[11px] font-semibold tracking-[0.3em] text-[#782f38]">
                WEDDING TIMELINE
              </p>

              <h3 className="mt-4 text-[28px] font-normal text-[#54272e] sm:text-4xl">
                Lịch trình bữa tiệc
              </h3>

              <p className="mt-3 text-sm text-[#81756d]">
                Cùng chúng mình tận hưởng từng khoảnh khắc nhé!
              </p>
            </div>

            <div className="relative z-10 mx-auto mt-12 max-w-lg">
              <div
                className="absolute top-8 bottom-8 left-9 w-px bg-[#c8b3a3] sm:left-11"
                aria-hidden="true"
              />

              <ol className="m-0 list-none p-0">
              {TIMELINE.map((item, index) => (
                <li
                  key={item.title}
                  className={`relative flex items-start gap-5 sm:gap-7 ${
                    index !== TIMELINE.length - 1 ? 'pb-11' : ''
                  }`}
                >
                  <div className="relative z-10 flex size-18 shrink-0 items-center justify-center rounded-full border border-[#decfc4] bg-[#faf7f0] p-2 shadow-[0_6px_18px_rgba(84,39,46,.06)] sm:size-22">
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1 pt-1 text-left">
                    <span className="text-[11px] font-semibold tracking-[0.16em] text-[#a17c6d] uppercase sm:text-sm">
                      {item.time}
                    </span>

                    <h4 className="mt-1 text-[22px] font-medium text-[#782f38] sm:text-[28px]">
                      {item.title}
                    </h4>

                    <p className="mt-2 text-[13px] leading-relaxed text-[#81756d] sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
              </ol>
            </div>

            <div className="relative z-10 mt-10 text-center">
              <span
                className="text-2xl text-[#a17c6d]"
                aria-hidden="true"
              >
                ❧
              </span>

              <p className="mt-2 text-lg italic text-[#782f38]">
                Hẹn gặp mọi người trong ngày vui của chúng mình!
              </p>
            </div>
          </Reveal>
        </section>

        {/* <Reveal className="mx-auto max-w-2xl px-4.75 py-4 text-center md:px-6">
          <div className="border-y border-[#e6d8cc] py-8 md:py-10">
            <p className="text-[11px] font-semibold tracking-[0.26em] text-[#a17c6d] uppercase">
              Thân mời
            </p>

            <p className="mt-3 [font-family:var(--font-be-vietnam,Arial),sans-serif] text-[clamp(18px,4.5vw,28px)] leading-snug text-[#782f38] wrap-break-word">
              {guestName} 
            </p>

            <p className="text-[11px] font-semibold tracking-[0.26em] text-[#a17c6d] uppercase">
            đến chung vui cùng chúng mình
            </p>
          </div>
        </Reveal> */}

        <Gallery gallery={gallery} />

{/* FOOTER */}
<footer className="relative overflow-hidden bg-[#54272e] px-5 pt-16 pb-8 text-[#fff6ed] sm:px-8 md:pt-20 md:pb-10">
  {/* =====================================
      DECORATIVE BACKGROUND
  ===================================== */}

  {/* Họa tiết sáng nhẹ góc trái */}
  <div
    aria-hidden="true"
    className="
      pointer-events-none
      absolute -top-20 -left-20
      size-52 rounded-full
      border border-[#d2b3a1]/15
      md:size-72
    "
  />

  <div
    aria-hidden="true"
    className="
      pointer-events-none
      absolute top-3 left-3
      size-36 rounded-full
      border border-[#d2b3a1]/10
      md:size-52
    "
  />

  {/* Họa tiết góc phải dưới */}
  <div
    aria-hidden="true"
    className="
      pointer-events-none
      absolute -right-24 -bottom-28
      size-60 rounded-full
      border border-[#d2b3a1]/15
      md:size-80
    "
  />

  {/* =====================================
      CONTENT
  ===================================== */}

  <div className="relative z-10 mx-auto max-w-4xl">
    {/* Ornament phía trên */}
    <div className="flex items-center justify-center gap-4 md:gap-6">
      <span className="h-px w-12 bg-[#d2b3a1]/50 sm:w-20 md:w-28" />

      <span
        aria-hidden="true"
        className="
          font-[var(--font-playfair)]
          text-[30px]
          leading-none
          text-[#d2b3a1]
          md:text-[36px]
        "
      >
        ❧
      </span>

      <span className="h-px w-12 bg-[#d2b3a1]/50 sm:w-20 md:w-28" />
    </div>

    {/* Nội dung cảm ơn */}
    <div className="mx-auto mt-7 max-w-xl text-center md:mt-9">
      {/* <p
        className="
          font-[var(--font-playfair)]
          text-[clamp(21px,5.5vw,30px)]
          leading-[1.4]
          font-normal
          italic
          text-[#fff6ed]
        "
      >
        Rất mong được gặp mọi người
        <br className="hidden sm:block" />
        {' '}tại bữa tiệc của chúng mình
      </p> */}

      <p
        className="
          mx-auto mt-4
          max-w-md
          text-[17px]
          leading-[1.8]
          font-semibold
          text-[#eadbd1]/75
          md:text-[20px]
        "
      >
        Sự hiện diện của mọi người sẽ là niềm vui
        và là món quà ý nghĩa đối với chúng mình.
      </p>
    </div>

    {/* =====================================
        COUPLE NAMES
    ===================================== */}

<div className="mt-10 text-center md:mt-12">
  <p
    className="
      mx-auto
      inline-flex
      max-w-full
      items-baseline
      justify-center
      whitespace-nowrap
      [font-family:var(--font-luxury-script),var(--font-playfair),cursive]
      text-[clamp(24px,7.5vw,54px)]
      leading-none
      font-normal
      tracking-[-0.02em]
      text-[#d2b3a1]
      sm:text-[clamp(30px,6vw,58px)]
      md:text-[32px]
    "
  >
    <span>{wedding.groom}</span>

    <span
      className="
        mx-1.5
        font-[var(--font-playfair)]
        text-[0.5em]
        font-normal
        italic
        text-[#eadbd1]/80
        sm:mx-2.5
      "
    >
      &amp;
    </span>

    <span>{wedding.bride}</span>
  </p>

  <div className="mt-5 flex items-center justify-center gap-3">
    <span className="h-px w-7 bg-[#d2b3a1]/40" />

    <span className="text-[10px] font-medium tracking-[0.24em] text-[#d2b3a1]/85 sm:text-[11px]">
      06 · 11 · 2026
    </span>

    <span className="h-px w-7 bg-[#d2b3a1]/40" />
  </div>
</div>

    {/* =====================================
        BOTTOM DECORATION
    ===================================== */}

    <div className="mt-12 border-t border-[#d2b3a1]/20 pt-6 md:mt-14">
      <div className="flex items-center justify-between gap-4">
        <span
          className="
            text-[8px]
            tracking-[0.18em]
            text-[#eadbd1]/45
            sm:text-[9px]
            sm:tracking-[0.24em]
          "
        >
          WITH LOVE
        </span>

        <span
          aria-hidden="true"
          className="
            font-[var(--font-playfair)]
            text-[18px]
            text-[#d2b3a1]/70
          "
        >
          ♡
        </span>

        <span
          className="
            text-right
            text-[8px]
            tracking-[0.18em]
            text-[#eadbd1]/45
            sm:text-[9px]
            sm:tracking-[0.24em]
          "
        >
          THANK YOU
        </span>
      </div>
    </div>
  </div>
</footer>
      </main>
    </ConfigProvider>
  );
}
