"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import FolderIcon from "./FolderIcon";
import Window from "./Window";

type WinId = "PJ_01" | "VISION" | "DRUCKER_NG";

interface WinState {
  id: WinId;
  zIndex: number;
  initialX: number;
  initialY: number;
}

const FOLDERS: { id: WinId; label: string }[] = [
  { id: "PJ_01", label: "PJ_01" },
  { id: "VISION", label: "VISION" },
  { id: "DRUCKER_NG", label: "DRUCKER.NG" },
];

const WIN_CONFIG: Record<WinId, { title: string; width: number }> = {
  PJ_01: { title: "PJ_01", width: 500 },
  VISION: { title: "VISION", width: 500 },
  DRUCKER_NG: { title: "DRUCKER.NG", width: 500 },
};

// ─── Window contents ────────────────────────────────────────────

function PJ01Content() {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-4">
      <span className="text-[17px] font-bold tracking-[0.25em] text-black/25 uppercase">
        Coming Soon
      </span>
      <span className="text-[13px] text-black/15 tracking-[0.1em]">——</span>
    </div>
  );
}

function VisionContent() {
  return (
    <div>
      <p className="text-[12px] tracking-[0.2em] uppercase text-black/30 mb-4">
        PJ SERIES
      </p>
      <p className="text-[15px] text-black/65 leading-[1.9]">
        PJ SERIES là chuỗi dự án thử nghiệm mang tính cá nhân — có thể là
        short film, MV, visual effects, hay bất cứ thứ gì mình muốn khám phá.
        Đây là nơi mình vận dụng những gì đã học, kết hợp kỹ thuật và sáng
        tạo để tạo ra những thứ thật sự của riêng mình.{" "}
        <span className="text-black/35">
          Không có công thức. Chỉ có thử nghiệm.
        </span>
      </p>
    </div>
  );
}

function DruckerContent() {
  return (
    <div>
      <p className="text-[19px] font-bold tracking-[0.08em] text-black mb-1">
        DRUCKER NGUYEN
      </p>
      <p className="text-[13px] text-black/35 tracking-[0.05em] mb-6">
        Sinh viên · HCMUT · TP. Hồ Chí Minh
      </p>

      <div className="border-t border-black/8 pt-5 mb-6">
        <p className="text-[15px] text-black/55 leading-[1.85]">
          Mình là sinh viên Đại học Bách Khoa TP.HCM. Quan tâm đến sáng tạo
          nội dung, kỹ thuật hình ảnh và lập trình. Luôn muốn tạo ra những
          thứ thật sự có ý nghĩa với mình.
        </p>
      </div>

      <div className="border-t border-black/8 pt-5">
        <p className="text-[12px] tracking-[0.2em] uppercase text-black/25 mb-4">
          Links
        </p>
        <div className="flex flex-col gap-3">
          {[
            { label: "YouTube", handle: "@druckernguyen", url: "#" },
            { label: "Instagram", handle: "@druckernguyen", url: "#" },
            { label: "Facebook", handle: "Drucker Nguyen", url: "#" },
          ].map(({ label, handle, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between group"
            >
              <span className="text-[15px] text-black/50 group-hover:text-black transition-colors duration-100">
                <span className="text-black/20 group-hover:text-black/50 mr-2">
                  ▸
                </span>
                {label}
              </span>
              <span className="text-[13px] text-black/20 group-hover:text-black/40 transition-colors duration-100">
                {handle}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function getContent(id: WinId) {
  if (id === "PJ_01") return <PJ01Content />;
  if (id === "VISION") return <VisionContent />;
  return <DruckerContent />;
}

// ─── Clock ──────────────────────────────────────────────────────

function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-[11px] tracking-[0.1em] text-black/30">{time}</span>
  );
}

// ─── Desktop ────────────────────────────────────────────────────

export default function Desktop() {
  const [windows, setWindows] = useState<WinState[]>([]);
  const topZ = useRef(100);

  const openWindow = useCallback((id: WinId) => {
    setWindows((prev) => {
      const exists = prev.find((w) => w.id === id);
      topZ.current += 1;
      if (exists) {
        return prev.map((w) =>
          w.id === id ? { ...w, zIndex: topZ.current } : w
        );
      }
      const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
      const vh = typeof window !== "undefined" ? window.innerHeight : 720;
      const w = WIN_CONFIG[id].width;
      const cascade = prev.length;
      return [
        ...prev,
        {
          id,
          zIndex: topZ.current,
          initialX: Math.floor(vw / 2 - w / 2) + cascade * 24,
          initialY: Math.floor(vh / 2 - 120) + cascade * 24,
        },
      ];
    });
  }, []);

  const closeWindow = useCallback((id: WinId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: WinId) => {
    setWindows((prev) => {
      topZ.current += 1;
      return prev.map((w) =>
        w.id === id ? { ...w, zIndex: topZ.current } : w
      );
    });
  }, []);

  const openIds = new Set(windows.map((w) => w.id));

  return (
    <div className="desktop-bg w-screen h-screen overflow-hidden relative flex flex-col select-none">
      {/* Menubar */}
      <div className="flex items-center justify-between px-5 py-[9px] border-b border-black/[0.06] shrink-0 z-50 bg-white">
        <span className="text-[11px] font-bold tracking-[0.18em] text-black/60">
          DRUCKER.NG
        </span>
        <Clock />
      </div>

      {/* Desktop area */}
      <div className="flex-1 relative">

        {/* ── Photo placeholder — center of desktop ── */}
        <div
          className="absolute"
          style={{ left: "calc(50% - 90px)", top: "calc(50% - 120px)" }}
        >
          <div
            className="flex flex-col justify-end p-2.5"
            style={{
              width: 180,
              height: 240,
              backgroundImage: [
                "linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.05) 75%)",
                "linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.05) 75%)",
              ].join(", "),
              backgroundSize: "4px 4px",
              backgroundPosition: "0 0, 2px 2px",
              backgroundColor: "#c8c8c8",
            }}
          >
            <span className="text-[10px] tracking-[0.18em] text-black/30">
              [ photo ]
            </span>
          </div>
        </div>

        {/* ── DRUCKER.NG — top right (dark) ── */}
        <div className="absolute" style={{ top: "20%", right: "25%" }}>
          <FolderIcon
            name="DRUCKER.NG"
            onClick={() => openWindow("DRUCKER_NG")}
            isOpen={openIds.has("DRUCKER_NG")}
            variant="dark"
          />
        </div>

        {/* ── PJ_01 — center left (gray) ── */}
        <div className="absolute" style={{ top: "35%", left: "35%" }}>
          <FolderIcon
            name="PJ_01"
            onClick={() => openWindow("PJ_01")}
            isOpen={openIds.has("PJ_01")}
            variant="gray"
          />
        </div>

        {/* ── VISION — bottom right (yellow) ── */}
        <div className="absolute" style={{ bottom: "25%", right: "28%" }}>
          <FolderIcon
            name="VISION"
            onClick={() => openWindow("VISION")}
            isOpen={openIds.has("VISION")}
            variant="yellow"
          />
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-black/[0.06] shrink-0 z-50 bg-white">
        <span className="text-[10px] tracking-[0.14em] text-black/25">
          DRUCKER NGUYEN
        </span>
        <div className="flex gap-6">
          {[
            { label: "YT", url: "#" },
            { label: "IG", url: "#" },
            { label: "FB", url: "#" },
          ].map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.14em] text-black/25 hover:text-black/60 transition-colors duration-100"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Windows */}
      {windows.map((w) => (
        <Window
          key={w.id}
          title={WIN_CONFIG[w.id].title}
          onClose={() => closeWindow(w.id)}
          onFocus={() => focusWindow(w.id)}
          zIndex={w.zIndex}
          initialX={w.initialX}
          initialY={w.initialY}
          width={WIN_CONFIG[w.id].width}
        >
          {getContent(w.id)}
        </Window>
      ))}
    </div>
  );
}
