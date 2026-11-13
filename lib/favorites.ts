"use client";

import { useSyncExternalStore } from "react";

// Favoriler ziyaretçinin tarayıcısında (localStorage) saklanır.
const KEY = "bukimade:favorites";
const EMPTY: string[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cached: string[] = EMPTY;

function readRaw() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function getSnapshot() {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = raw ? JSON.parse(raw) : EMPTY;
      cached = Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : EMPTY;
    } catch {
      cached = EMPTY;
    }
  }
  return cached;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Gizli sekme vb. durumlarda sessizce yok say
  }
  listeners.forEach((l) => l());
}

export function toggleFavorite(slug: string) {
  const current = getSnapshot();
  write(current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]);
}

export function useFavorites() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}
