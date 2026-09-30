"use client";

import { useEffect, useRef, useState } from "react";

/** วัดความกว้างจริงของ element (px) ด้วย ResizeObserver — ใช้ตัดสินว่า label ใส่ในแท่งได้ไหม */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, width] as const;
}
