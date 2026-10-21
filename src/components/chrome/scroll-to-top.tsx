"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function ScrollToTop() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const isPop = useRef(false);
  const generation = useRef(0);

  useEffect(() => {
    const onPopState = () => {
      isPop.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    const pop = isPop.current;
    previousPath.current = pathname;
    isPop.current = false;
    const id = ++generation.current;
    if (pop) return;
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      if (generation.current !== id) return;
      window.scrollTo(0, 0);
    });
  }, [pathname]);

  return null;
}
