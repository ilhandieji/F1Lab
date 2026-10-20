"use client";

import { useState } from "react";
import type { DriverProfile } from "@/lib/driver/types";

type DriverPortraitProps = {
  profile: Pick<DriverProfile, "id" | "abbreviation" | "permanentNumber" | "photoUrl" | "fullName">;
  className?: string;
};

export function DriverPortrait({ profile, className = "" }: DriverPortraitProps) {
  const [failed, setFailed] = useState(false);
  const showImage = profile.photoUrl && !failed;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(40,40,45,0.95),rgba(18,18,22,0.98))] ${className}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- manual files in public/assets/drivers
        <img
          src={profile.photoUrl!}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top"
          onError={() => setFailed(true)}
        />
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
