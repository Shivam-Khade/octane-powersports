"use client";

import { useEffect, useRef } from "react";

export function ViewTracker({ type, id }: { type: 'product' | 'blog', id: number | string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    // Fire and forget
    fetch('/api/track/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id })
    }).catch(() => {});
  }, [type, id]);

  return null;
}
