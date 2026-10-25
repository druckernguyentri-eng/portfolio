"use client";

import { useRef, useState, useId } from "react";
import { adjustLightness, getFolderLabelColor } from "@/lib/color";

export type FolderVariant = "gray" | "yellow" | "dark" | "wine" | "navy";

export const FOLDER_BASE_COLOR: Record<FolderVariant, string> = {
  dark:   "#1C1C1C",
  yellow: "#F5C400",
  gray:   "#C0C0C0",
  wine:   "#5A1A2E",
  navy:   "#14202E",
};

const LONG_PRESS_MS = 500;
const LONG_PRESS_MOVE_TOLERANCE = 10;

interface Props {
  name: string;
  onClick: () => void;
  isOpen?: boolean;
  variant?: FolderVariant;
  color?: string;
  onOpenColorPicker?: (clientX: number, clientY: number) => void;
}

function DitherDefs({ uid, color }: { uid: string; color: string }) {
  const light = adjustLightness(color, 12);
  const dark  = adjustLightness(color, -12);
  const cell = 2;
  const matrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];
  return (
    <pattern id={`dither-${uid}`} width={cell * 4} height={cell * 4} patternUnits="userSpaceOnUse">
      {matrix.flatMap((row, ry) =>
        row.map((v, rx) => (
          <rect
            key={`${rx}-${ry}`}
            x={rx * cell}
            y={ry * cell}
            width={cell}
            height={cell}
            fill={v < 8 ? dark : light}
          />
        ))
      )}
    </pattern>
  );
}

function FolderSVG({
  color,
  uid,
  tabOpen,
  isFlashing,
}: {
  color:      string;
  uid:        string;
  tabOpen:    boolean;
  isFlashing: boolean;
}) {
  const sid = `${uid}s`;
  const fill = `url(#dither-${uid})`;

  return (
    <svg
      width="80"
      height="72"
      viewBox="0 0 80 72"
      shapeRendering="crispEdges"
      style={{
        overflow: "visible",
        display:  "block",
        animation: isFlashing ? "folderFlash 0.2s ease-out forwards" : undefined,
      }}
    >
      <defs>
        <filter id={sid} x="-20%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="3" dy="3" stdDeviation="1"
            floodColor="#000000" floodOpacity="0.5" />
        </filter>
        <DitherDefs uid={uid} color={color} />
      </defs>

      {/* ── BODY fill (with drop shadow) ── */}
      <g filter={`url(#${sid})`}>
        <rect x="0" y="20" width="80" height="52" fill={fill} />
      </g>

      {/* ── BODY bevel ── */}
      {/* Outer top+left highlight 2px */}
      <rect x="0"  y="20" width="80" height="2"  fill="#FFFFFF" />
      <rect x="0"  y="20" width="2"  height="52" fill="#FFFFFF" />
      {/* Outer bottom+right shadow 2px */}
      <rect x="0"  y="70" width="80" height="2"  fill="#000000" />
      <rect x="78" y="20" width="2"  height="52" fill="#000000" />
      {/* Inner top+left highlight 1px */}
      <rect x="2"  y="22" width="76" height="1"  fill="#EEEEEE" />
      <rect x="2"  y="22" width="1"  height="48" fill="#EEEEEE" />
      {/* Inner bottom+right shadow 1px */}
      <rect x="2"  y="69" width="76" height="1"  fill="#555555" />
      <rect x="77" y="22" width="1"  height="48" fill="#555555" />
      {/* Outer border 1px */}
      <rect x="0" y="20" width="80" height="52"
        fill="none" stroke="#000000" strokeWidth="1" />

      {/* ── TAB — 3D flip around bottom edge ── */}
      <g
        style={{
          transformOrigin: "14px 20px",
          transform:  tabOpen ? "rotateX(-55deg)" : "rotateX(0deg)",
          transition: "transform 0.3s ease-out",
        }}
      >
        <rect x="0" y="10" width="28" height="10" fill={fill} />
        {/* Tab bevel */}
        <rect x="0"  y="10" width="28" height="2"  fill="#FFFFFF" />
        <rect x="0"  y="10" width="2"  height="10" fill="#FFFFFF" />
        <rect x="0"  y="18" width="28" height="2"  fill="#000000" />
        <rect x="26" y="10" width="2"  height="10" fill="#000000" />
        <rect x="2"  y="12" width="24" height="1"  fill="#EEEEEE" />
        <rect x="2"  y="12" width="1"  height="6"  fill="#EEEEEE" />
        <rect x="2"  y="17" width="24" height="1"  fill="#555555" />
        <rect x="25" y="12" width="1"  height="6"  fill="#555555" />
        <rect x="0" y="10" width="28" height="10"
          fill="none" stroke="#000000" strokeWidth="1" />
      </g>
    </svg>
  );
}

export default function FolderIcon({
  name,
  onClick,
  isOpen = false,
  variant = "gray",
  color,
  onOpenColorPicker,
}: Props) {
  const [isHovered,  setIsHovered]  = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const uid = useId().replace(/:/g, "_");

  const fill    = color ?? FOLDER_BASE_COLOR[variant];
  const tabOpen = isHovered || isOpen;
  const label   = getFolderLabelColor(fill);

  const touchStart   = useRef<{ x: number; y: number } | null>(null);
  const longPressT   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressHit = useRef(false);

  const clearLongPress = () => {
    if (longPressT.current) { clearTimeout(longPressT.current); longPressT.current = null; }
  };

  const handleClick = () => {
    if (longPressHit.current) { longPressHit.current = false; return; }
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);
    setIsHovered(false);
    onClick();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenColorPicker?.(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    longPressHit.current = false;
    clearLongPress();
    longPressT.current = setTimeout(() => {
      longPressHit.current = true;
      onOpenColorPicker?.(t.clientX, t.clientY);
    }, LONG_PRESS_MS);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (Math.hypot(dx, dy) > LONG_PRESS_MOVE_TOLERANCE) clearLongPress();
  };

  const handleTouchEnd = () => {
    clearLongPress();
    touchStart.current = null;
  };

  return (
    <button
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col items-center gap-[11px] px-4 py-3 rounded transition-colors duration-75 hover:bg-black/[0.04] active:bg-black/[0.08] outline-none cursor-classic-pointer"
    >
      <div style={{ position: "relative", width: 80, height: 72 }}>

        {/* Perspective wrapper so CSS 3D rotateX works on the SVG <g> */}
        <div style={{
          position:          "absolute",
          inset:             0,
          perspective:       "200px",
          perspectiveOrigin: "40px 20px",
        }}>
          <FolderSVG
            color={fill}
            uid={uid}
            tabOpen={tabOpen}
            isFlashing={isFlashing}
          />
        </div>

        {/* Paper — peeks up from folder on hover */}
        <div
          style={{
            position:   "absolute",
            top:        20,
            left:       18,
            width:      44,
            height:     38,
            background: "#FFFFF0",
            border:     "1px solid #999999",
            transform:  isHovered ? "translateY(-8px)" : "translateY(20px)",
            opacity:    isHovered ? 1 : 0,
            transition: isHovered
              ? "transform 0.25s ease-out, opacity 0.25s ease-out"
              : "transform 0.2s ease-in,  opacity 0.2s ease-in",
            pointerEvents: "none",
            zIndex:     10,
          }}
        >
          {[8, 16, 24].map((y) => (
            <div key={y} style={{
              position:   "absolute",
              left:       6,
              width:      32,
              top:        y,
              height:     1,
              background: "#BBBBBB",
            }} />
          ))}
        </div>

      </div>

      <span
        className="text-[14px] tracking-[0.06em] transition-colors duration-75"
        style={{ color: isHovered ? label.hover : label.base }}
      >
        {name}
      </span>
    </button>
  );
}
