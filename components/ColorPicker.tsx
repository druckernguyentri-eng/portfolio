"use client";

import { useEffect, useRef, useState } from "react";
import {
  clamp,
  hexToRgb,
  hsvToRgb,
  rgbToHex,
  rgbToHsv,
  isValidHex,
  normalizeHex,
  type RGB,
} from "@/lib/color";

interface Props {
  anchorX: number;
  anchorY: number;
  initialColor: string;
  resetColor: string;
  onChange: (hex: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const PANEL_W = 216;
const PANEL_H = 372;
const SQUARE = 132;
const MARGIN = 8;

function useSyncedField(displayValue: string) {
  const [text, setText] = useState(displayValue);
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setText(displayValue);
  }, [displayValue]);
  return {
    text,
    setText,
    onFocus: () => { focused.current = true; },
    onBlur: () => { focused.current = false; setText(displayValue); },
  };
}

function NumberField({
  label, value, max, onCommit,
}: {
  label: string;
  value: number;
  max: number;
  onCommit: (n: number) => void;
}) {
  const field = useSyncedField(String(Math.round(value)));
  return (
    <label className="flex items-center gap-1 text-[10px] text-black/70">
      <span className="w-[10px] shrink-0">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        value={field.text}
        onFocus={field.onFocus}
        onBlur={field.onBlur}
        onChange={(e) => {
          field.setText(e.target.value);
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onCommit(clamp(n, 0, max));
        }}
        className="w-full min-w-0 border border-[#999999] bg-white px-1 py-[1px] text-[10px] font-mono text-black/80 focus:outline-none focus:border-black/50"
      />
    </label>
  );
}

function retroButton(extra = "") {
  return `px-3 py-[3px] text-[11px] border border-[#8a8a8a] bg-[#e4e4e4] hover:bg-[#d8d8d8] active:bg-[#cfcfcf] rounded-[2px] cursor-classic-pointer ${extra}`;
}

export default function ColorPicker({
  anchorX, anchorY, initialColor, resetColor, onChange, onConfirm, onCancel,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const dragTarget = useRef<"square" | "value" | null>(null);

  // `hsv` is the single source of truth for the picked color — rgb/hex are
  // always derived from it on render, never held as separate state, so there
  // is nothing to keep in sync via effects (and thus nothing that can loop).
  const [hsv, setHsv] = useState(() => {
    const rgb = hexToRgb(initialColor) ?? { r: 192, g: 192, b: 192 };
    return rgbToHsv(rgb.r, rgb.g, rgb.b);
  });

  const rgb: RGB = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const hex = rgbToHex(rgb);
  const hexField = useSyncedField(hex);

  // `onChange` is a fresh closure on every parent render; keep the latest
  // one in a ref so the effect below only re-fires when `hex` itself
  // changes, instead of looping on every parent re-render it triggers.
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onChangeRef.current(hex); }, [hex]);

  const updateFromSquare = (clientX: number, clientY: number) => {
    const el = squareRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);
    setHsv((prev) => ({ ...prev, h: (x / rect.width) * 360, s: 100 - (y / rect.height) * 100 }));
  };

  const updateFromValueBar = (clientY: number) => {
    const el = valueRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const y = clamp(clientY - rect.top, 0, rect.height);
    setHsv((prev) => ({ ...prev, v: 100 - (y / rect.height) * 100 }));
  };

  useEffect(() => {
    const move = (clientX: number, clientY: number) => {
      if (dragTarget.current === "square") updateFromSquare(clientX, clientY);
      else if (dragTarget.current === "value") updateFromValueBar(clientY);
    };
    const onMouseMove = (e: MouseEvent) => { if (dragTarget.current) move(e.clientX, e.clientY); };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragTarget.current) return;
      e.preventDefault();
      const t = e.touches[0];
      move(t.clientX, t.clientY);
    };
    const stop = () => { dragTarget.current = null; };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stop);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", stop);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stop);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", stop);
    };
  }, []);

  const handleReset = () => {
    const rgbReset = hexToRgb(resetColor) ?? { r: 192, g: 192, b: 192 };
    setHsv(rgbToHsv(rgbReset.r, rgbReset.g, rgbReset.b));
  };

  const commitRgb = (next: RGB) => setHsv(rgbToHsv(next.r, next.g, next.b));

  const left = clamp(anchorX, MARGIN, Math.max(MARGIN, window.innerWidth  - PANEL_W - MARGIN));
  const top  = clamp(anchorY, MARGIN, Math.max(MARGIN, window.innerHeight - PANEL_H - MARGIN));

  return (
    <div
      ref={panelRef}
      style={{ left, top, width: PANEL_W }}
      className="fixed z-[10000] bg-[#ececec] border border-[#8a8a8a] rounded-[3px] shadow-[2px_3px_8px_rgba(0,0,0,0.25)] p-3 select-none font-mono"
    >
      <div className="flex gap-2">
        {/* Hue (horizontal) / Saturation (vertical) square */}
        <div
          ref={squareRef}
          onMouseDown={(e) => { dragTarget.current = "square"; updateFromSquare(e.clientX, e.clientY); }}
          onTouchStart={(e) => { const t = e.touches[0]; dragTarget.current = "square"; updateFromSquare(t.clientX, t.clientY); }}
          className="relative border border-[#999999] cursor-classic-pointer"
          style={{
            width: SQUARE,
            height: SQUARE,
            touchAction: "none",
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #ffffff 100%), " +
              "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${(hsv.h / 360) * 100}%`,
              top: `${100 - hsv.s}%`,
              width: 8,
              height: 8,
              transform: "translate(-4px, -4px)",
              borderRadius: "50%",
              border: "1.5px solid #ffffff",
              boxShadow: "0 0 0 1px #000000",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Value / brightness slider */}
        <div
          ref={valueRef}
          onMouseDown={(e) => { dragTarget.current = "value"; updateFromValueBar(e.clientY); }}
          onTouchStart={(e) => { const t = e.touches[0]; dragTarget.current = "value"; updateFromValueBar(t.clientY); }}
          className="relative border border-[#999999] cursor-classic-pointer"
          style={{
            width: 16,
            height: SQUARE,
            touchAction: "none",
            backgroundImage: "linear-gradient(to bottom, #ffffff, #000000)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -2,
              right: -2,
              top: `${100 - hsv.v}%`,
              height: 2,
              transform: "translateY(-1px)",
              background: "#000000",
              boxShadow: "0 0 0 1px #ffffff",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <div className="w-[26px] h-[26px] border border-[#999999] shrink-0" style={{ background: hex }} />
        <span className="text-[10px] text-black/50 tracking-[0.05em]">PREVIEW</span>
        <button onClick={handleReset} className={retroButton("ml-auto")}>Reset</button>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-[6px] mt-3">
        <NumberField label="H" value={hsv.h} max={360} onCommit={(n) => setHsv((p) => ({ ...p, h: n }))} />
        <NumberField label="R" value={rgb.r} max={255} onCommit={(n) => commitRgb({ ...rgb, r: n })} />
        <NumberField label="S" value={hsv.s} max={100} onCommit={(n) => setHsv((p) => ({ ...p, s: n }))} />
        <NumberField label="G" value={rgb.g} max={255} onCommit={(n) => commitRgb({ ...rgb, g: n })} />
        <NumberField label="V" value={hsv.v} max={100} onCommit={(n) => setHsv((p) => ({ ...p, v: n }))} />
        <NumberField label="B" value={rgb.b} max={255} onCommit={(n) => commitRgb({ ...rgb, b: n })} />
      </div>

      <label className="flex items-center gap-2 mt-3 text-[10px] text-black/70">
        <span className="tracking-[0.05em]">HTML</span>
        <input
          type="text"
          value={hexField.text}
          onFocus={hexField.onFocus}
          onBlur={hexField.onBlur}
          onChange={(e) => {
            const v = e.target.value;
            hexField.setText(v);
            if (isValidHex(v)) {
              const parsed = hexToRgb(normalizeHex(v));
              if (parsed) commitRgb(parsed);
            }
          }}
          className="flex-1 min-w-0 border border-[#999999] bg-white px-1 py-[1px] text-[10px] font-mono text-black/80 focus:outline-none focus:border-black/50"
        />
      </label>

      <div className="flex justify-end gap-2 mt-3">
        <button onClick={onCancel} className={retroButton()}>Cancel</button>
        <button onClick={onConfirm} className={retroButton()}>OK</button>
      </div>
    </div>
  );
}
