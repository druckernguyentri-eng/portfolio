"use client";

import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  onClose: () => void;
  onFocus: () => void;
  zIndex: number;
  initialX: number;
  initialY: number;
  width: number;
  children: ReactNode;
}

export default function Window({
  title,
  onClose,
  onFocus,
  zIndex,
  initialX,
  initialY,
  width,
  children,
}: Props) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const onTitleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };
    const onMouseUp = () => {
      isDragging.current = false;
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      style={{ left: pos.x, top: pos.y, width, zIndex }}
      className="fixed window-animate bg-white border border-[#c0c0c0] shadow-[2px_4px_20px_rgba(0,0,0,0.10)]"
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        onMouseDown={onTitleMouseDown}
        className="flex items-center gap-2 px-3 py-[9px] bg-[#f5f5f5] border-b border-[#c0c0c0] cursor-grab active:cursor-grabbing select-none"
      >
        <button
          onClick={onClose}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 border border-black/10 shrink-0 transition-all"
        />
        <span className="flex-1 text-center text-[11px] text-[#777] tracking-[0.06em]">
          {title}
        </span>
      </div>
      {/* Content */}
      <div className="p-6 text-[15px] leading-[1.75] select-text cursor-text">
        {children}
      </div>
    </div>
  );
}
