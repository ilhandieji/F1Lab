"use client";

import Image from "next/image";
import { ImageZoom } from "@/components/chrome/image-zoom";
import { useRetryingImage } from "@/components/chrome/use-retrying-image";
import { resolveDriverPortraitUrl } from "@/lib/driver/driver-photos";
import type { DriverProfile } from "@/lib/driver/types";

type DriverPortraitProps = {
  profile: Pick<DriverProfile, "abbreviation" | "permanentNumber" | "portraits" | "fullName">;
  season: number | null;
  className?: string;
};

export function DriverPortrait({ profile, season, className = "" }: DriverPortraitProps) {
  const photoUrl = resolveDriverPortraitUrl(profile.portraits, season);
  const image = useRetryingImage(photoUrl);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(40,40,45,0.95),rgba(18,18,22,0.98))] ${className}`}
    >
      {image.show && photoUrl ? (
        <ImageZoom
          src={photoUrl}
          alt={profile.fullName}
          className="absolute inset-0 block h-full w-full overflow-hidden"
        >
          <Image
            key={`${photoUrl}-${image.attempt}`}
            src={photoUrl}
            alt=""
            fill
            priority
            unoptimized
            sizes="(min-width: 768px) 12rem, calc(100vw - 2rem)"
            className="object-cover object-[center_22%] scale-[1.05]"
            onError={image.onError}
          />
        </ImageZoom>
      ) : (
        <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-2 p-6">
          <span className="text-4xl font-black tracking-tight text-white/90">{profile.abbreviation}</span>
          {profile.permanentNumber ? (
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
              #{profile.permanentNumber}
            </span>
          ) : null}
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(7,8,12,0.75),transparent_45%)]"
        aria-hidden="true"
      />
    </div>
  );
}
