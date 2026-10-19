"use client";

import Image from "next/image";
import { useState } from "react";
import {
  driverDisplayInitials,
  resolveDriverPortraitUrl,
  type DriverPortraitRecord,
} from "@/lib/driver/driver-photos";

type DriverAvatarVariant = "thumb" | "row";

const variantClass: Record<DriverAvatarVariant, string> = {
  thumb: "h-8 w-8 rounded-full text-[10px]",
  row: "h-10 w-10 shrink-0 rounded-lg text-xs md:h-11 md:w-11",
};

type DriverAvatarProps = {
  photoUrl?: string | null;
  portraits?: readonly DriverPortraitRecord[];
  season?: number | null;
  abbreviation?: string | null;
  fullName?: string;
  variant?: DriverAvatarVariant;
  className?: string;
};

export function DriverAvatar({
  photoUrl: photoUrlProp,
  portraits,
  season = null,
  abbreviation,
  fullName = "",
  variant = "row",
  className = "",
}: DriverAvatarProps) {
  const photoUrl =
    photoUrlProp ??
    (portraits ? resolveDriverPortraitUrl(portraits, season ?? null) : null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = Boolean(photoUrl) && failedUrl !== photoUrl;

  const fallbackLabel =
    abbreviation?.trim() ||
    (fullName ? driverDisplayInitials(fullName) : "?");

  return (
    <span
      className={`relative grid place-items-center overflow-hidden border border-white/10 bg-[linear-gradient(145deg,rgba(40,40,45,0.95),rgba(18,18,22,0.98))] font-black uppercase tracking-tight text-white/90 ${variantClass[variant]} ${className}`}
      aria-hidden={showImage ? true : undefined}
    >
      {showImage ? (
        <Image
          src={photoUrl!}
          alt=""
          fill
          sizes={variant === "thumb" ? "2rem" : "2.75rem"}
          className="object-cover object-top"
          onError={() => setFailedUrl(photoUrl)}
        />
      ) : (
        <span className={variant === "thumb" ? "text-red-200" : "text-white/85"}>
          {fallbackLabel}
        </span>
      )}
    </span>
  );
}
