"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * FLIP animation ตาม key: element ที่ key เดียวกันย้ายตำแหน่ง (แม้ย้าย parent) จะเลื่อนจากที่เก่าไปที่ใหม่
 * วัดตำแหน่งเทียบกับ container เพื่อไม่ให้การ scroll หน้าทำให้ทุกชิ้นขยับ
 * ปิดเองเมื่อผู้ใช้ตั้ง prefers-reduced-motion
 */
export function useFlip<C extends HTMLElement>(deps: unknown[]) {
  const containerRef = useRef<C>(null);
  const nodes = useRef(new Map<string, HTMLElement>());
  const previous = useRef(new Map<string, { x: number; y: number }>());

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const origin = container.getBoundingClientRect();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = new Map<string, { x: number; y: number }>();

    nodes.current.forEach((el, key) => {
      const r = el.getBoundingClientRect();
      const pos = { x: r.left - origin.left, y: r.top - origin.top };
      next.set(key, pos);
      if (reduce) return;
      const old = previous.current.get(key);
      if (!old) {
        el.animate([{ opacity: 0, transform: "scale(0.92)" }, { opacity: 1, transform: "none" }], {
          duration: 200,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        });
      } else if (old.x !== pos.x || old.y !== pos.y) {
        el.animate(
          [{ transform: `translate(${old.x - pos.x}px, ${old.y - pos.y}px)` }, { transform: "none" }],
          { duration: 320, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        );
      }
    });
    previous.current = next;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps ส่งมาจากผู้เรียก
  }, deps);

  const register = (key: string) => (el: HTMLElement | null) => {
    if (el) nodes.current.set(key, el);
    else nodes.current.delete(key);
  };

  return { containerRef, register };
}
