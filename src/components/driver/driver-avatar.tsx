"use client";

import Image from "next/image";
import { ImageZoom } from "@/components/chrome/image-zoom";
import { useRetryingImage } from "@/components/chrome/use-retrying-image";
import {
  driverDisplayInitials,
  resolveDriverPortraitUrl,
  type DriverPortraitRecord,
} from "@/lib/driver/driver-photos";

type DriverAvatarVariant = "thumb" | "row";

const variantClass: Record<DriverAvatarVariant, string> = {
  thumb: "h-8 w-8 rounded-full text-[10px]",
  row: "h-11 w-11 shrink-0 rounded-xl text-xs sm:h-12 sm:w-12 md:h-11 md:w-11",
};

const imageObjectClass: Record<DriverAvatarVariant, string> = {
  thumb: "object-cover object-center",
  row: "object-cover object-[center_22%] scale-[1.08]",
};

type DriverAvatarProps = {
  photoUrl?: string | null;
  portraits?: readonly DriverPortraitRecord[];
  season?: number | null;
  abbreviation?: string | null;
  fullName?: string;
  variant?: DriverAvatarVariant;
  /** Turn off inside another button, such as a search option. */
  zoomable?: boolean;
  className?: string;
};

export function DriverAvatar({
  photoUrl: photoUrlProp,
  portraits,
  season = null,
  abbreviation,
  fullName = "",
  variant = "row",
  zoomable = true,
  className = "",
}: DriverAvatarProps) {
  const photoUrl =
    photoUrlProp ??
    (portraits ? resolveDriverPortraitUrl(portraits, season ?? null) : null);
  const image = useRetryingImage(photoUrl);
  const showImage = image.show && Boolean(photoUrl);

  const fallbackLabel =
    abbreviation?.trim() ||
    (fullName ? driverDisplayInitials(fullName) : "?");

  const frameClass = `relative grid place-items-center overflow-hidden border border-white/10 bg-[linear-gradient(145deg,rgba(40,40,45,0.95),rgba(18,18,22,0.98))] font-black uppercase tracking-tight text-white/90 ${variantClass[variant]} ${className}`;

  if (showImage && zoomable) {
    return (
      <ImageZoom src={photoUrl!} alt={fullName || fallbackLabel} className={frameClass}>
        <Image
          key={`${photoUrl}-${image.attempt}`}
          src={photoUrl!}
          alt=""
          fill
          unoptimized
          sizes={variant === "thumb" ? "2rem" : "3rem"}
          className={imageObjectClass[variant]}
          onError={image.onError}
        />
      </ImageZoom>
    );
  }

  return (
    <span className={frameClass} aria-hidden={showImage ? true : undefined}>
      {showImage ? (
        <Image
          key={`${photoUrl}-${image.attempt}`}
          src={photoUrl!}
          alt=""
          fill
          unoptimized
          sizes={variant === "thumb" ? "2rem" : "3rem"}
          className={imageObjectClass[variant]}
          onError={image.onError}
        />
      ) : (
        <span className={variant === "thumb" ? "text-red-200" : "text-white/85"}>
          {fallbackLabel}
        </span>
      )}
    </span>
  );
}
