"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, type ReactNode } from "react";
import { focusRing } from "@/components/chrome/focus";
import { useRetryingImage } from "@/components/chrome/use-retrying-image";

type ImageZoomProps = {
  src: string;
  alt: string;
  /** Light team marks are stored as dark artwork and inverted in the thumbnail. */
  light?: boolean;
  className?: string;
  children: ReactNode;
};

function pointerIsOnBitmap(image: HTMLImageElement, clientX: number, clientY: number): boolean {
  const { naturalWidth, naturalHeight } = image;
  if (!naturalWidth || !naturalHeight) return false;
  const rect = image.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;
  const scale = Math.min(rect.width / naturalWidth, rect.height / naturalHeight);
  const drawnWidth = naturalWidth * scale;
  const drawnHeight = naturalHeight * scale;
  const left = rect.left + (rect.width - drawnWidth) / 2;
  const top = rect.top + (rect.height - drawnHeight) / 2;
  return clientX >= left && clientX <= left + drawnWidth && clientY >= top && clientY <= top + drawnHeight;
}

export function ImageZoom({ src, alt, light = false, className = "", children }: ImageZoomProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);
  const { attempt, onError, reset } = useRetryingImage(src);
  const t = useTranslations("Common");
  const label = alt.trim() || t("photo");

  const open = () => {
    reset();
    setVisible(true);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <button
        type="button"
        className={`cursor-zoom-in border-0 bg-transparent p-0 text-inherit ${className} ${focusRing}`}
        aria-label={t("viewOriginal", { label })}
        onClick={open}
      >
        {children}
      </button>
      <dialog
        ref={dialogRef}
        className={`fixed inset-0 z-50 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 p-0 backdrop:bg-black/80 ${
          light ? "bg-white" : "bg-black"
        }`}
        aria-label={t("original", { label })}
        onClose={() => setVisible(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        {visible ? (
          // The stored file, without the thumbnail crop or the light-logo invert.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={attempt}
            src={src}
            alt={alt}
            className="h-dvh w-screen object-contain"
            onError={onError}
            onClick={(event) => {
              if (!(event.currentTarget instanceof HTMLImageElement)) return;
              if (!pointerIsOnBitmap(event.currentTarget, event.clientX, event.clientY)) {
                dialogRef.current?.close();
              }
            }}
          />
        ) : null}
        <button
          type="button"
          className={`absolute end-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
            light ? "bg-black/10 text-black" : "bg-white/10 text-white"
          } ${focusRing}`}
          onClick={() => dialogRef.current?.close()}
        >
          {t("close")}
        </button>
      </dialog>
    </>
  );
}
