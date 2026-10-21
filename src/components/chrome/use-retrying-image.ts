"use client";

import { useState } from "react";

const MAX_RETRIES = 2;

export function useRetryingImage(src: string | null) {
  const [attempt, setAttempt] = useState(0);
  const [exhausted, setExhausted] = useState(false);
  const [trackedSrc, setTrackedSrc] = useState(src);

  if (src !== trackedSrc) {
    setTrackedSrc(src);
    setAttempt(0);
    setExhausted(false);
  }

  const onError = () => {
    if (attempt >= MAX_RETRIES) {
      setExhausted(true);
      return;
    }
    setAttempt((current) => current + 1);
  };

  const reset = () => {
    setAttempt(0);
    setExhausted(false);
  };

  return {
    show: Boolean(src) && !exhausted,
    attempt,
    onError,
    reset,
  };
}
