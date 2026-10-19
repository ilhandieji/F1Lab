"use client";

import { useRef, type KeyboardEvent } from "react";
import { focusRing } from "./focus";

export type UnderlineTab<T extends string> = {
  id: T;
  label: string;
};

type UnderlineTabsProps<T extends string> = {
  tabs: readonly UnderlineTab<T>[];
  activeId: T;
  onSelect: (id: T) => void;
  idPrefix: string;
  label: string;
};

export function UnderlineTabs<T extends string>({
  tabs,
  activeId,
  onSelect,
  idPrefix,
  label,
}: UnderlineTabsProps<T>) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const nextIndex =
      event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : event.key === "ArrowLeft"
          ? (index - 1 + tabs.length) % tabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : null;

    if (nextIndex === null) return;

    event.preventDefault();
    event.stopPropagation();
    onSelect(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex min-w-0 gap-1 overflow-x-auto" role="tablist" aria-label={label}>
      {tabs.map((tab, index) => {
        const isActive = activeId === tab.id;

        return (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`${idPrefix}-${tab.id}-tab`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${idPrefix}-${tab.id}-panel`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(tab.id)}
            onKeyDown={(event) => handleTabKey(event, index)}
            className={`relative shrink-0 px-2 py-2.5 text-[11px] font-black uppercase tracking-[0.16em] transition-colors ${focusRing} ${
              isActive ? "text-white" : "text-white/70 hover:text-white"
            }`}
          >
            {tab.label}
            {isActive ? (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500" aria-hidden="true" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
