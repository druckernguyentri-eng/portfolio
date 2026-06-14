"use client";

import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  onClose: () => void;
  onCloseComplete: () => void;
  onFocus: () => void;
  zIndex: number;
  initialX: number;
  initialY: number;
  width: number;
  folderCenterX: number;
  folderCenterY: number;
  closing: boolean;
  children: ReactNode;
}

export default function Window({
  title,
  onClose,
  onCloseComplete,
  onFocus,
  zIndex,
  initialX,
  initialY,
  width,
  folderCenterX,
  folderCenterY,
  closing,
  children,
}: Props) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState<{ width: number; height: number | undefined }>({
    width,
    height: undefined,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [animStyle, setAnimStyle] = useState<React.CSSProperties>({
    animation: "windowOpen 250ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
    transformOrigin: `${folderCenterX - initialX}px ${folderCenterY - initialY}px`,
  });

  const windowRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const closingStarted = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ mouseX: 0, mouseY: 0, width: 0, height: 0 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setAnimStyle({}), 270);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!closing || closingStarted.current) return;
    closingStarted.current = true;
    isDragging.current = false;
    isResizing.current = false;

    const el = windowRef.current;
    if (!el) { onCloseComplete(); return; }

    const rect = el.getBoundingClientRect();
    const winCenterX = rect.left + rect.width / 2;
    const winCenterY = rect.top + rect.height / 2;
    const dx = folderCenterX - winCenterX;
    const dy = folderCenterY - winCenterY;

    requestAnimationFrame(() => {
      setAnimStyle({
        transform: `translate(${dx}px, ${dy}px) scale(0.05)`,
        opacity: 0,
        transition: "transform 340ms cubic-bezier(0.4,0,0.2,1), opacity 260ms ease",
        pointerEvents: "none",
      });
    });

    const t = setTimeout(onCloseComplete, 360);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  const onTitleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || closingStarted.current || isMobile) return;
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  };

  const onResizeMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || closingStarted.current || isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    const currentHeight = windowRef.current?.offsetHeight ?? size.height ?? 400;
    isResizing.current = true;
    resizeStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: size.width,
      height: currentHeight,
    };
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
      }
      if (isResizing.current) {
        const dx = e.clientX - resizeStart.current.mouseX;
        const dy = e.clientY - resizeStart.current.mouseY;
        setSize({
          width:  Math.min(Math.max(resizeStart.current.width  + dx, 300), window.innerWidth  * 0.9),
          height: Math.min(Math.max(resizeStart.current.height + dy, 200), window.innerHeight * 0.9),
        });
      }
    };
    const onMouseUp = () => { isDragging.current = false; isResizing.current = false; };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const mobileStyle: React.CSSProperties = isMobile
    ? { left: "2.5vw", top: "10vh", width: "95vw", height: undefined, maxHeight: "80vh" }
    : { left: pos.x, top: pos.y, width: size.width, height: size.height, minWidth: 300, minHeight: 200, maxWidth: "90vw", maxHeight: "90vh" };

  return (
    <div
      ref={windowRef}
      style={{ zIndex, ...mobileStyle, ...animStyle }}
      className="fixed bg-white border border-[#c0c0c0] shadow-[2px_4px_20px_rgba(0,0,0,0.10)] flex flex-col"
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        onMouseDown={onTitleMouseDown}
        className={`flex items-center gap-2 px-3 py-[9px] bg-[#f5f5f5] border-b border-[#c0c0c0] select-none shrink-0 ${isMobile ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
      >
        <button
          onClick={onClose}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 border border-black/10 shrink-0 transition-all flex items-center justify-center"
        >
          <span className="text-white text-[8px] font-bold leading-none select-none">×</span>
        </button>
        <span className="flex-1 text-center text-[11px] text-[#777] tracking-[0.06em]">{title}</span>
      </div>

      {/* Content — scrollable */}
      <div
        className="p-6 text-[15px] leading-[1.75] select-text cursor-text overflow-y-auto flex-1"
        style={{ minHeight: 0 }}
      >
        {children}
      </div>

      {/* Resize handle — desktop only */}
      {!isMobile && (
        <div
          onMouseDown={onResizeMouseDown}
          className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end pb-[3px] pr-[3px]"
          style={{ touchAction: "none" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-25">
            <line x1="9" y1="3" x2="3" y2="9" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="9" y1="6" x2="6" y2="9" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}
