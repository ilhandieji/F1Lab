"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";

type LandingDriver = {
  first_name: string;
  last_name: string;
};

type LandingExperienceProps = {
  drivers: LandingDriver[];
};

const slideNames = ["Season explorer", "Driver directory"] as const;

export default function LandingExperience({
  drivers,
}: LandingExperienceProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const moveSlide = (direction: -1 | 1) => {
    setActiveSlide((current) =>
      Math.max(0, Math.min(slideNames.length - 1, current + direction)),
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft" && activeSlide > 0) {
      event.preventDefault();
      moveSlide(-1);
    } else if (event.key === "ArrowRight" && activeSlide < slideNames.length - 1) {
      event.preventDefault();
      moveSlide(1);
    }
  };

  return (
    <main
      className="relative h-dvh min-h-[32rem] overflow-hidden bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/ferrariBackground.webp')" }}
      onKeyDown={handleKeyDown}
      aria-roledescription="slide presentation"
    >
      <div
        className="absolute inset-0 [background-image:linear-gradient(90deg,rgb(5_5_7_/_88%)_0%,rgb(5_5_7_/_62%)_52%,rgb(5_5_7_/_18%)_100%),linear-gradient(0deg,rgb(5_5_7_/_70%),transparent_45%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-10">
          <Link
            href="/"
            className="text-sm font-black tracking-[0.25em] text-white uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ef1c25]"
          >
            F1<span className="text-[#ef1c25]">LAB</span>
          </Link>
          <Link
            href="/grid/2026?tab=drivers"
            className="rounded-full border border-white/35 px-4 py-2 text-xs font-bold tracking-[0.12em] text-white uppercase transition-colors hover:border-[#ef1c25] hover:bg-[#ef1c25] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ef1c25]"
          >
            Open the grid
          </Link>
        </header>

        <section
          className="relative flex min-h-0 flex-1 overflow-hidden"
          aria-label="F1Lab highlights"
          aria-live="polite"
        >
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            <article
              className="flex h-full min-w-full shrink-0 items-center px-5 pb-24 sm:px-10"
              aria-label={slideNames[0]}
              aria-hidden={activeSlide !== 0}
            >
              <div className="mx-auto w-full max-w-7xl">
                <span className="mb-5 inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-white/75 uppercase">
                  <span className="size-2 rounded-full bg-[#ef1c25]" />
                  Formula 1 data explorer
                </span>
                <h1 className="max-w-3xl text-5xl leading-[0.95] font-black tracking-[-0.06em] uppercase sm:text-7xl lg:text-8xl">
                  Every season.
                  <br />
                  <span className="text-[#ef1c25]">Every grid.</span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                  Explore season-start driver lineups, constructor standings,
                  and the changes that shape each championship.
                </p>
                <Link
                  href="/grid/2026?tab=drivers"
                  tabIndex={activeSlide === 0 ? 0 : -1}
                  className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-sm bg-[#ef1c25] px-6 text-sm font-extrabold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#c9161e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Explore 2026
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>

            <article
              className="flex h-full min-w-full shrink-0 items-center px-5 pb-24 sm:px-10"
              aria-label={slideNames[1]}
              aria-hidden={activeSlide !== 1}
            >
              <div className="mx-auto w-full max-w-7xl">
                <span className="text-xs font-bold tracking-[0.22em] text-[#ff7378] uppercase">
                  F1Lab database
                </span>
                <h2 className="mt-3 text-4xl leading-none font-black tracking-[-0.05em] uppercase sm:text-6xl">
                  Driver directory
                </h2>
                <p className="mt-4 text-sm text-white/75">
                  Names currently recorded in the driver database.
                </p>
                <ul
                  className="mt-6 grid max-h-[38vh] max-w-3xl grid-cols-1 gap-x-8 gap-y-2 overflow-y-auto border-l-2 border-[#ef1c25] bg-black/35 p-4 text-sm sm:grid-cols-2 sm:p-5"
                  aria-label="Drivers"
                >
                  {drivers.map((driver) => (
                    <li
                      key={`${driver.first_name}-${driver.last_name}`}
                      className="truncate text-white/90"
                    >
                      {driver.first_name} {driver.last_name}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/grid/2026?tab=drivers"
                  tabIndex={activeSlide === 1 ? 0 : -1}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold tracking-[0.1em] text-white uppercase underline decoration-[#ef1c25] decoration-2 underline-offset-4 hover:text-[#ff7378] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Browse season data
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          </div>
        </section>

        <nav
          className="absolute right-5 bottom-6 left-5 z-20 mx-auto flex max-w-7xl items-center justify-between sm:right-10 sm:left-10"
          aria-label="Landing page slides"
        >
          <button
            type="button"
            aria-label="Previous slide"
            disabled={activeSlide === 0}
            onClick={() => moveSlide(-1)}
            className="grid size-11 place-items-center rounded-full border border-white/35 bg-black/25 text-xl transition-colors hover:border-white hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">←</span>
          </button>
          <div className="flex items-center gap-3">
            {slideNames.map((name, index) => (
              <button
                type="button"
                key={name}
                aria-label={`Go to ${name} slide`}
                aria-current={activeSlide === index ? "step" : undefined}
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none ${
                  activeSlide === index
                    ? "w-8 bg-[#ef1c25]"
                    : "w-2 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
            <span className="sr-only">
              {activeSlide + 1} of {slideNames.length}: {slideNames[activeSlide]}
            </span>
          </div>
          <button
            type="button"
            aria-label="Next slide"
            disabled={activeSlide === slideNames.length - 1}
            onClick={() => moveSlide(1)}
            className="grid size-11 place-items-center rounded-full border border-white/35 bg-black/25 text-xl transition-colors hover:border-white hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">→</span>
          </button>
        </nav>
      </div>
    </main>
  );
}
