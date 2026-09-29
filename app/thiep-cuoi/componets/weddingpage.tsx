'use client';

import {
  ArrowDownOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import SakuraPetals from './SakuraPetals';

import {
  Button,
  ConfigProvider,
} from 'antd';

import {
  useEffect,
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

function calculateCountdown(
  targetDate: string,
): Countdown {
  const target = new Date(targetDate).getTime();
  const now = Date.now();

  const distance = target - now;

  if (distance <= 0) {
    return EMPTY_COUNTDOWN;
  }

  return {
    days: Math.floor(
      distance / (1000 * 60 * 60 * 24),
    ),

    hours: Math.floor(
      (distance / (1000 * 60 * 60)) % 24,
    ),

    minutes: Math.floor(
      (distance / (1000 * 60)) % 60,
    ),

    seconds: Math.floor(
      (distance / 1000) % 60,
    ),
  };
}

function CountdownItem({
  value,
  label,
}: {
  value: number | null;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-start">
      <strong className="font-[var(--font-be-vietnam)] text-[30px] leading-none font-light tracking-[-0.03em] text-white sm:text-4xl md:text-[40px]">
        {value === null
          ? '--'
          : String(value).padStart(2, '0')}
      </strong>

      <span className="mt-3 text-[11px] font-normal text-white/90 sm:text-[13px]">
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
  const [countdown, setCountdown] =
    useState<Countdown>(EMPTY_COUNTDOWN);

  const [ready, setReady] =
    useState(false);

  useEffect(() => {
    const update = () => {
      setCountdown(
        calculateCountdown(
          wedding.countdownDate,
        ),
      );

      setReady(true);
    };

    update();

    const interval =
      window.setInterval(
        update,
        1000,
      );

    return () => {
      window.clearInterval(interval);
    };
  }, [wedding.countdownDate]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#782f38',

          fontFamily:
            'var(--font-be-vietnam), Arial, sans-serif',

          borderRadius: 2,
        },
      }}
    >
        {/* Hiệu ứng hoa anh đào */}
    <SakuraPetals />


      <main className="overflow-x-hidden bg-[#faf7f0]">
        {/* HERO */}

        <section
          className="relative isolate h-svh min-h-167.5 max-h-230 overflow-hidden text-white"
          aria-label={`Thiệp cưới ${wedding.groom} và ${wedding.bride}`}
        >
          <div className="absolute inset-0 -z-20 scale-[1.01] bg-[url('/images/DUY08901.JPG')] bg-cover bg-[position:51%_center] md:bg-center" />

          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(25,20,18,.45)_0%,transparent_25%,rgba(25,20,18,.12)_44%,rgba(30,21,18,.78)_100%)]" />

          {/* TOPLINE */}

          <div className="absolute top-6 right-4.75 left-4.75 flex items-center justify-between border-b border-white/50 pb-4 text-[9px] font-semibold tracking-[0.14em] [text-shadow:0_1px_10px_rgba(0,0,0,.45)] md:top-7.75 md:right-[4vw] md:left-[4vw] md:pb-5.25 md:text-[11px] md:tracking-[0.28em]">
            <span>
              THE WEDDING OF
            </span>

            <span>
              V · H & K · H
            </span>
          </div>

          {/* HERO CONTENT */}

          <div className="absolute right-[3%] bottom-19.5 left-[3%] text-center [text-shadow:0_2px_22px_rgba(29,21,18,.7)] sm:bottom-23.75 md:right-[6%] md:bottom-27.5 md:left-[6%]">
            <div className="flex items-center justify-center gap-3 font-[var(--font-playfair)] text-[23px]">
              <span className="h-px w-13.75 bg-white/60" />

              <span>✦</span>

              <span className="h-px w-13.75 bg-white/60" />
            </div>

          

        
<h1
  className="
    mx-auto my-0
    flex w-full flex-col
    items-center justify-center
    font-[var(--font-playfair)]
    text-[clamp(38px,10vw,54px)]
    leading-[1.05]
    font-medium
    tracking-[-0.035em]
    text-white
    sm:text-[60px]
    md:text-[clamp(68px,6vw,96px)]
  "
>
  {/* Chú rể */}
  <span className="block">
    {wedding.groom}
  </span>

  {/* Dấu & nằm chính giữa */}
  <span
    className="
      my-1 block
      font-[var(--font-playfair)]
      text-[0.42em]
      leading-none
      font-medium
      italic
      text-white/90
      md:my-2
    "
  >
    &amp;
  </span>

  {/* Cô dâu */}
  <span className="block">
    {wedding.bride}
  </span>
</h1>


            <p className="mt-3.75 mb-4.5 font-[var(--font-playfair)] text-base leading-snug italic sm:text-[17px] md:mt-5 md:mb-5 md:text-[clamp(18px,2vw,24px)]">
              Cùng chúng tôi viết tiếp câu chuyện yêu thương
            </p>

            {/* COUNTDOWN */}

            <div
              className="mx-auto mb-6 flex w-full max-w-145 items-stretch justify-between rounded-3xl border border-white/10 bg-white/20 px-4 py-5 shadow-[0_10px_40px_rgba(0,0,0,.12)] backdrop-blur-[10px] backdrop-saturate-150 sm:px-5 sm:py-6 md:mb-7 md:px-6"
              aria-label="Bộ đếm ngược đến ngày cưới"
            >
              <CountdownItem
                value={
                  ready
                    ? countdown.days
                    : null
                }
                label="Ngày"
              />

              <CountdownItem
                value={
                  ready
                    ? countdown.hours
                    : null
                }
                label="Giờ"
              />

              <CountdownItem
                value={
                  ready
                    ? countdown.minutes
                    : null
                }
                label="Phút"
              />

              <CountdownItem
                value={
                  ready
                    ? countdown.seconds
                    : null
                }
                label="Giây"
              />
            </div>

            <a
              href="#loi-moi"
              className="inline-flex items-center gap-4 border border-white px-4 py-3 text-[10px] font-medium tracking-[0.16em] uppercase transition-all duration-300 hover:bg-white hover:text-[#54272e] hover:[text-shadow:none] md:px-6 md:py-3.5 md:text-xs"
            >
              Khám phá thiệp mời

              <ArrowDownOutlined />
            </a>
          </div>

          {/* BOTTOM LINE */}

          <div className="absolute right-4.75 bottom-4.5 left-4.75 flex items-center justify-between border-t border-white/50 pt-3 text-[9px] font-semibold tracking-[0.12em] [text-shadow:0_1px_10px_rgba(0,0,0,.45)] md:right-[4vw] md:bottom-7 md:left-[4vw] md:pt-4 md:text-[11px] md:tracking-[0.28em]">
            <span>
              LOVE IS IN THE AIR
            </span>

            <span className="text-lg font-normal md:text-2xl">
              ♡
            </span>

            <span>
              FOREVER BEGINS HERE
            </span>
          </div>
        </section>

        {/* INVITATION */}

        <section
          id="loi-moi"
          className="mx-auto max-w-292.5 px-4.75 py-10 text-center md:px-6 md:py-15"
        >
          <div className="text-xs font-bold tracking-[0.3em] text-[#782f38]">
            A CELEBRATION OF LOVE
          </div>

          <div className="my-5 font-[var(--font-playfair)] text-[42px] leading-none text-[#aa836f]">
            ❧
          </div>

          {/* <span className="mx-auto mb-7 font-[var(--font-playfair)] text-[clamp(10px,9vw,22px)] leading-tight font-semibold tracking-[-0.04em] text-[#54272e] md:text-[clamp(20px,5vw,22px)]">
            Ngày chúng mình về chung một nhà{' '}

            
          </span> */}

          <div className="mx-auto mt-8 max-w-lg text-center">
  <p className="text-xs font-semibold tracking-[0.22em] text-[#a17c6d]">
    Trân Trọng Kính Mời
  </p>

  <h3 className="mt-3 font-[var(--font-playfair)] text-[clamp(25px,6vw,38px)] font-normal leading-snug text-[#782f38] wrap-break-word">
    {guestName}
  </h3>

  <div className="mx-auto mt-5 h-px w-16 bg-[#c8b3a3]" />
</div>

          {/* FAMILY */}

          <div className="mx-auto my-10 grid max-w-205 grid-cols-1 items-center md:my-17.25 md:grid-cols-[1fr_80px_1fr]">
            <div className="px-3 py-3 md:py-5.5">
              <span className="text-xs font-bold tracking-[0.24em] text-[#782f38]">
                NHÀ TRAI
              </span>

              <div className="mx-auto my-3.25 h-px w-9.5 bg-[#bc9385] md:my-5.5" />

              <p className="m-0 font-[var(--font-playfair)] text-[19px] leading-[1.7] text-[#54272e] md:text-[21px]">
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
              className="my-2.5 font-[var(--font-playfair)] text-[38px] leading-none italic text-[#a17c6d] md:my-0 md:text-[62px]"
              aria-hidden="true"
            >
              &
            </div>

            <div className="px-3 py-3 md:py-5.5">
              <span className="text-xs font-bold tracking-[0.24em] text-[#782f38]">
                NHÀ GÁI
              </span>

              <div className="mx-auto my-3.25 h-px w-9.5 bg-[#bc9385] md:my-5.5" />

              <p className="m-0 font-[var(--font-playfair)] text-[19px] leading-[1.7] text-[#54272e] md:text-[21px]">
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

          <p className="mb-3 font-[var(--font-playfair)] text-[16px] italic text-[#81756d]">
            Thân mời đến dự hôn lễ của chúng mình!
          </p>

          <div className="flex items-center justify-center gap-2.5 font-[var(--font-playfair)] font-medium text-[clamp(31px,8vw,46px)] text-[#782f38] md:gap-6.5 md:text-[clamp(28px,5vw,48px)]">
            <span>
              {wedding.groom}
            </span>

            <i className="text-[17px] md:text-[23px]">
              ♡
            </i>

            <span>
              {wedding.bride}
            </span>
          </div>
        </section>

        {/* PORTRAIT */}

        <section
          className="relative h-120 overflow-hidden bg-[#d9cfbf] md:h-150"
          aria-label={`Ảnh cưới của ${wedding.groom} và ${wedding.bride}`}
        >
          <div className="absolute inset-0 bg-[url('/images/DUY08862.JPG')] bg-cover bg-[position:19%_center] md:bg-[position:center_65%]" />

          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(39,25,19,.65),transparent_70%)] md:bg-[linear-gradient(90deg,transparent_35%,rgba(39,25,19,.48)_100%)]" />

          <div className="absolute right-[5%] bottom-8.75 left-[5%] z-10 text-center text-white [text-shadow:0_2px_15px_rgba(0,0,0,.45)] md:top-1/2 md:right-[7%] md:bottom-auto md:left-auto md:-translate-y-1/2">
            <span className="font-[var(--font-playfair)] text-[90px] leading-[0.6]">
              “
            </span>

            <p className="my-3 font-[var(--font-playfair)] text-[20px] leading-[1.4] italic md:my-6 md:text-[clamp(27px,3vw,43px)]">
              Và rồi giữa muôn vàn cuộc gặp gỡ,
              <br />
              chúng mình đã tìm thấy nhau.
            </p>

            <small className="text-[11px] tracking-[0.22em]">
              {wedding.groom.toUpperCase()}
              {' & '}
              {wedding.bride.toUpperCase()}
            </small>
          </div>
        </section>

        {/* EVENT */}

        <section
          id="su-kien"
          className="bg-[#f0eae0] px-4.75 py-18.5 text-center md:px-6 md:py-27.5"
        >
          <div className="text-xs font-bold tracking-[0.3em] text-[#782f38]">
            SAVE THE DATE
          </div>

          <h2 className="mx-auto mt-4 mb-10.5 font-[var(--font-playfair)] text-[clamp(29px,9vw,41px)] leading-tight font-normal tracking-[-0.04em] text-[#54272e] md:text-[clamp(32px,5vw,52px)]">
            Hẹn gặp bạn trong ngày vui{' '}

            
          </h2>

          <div className="relative mx-auto max-w-170 border border-[#c8b3a3] bg-[#faf7f0] px-6 py-9.5 shadow-[0_20px_60px_rgba(114,95,82,.08)] md:px-10 md:py-11.5 md:pb-13.75">
            <div className="pointer-events-none absolute inset-1.75 border border-[#decfc4] md:inset-2.25" />

            <div className="mb-4.5 font-[var(--font-playfair)] text-[31px] text-[#782f38]">
              ✦
            </div>

            <p className="mb-5.75 text-[13px] font-bold tracking-[0.27em] text-[#782f38]">
              LỄ THÀNH HÔN
            </p>

            <div className="font-[var(--font-playfair)] text-[29px] leading-tight text-[#54272e] md:text-[clamp(20px,4vw,35px)]">
              {wedding.date ||
                'Ngày cưới sẽ được cập nhật'}
            </div>

            <div className="mx-auto my-6.25 h-px w-20.5 bg-[#c3a99b]" />

            <p className="mb-5.5 text-[17px] text-[#5b4d46]">
              {wedding.time ||
                'Thời gian sẽ được cập nhật'}
            </p>

            <h3 className="mb-3.5 font-[var(--font-playfair)] text-[25px] font-normal text-[#54272e]">
              {wedding.venue ||
                'Địa điểm sẽ được cập nhật'}
            </h3>

            {wedding.address && (
              <p className="text-base leading-relaxed text-[#6a5c55]">
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
              <p className="mt-4.5 inline-flex items-center gap-2 text-[13px] leading-normal text-[#806e64] md:text-sm">
                <EnvironmentOutlined />

                <span>
                  Link chỉ đường sẽ hiển thị khi có địa chỉ tổ chức.
                </span>
              </p>
            )}
          </div>
{/* WEDDING TIMELINE */}

<div className="relative mx-auto mt-10 max-w-170 border border-[#c8b3a3] bg-[#faf7f0] px-5 py-10 shadow-[0_20px_60px_rgba(114,95,82,.08)] sm:px-8 md:mt-14 md:px-12 md:py-14">

  {/* Decorative border */}
  <div className="pointer-events-none absolute inset-2 border border-[#decfc4]" />

  {/* Heading */}
  <div className="relative z-10 text-center">

    <div className="mb-3 font-[var(--font-playfair)] text-3xl text-[#782f38]">
      ✦
    </div>

    <p className="text-xs font-semibold tracking-[0.3em] text-[#782f38]">
      WEDDING TIMELINE
    </p>

    <h3 className="mt-4 font-[var(--font-playfair)] text-3xl font-normal text-[#54272e] sm:text-4xl">
      Lịch trình bữa tiệc
    </h3>

    <p className="mt-3 text-sm text-[#81756d]">
      Cùng chúng mình tận hưởng từng khoảnh khắc nhé!
    </p>

  </div>

  {/* Timeline */}
  <div className="relative z-10 mx-auto mt-12 max-w-lg">

    {/* Connecting line */}
    <div className="absolute top-8 bottom-8 left-9 w-px bg-[#c8b3a3] sm:left-11" />

    {[
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
    ].map((item, index) => (
      <div
        key={item.title}
        className={`relative flex items-start gap-5 sm:gap-7 ${
          index !== 2 ? 'pb-12' : ''
        }`}
      >

        {/* Illustration */}
        <div className="relative z-10 flex size-18 shrink-0 items-center justify-center rounded-full border border-[#decfc4] bg-[#faf7f0] p-2 shadow-sm sm:size-22">

          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-contain"
          />

        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 pt-1 text-left">

          <span className="text-xs font-semibold tracking-[0.15em] text-[#a17c6d] sm:text-sm">
            {item.time}
          </span>

          <h4 className="mt-1 font-[var(--font-playfair)] text-2xl font-medium text-[#782f38] sm:text-[28px]">
            {item.title}
          </h4>

          <p className="mt-2 text-[13px] leading-relaxed text-[#81756d] sm:text-sm">
            {item.description}
          </p>

        </div>

      </div>
    ))}

  </div>

  {/* Bottom decoration */}
  <div className="relative z-10 mt-10 text-center">

    <span className="font-[var(--font-playfair)] text-2xl text-[#a17c6d]">
      ❧
    </span>

    <p className="mt-2 font-[var(--font-playfair)] text-lg italic text-[#782f38]">
      Hẹn gặp bạn trong ngày vui của chúng mình!
    </p>

  </div>

</div>
        </section>
        

        <Gallery gallery={gallery} />

        {/* FOOTER */}

        <footer className="bg-[#54272e] px-6 py-14.5 text-center text-[#fff6ed]">
          <span className="font-[var(--font-playfair)] text-[42px] text-[#d2b3a1]">
            ❧
          </span>

          <p className="my-4 font-[var(--font-playfair)] text-[22px] italic">
            Rất mong được gặp bạn
          </p>

          <div className="font-[var(--font-playfair)] font-stretch-50% text-[clamp(24px,4vw,44px)]">
            {wedding.groom}{' '}

            <em className="text-[0.65em]">
              &
            </em>{' '}

            {wedding.bride}
          </div>

          <small className="mt-7 block text-[10px] tracking-[0.23em] text-[#cfb8ad]">
            THANK YOU FOR BEING PART OF OUR STORY
          </small>
        </footer>
      </main>
    </ConfigProvider>
  );
}