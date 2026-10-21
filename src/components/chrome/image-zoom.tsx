"use client";

import { useRef, type ReactNode } from "react";
import { focusRing } from "@/components/chrome/focus";

type ImageZoomProps = {
  src: string;
  alt: string;
  /** Light team marks are stored as dark artwork and inverted in the thumbnail. */
  light?: boolean;
  className?: string;
  children: ReactNode;
};

export function ImageZoom({ src, alt, light = false, className = "", children }: ImageZoomProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const label = alt.trim() || "photo";

  return (
    <>
      <button
        type="button"
        className={`relative cursor-zoom-in border-0 bg-transparent p-0 text-inherit ${className} ${focusRing}`}
        aria-label={`View original ${label}`}
        onClick={() => dialogRef.current?.showModal()}
      >
        {children}
      </button>
      <dialog
        ref={dialogRef}
        className="w-auto max-w-[min(92vw,72rem)] border-0 bg-transparent p-0 backdrop:bg-black/80"
        aria-label={`Original ${label}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className={`rounded-2xl p-4 shadow-2xl ${light ? "bg-white" : "bg-[#12141a]"}`}>
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
                light ? "bg-black/10 text-black" : "bg-white/10 text-white"
              } ${focusRing}`}
              onClick={() => dialogRef.current?.close()}
            >
              Close
            </button>
          </div>
          {/* The stored file, without the thumbnail crop or the light-logo invert. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className={`mx-auto object-contain ${
              light ? "h-[42vh] w-auto max-w-[min(88vw,40rem)]" : "max-h-[80vh] w-auto max-w-[min(88vw,72rem)]"
            }`}
          />
        </div>
      </dialog>
    </>
  );
}
