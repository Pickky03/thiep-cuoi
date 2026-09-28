'use client';

import { useState } from 'react';

import {
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';

import {
  Button,
  Modal,
} from 'antd';

type GalleryPhoto = {
  src: string;
  alt: string;
};

interface GalleryProps {
  gallery: GalleryPhoto[];
}

export default function Gallery({
  gallery,
}: GalleryProps) {
  const [activePhoto, setActivePhoto] =
    useState<number | null>(null);

  const shiftPhoto = (direction: number) => {
    setActivePhoto((current) => {
      if (
        current === null ||
        gallery.length === 0
      ) {
        return null;
      }

      return (
        (current + direction + gallery.length) %
        gallery.length
      );
    });
  };

  const getItemClassName = (index: number) => {
    const base =
      'group relative cursor-pointer overflow-hidden border-0 bg-[#e4d9cd] p-0';

    const classes: Record<number, string> = {
      0: 'row-span-2',

      3: 'row-span-2 max-sm:col-start-2',

      4: 'max-sm:col-start-1 max-sm:row-start-4',

      5: 'max-sm:col-span-2 max-sm:col-start-1 max-sm:row-start-5',
    };

    return `${base} ${classes[index] ?? ''}`;
  };

  const getImageClassName = (index: number) => {
    const base =
      'block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105';

    const positions: Record<number, string> = {
      1: 'object-[50%_35%]',
      2: 'object-[50%_29%]',
      4: 'object-[50%_30%]',
    };

    return `${base} ${positions[index] ?? ''}`;
  };

  return (
    <>
      <section
        id="album"
        className="mx-auto max-w-325 px-4.75 py-18.5 text-center md:px-6 md:py-27.5"
      >
        <div className="text-xs font-bold tracking-[0.3em] text-[#782f38]">
          OUR LITTLE MOMENTS
        </div>

        <h5 className="mx-auto mt-4.5 mb-2.5 font-[var(--font-playfair)] text-[clamp(29px,9vw,31px)] leading-tight font-normal tracking-[-0.04em] text-[#54272e] md:text-[clamp(32px,5vw,52px)]">
          Một chút chuyện của chúng mình{' '}
          
        </h5>

        <p className="mx-auto max-w-162.5 text-base leading-[1.85] text-[#6f625c] md:text-[17px]">
          Những khung hình lưu lại hành trình trước ngày chung đôi.
        </p>

        <div className="mx-auto mt-13.75 mb-5 grid auto-rows-55 grid-cols-2 gap-2 md:auto-rows-87.5 md:grid-cols-3 md:gap-3.25">
          {gallery.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className={getItemClassName(index)}
              onClick={() => setActivePhoto(index)}
              aria-label={`Xem ảnh ${index + 1}: ${photo.alt}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className={getImageClassName(index)}
              />

              <span className="absolute right-0 bottom-0 left-0 flex justify-between bg-linear-to-t from-black/60 to-transparent px-5 pt-9 pb-4 text-left text-[11px] font-medium tracking-[0.16em] text-white opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                XEM ẢNH

                <span>↗</span>
              </span>
            </button>
          ))}
        </div>

        <p className="mt-6 text-[11px] tracking-[0.2em] text-[#8b7f77]">
          01 — {String(gallery.length).padStart(2, '0')} / KHOẢNH KHẮC CỦA CHÚNG MÌNH
        </p>
      </section>

      <Modal
        open={activePhoto !== null}
        onCancel={() => setActivePhoto(null)}
        footer={null}
        centered
        width="min(90vw, 750px)"
        destroyOnHidden
        className="photo-modal"
      >
        {activePhoto !== null &&
          gallery[activePhoto] && (
            <div className="photo-viewer">
              <img
                src={gallery[activePhoto].src}
                alt={gallery[activePhoto].alt}
                className="mx-auto block h-auto max-h-[75vh] max-w-full object-contain"
              />

              <div className="flex items-center justify-center gap-7.5 pt-3.75 text-[13px] tracking-[0.18em] text-[#54272e]">
                <Button
                  aria-label="Ảnh trước"
                  icon={<LeftOutlined />}
                  onClick={() => shiftPhoto(-1)}
                />

                <span>
                  {String(activePhoto + 1).padStart(2, '0')}
                  {' / '}
                  {String(gallery.length).padStart(2, '0')}
                </span>

                <Button
                  aria-label="Ảnh sau"
                  icon={<RightOutlined />}
                  onClick={() => shiftPhoto(1)}
                />
              </div>
            </div>
          )}
      </Modal>
    </>
  );
}