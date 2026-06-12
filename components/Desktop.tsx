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
  folderCenterX: number;
  folderCenterY: number;
  closing: boolean;
}

const WIN_CONFIG: Record<WinId, { title: string; width: number }> = {
  PJ_01:      { title: "PJ_01",      width: 500 },
  VISION:     { title: "VISION",     width: 500 },
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

      <div className="border-t border-black/8 pt-5 mb-6 flex flex-col gap-4">
        <p className="text-[15px] text-black/55 leading-[1.85]">
          Mình là Nguyễn Trí Đức — sinh viên Công nghệ Sinh học tại Đại học Bách Khoa TP.HCM.
        </p>
        <p className="text-[15px] text-black/55 leading-[1.85]">
          Nghe có vẻ không liên quan, nhưng song song với hành trình học thuật đó, mình còn đang theo đuổi sáng tạo nội dung, kỹ thuật hình ảnh, quay phim, powerlifting và khoa học thể thao. Mình không có một lý giải hoàn hảo nào cho việc tại sao một người học sinh học lại quan tâm đến tất cả những thứ đó cùng một lúc — nhưng nhìn lại, mình nghĩ đó chính xác là con người mình: một người không chịu được cảm giác dừng lại ở bề mặt của bất cứ thứ gì.
        </p>
        <p className="text-[15px] text-black/55 leading-[1.85]">
          Mỗi lĩnh vực mình chạm vào đều dạy mình một cách nhìn khác nhau. Sinh học dạy mình tư duy hệ thống và sự kiên nhẫn với những thứ không thể thấy ngay kết quả. Kỹ thuật hình ảnh và quay phim dạy mình cách chuyển hóa một ý tưởng còn mơ hồ thành thứ gì đó người khác có thể nhìn thấy và cảm nhận được. Powerlifting dạy mình rằng giới hạn thường nằm trong đầu trước khi nằm trong cơ thể — và rằng tiến bộ thật sự không bao giờ đến từ việc làm vừa đủ.
        </p>
        <p className="text-[15px] text-black/55 leading-[1.85]">
          Chính vì vậy, khi mình tham gia vào bất kỳ dự án nào — dù là một video, một buổi coaching, hay một công trình nghiên cứu — mình không có thói quen làm cho xong. Với mình, được tin tưởng giao việc là một thứ gì đó mình xem rất nghiêm túc. Mình hiểu rằng đằng sau mỗi dự án đều có người đã đặt vào đó thời gian, kỳ vọng và đôi khi là cả niềm tin — và mình không muốn là người làm những thứ đó trở nên lãng phí.
        </p>
        <p className="text-[15px] text-black/55 leading-[1.85]">
          Mình không tự nhận mình đã giỏi ở tất cả mọi thứ. Nhưng có một thứ mình chắc chắn: mình luôn mang vào từng dự án tất cả những gì mình có ở thời điểm đó — sự tập trung, sự tò mò, và cái mong muốn được đẩy kết quả đi xa hơn mức chỉ &ldquo;đạt yêu cầu&rdquo;. Với mình, khoảng cách giữa một sản phẩm ổn và một sản phẩm thật sự tốt thường nằm ở chỗ người làm ra nó có thực sự quan tâm đến nó hay không.
        </p>
        <p className="text-[15px] text-black/55 leading-[1.85]">
          Tất cả những thứ mình theo đuổi — dù khác nhau đến đâu — đều có chung một điểm xuất phát: mình chỉ làm những gì mình thực sự muốn đi đến tận cùng. Và với mình, đó là cách duy nhất để tạo ra thứ gì đó có ý nghĩa — không chỉ với bản thân mình, mà còn với những người đã tin tưởng đồng hành cùng mình.
        </p>
      </div>

      <div className="border-t border-black/8 pt-5">
        <p className="text-[12px] tracking-[0.2em] uppercase text-black/25 mb-4">
          Links
        </p>
        <div className="flex flex-col gap-3">
          {[
            { label: "YouTube",   handle: "@Druckernguyen",  url: "https://www.youtube.com/@Druckernguyen" },
            { label: "Instagram", handle: "@drucker_nguyen", url: "https://www.instagram.com/drucker_nguyen/" },
            { label: "Facebook",  handle: "nguyen.drucker",  url: "https://www.facebook.com/nguyen.drucker/" },
          ].map(({ label, handle, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between group"
            >
              <span className="text-[15px] text-black/50 group-hover:text-black transition-colors duration-100">
                <span className="text-black/20 group-hover:text-black/50 mr-2">▸</span>
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
  if (id === "PJ_01")   return <PJ01Content />;
  if (id === "VISION")  return <VisionContent />;
  return <DruckerContent />;
}

// ─── Clock ──────────────────────────────────────────────────────

function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="text-[11px] tracking-[0.1em] text-black/30">{time}</span>;
}

// ─── Desktop ────────────────────────────────────────────────────

export default function Desktop() {
  const [windows, setWindows] = useState<WinState[]>([]);
  const topZ = useRef(100);
  const folderRefs = useRef<Partial<Record<WinId, HTMLDivElement | null>>>({});

  const getFolderCenter = (id: WinId) => {
    const el = folderRefs.current[id];
    const rect = el?.getBoundingClientRect();
    return {
      x: rect ? rect.left + rect.width  / 2 : (typeof window !== "undefined" ? window.innerWidth  / 2 : 640),
      y: rect ? rect.top  + rect.height / 2 : (typeof window !== "undefined" ? window.innerHeight / 2 : 360),
    };
  };

  // Click folder: open if closed, start-close if open
  const handleFolderClick = useCallback((id: WinId) => {
    const center = getFolderCenter(id);
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      topZ.current += 1;

      if (existing && !existing.closing) {
        // Toggle off → start close animation
        return prev.map((w) => w.id === id ? { ...w, closing: true } : w);
      }
      if (existing && existing.closing) {
        // Ignore clicks while closing animation runs
        return prev;
      }

      // Open new window
      const vw = typeof window !== "undefined" ? window.innerWidth  : 1280;
      const vh = typeof window !== "undefined" ? window.innerHeight : 720;
      const winWidth = WIN_CONFIG[id].width;
      const cascade = prev.filter((w) => !w.closing).length;
      return [
        ...prev,
        {
          id,
          zIndex: topZ.current,
          initialX: Math.floor(vw / 2 - winWidth / 2) + cascade * 24,
          initialY: Math.floor(vh / 2 - 120)          + cascade * 24,
          folderCenterX: center.x,
          folderCenterY: center.y,
          closing: false,
        },
      ];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Called by Window's X button → same as toggle-off
  const startClose = useCallback((id: WinId) => {
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, closing: true } : w));
  }, []);

  // Called by Window after close animation finishes → unmount
  const removeWindow = useCallback((id: WinId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: WinId) => {
    setWindows((prev) => {
      topZ.current += 1;
      return prev.map((w) => w.id === id ? { ...w, zIndex: topZ.current } : w);
    });
  }, []);

  // isOpen = open AND not currently closing
  const openIds = new Set(windows.filter((w) => !w.closing).map((w) => w.id));

  return (
    <div className="desktop-bg w-screen h-screen overflow-hidden relative flex flex-col select-none">
      {/* Menubar */}
      <div className="flex items-center justify-between px-5 py-[9px] border-b border-black/[0.06] shrink-0 z-50 bg-white">
        <span className="text-[11px] font-bold tracking-[0.18em] text-black/60">DRUCKER.NG</span>
        <Clock />
      </div>

      {/* Desktop area */}
      <div className="flex-1 relative">

        {/* Photo placeholder */}
        <div className="absolute" style={{ left: "calc(50% - 90px)", top: "calc(50% - 120px)" }}>
          <div
            className="flex flex-col justify-end p-2.5"
            style={{
              width: 180, height: 240,
              backgroundImage: [
                "linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.05) 75%)",
                "linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.05) 75%)",
              ].join(", "),
              backgroundSize: "4px 4px",
              backgroundPosition: "0 0, 2px 2px",
              backgroundColor: "#c8c8c8",
            }}
          >
            <span className="text-[10px] tracking-[0.18em] text-black/30">[ photo ]</span>
          </div>
        </div>

        {/* DRUCKER.NG — top right (dark) */}
        <div
          ref={(el) => { folderRefs.current["DRUCKER_NG"] = el; }}
          className="absolute"
          style={{ top: "20%", right: "25%" }}
        >
          <FolderIcon
            name="DRUCKER.NG"
            onClick={() => handleFolderClick("DRUCKER_NG")}
            isOpen={openIds.has("DRUCKER_NG")}
            variant="dark"
          />
        </div>

        {/* PJ_01 — center left (gray) */}
        <div
          ref={(el) => { folderRefs.current["PJ_01"] = el; }}
          className="absolute"
          style={{ top: "35%", left: "35%" }}
        >
          <FolderIcon
            name="PJ_01"
            onClick={() => handleFolderClick("PJ_01")}
            isOpen={openIds.has("PJ_01")}
            variant="gray"
          />
        </div>

        {/* VISION — bottom right (yellow) */}
        <div
          ref={(el) => { folderRefs.current["VISION"] = el; }}
          className="absolute"
          style={{ bottom: "25%", right: "28%" }}
        >
          <FolderIcon
            name="VISION"
            onClick={() => handleFolderClick("VISION")}
            isOpen={openIds.has("VISION")}
            variant="yellow"
          />
        </div>

      </div>

      {/* Footer */}
      <div
        className="fixed left-0 right-0 flex items-center justify-center z-50 pointer-events-none"
        style={{ bottom: "40px" }}
      >
        <div className="flex items-center pointer-events-auto">
          {[
            { label: "youtube",   url: "https://www.youtube.com/@Druckernguyen" },
            { label: "instagram", url: "https://www.instagram.com/drucker_nguyen/" },
            { label: "facebook",  url: "https://www.facebook.com/nguyen.drucker/" },
          ].map(({ label, url }, i) => (
            <span key={label} className="flex items-center">
              {i > 0 && (
                <span className="mx-3 text-[14px]" style={{ color: "#999999", letterSpacing: "0.1em" }}>/</span>
              )}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] transition-colors duration-100 hover:opacity-70"
                style={{ color: "#999999", letterSpacing: "0.14em" }}
              >
                {label}
              </a>
            </span>
          ))}
        </div>
      </div>

      {/* Windows */}
      {windows.map((w) => (
        <Window
          key={w.id}
          title={WIN_CONFIG[w.id].title}
          onClose={() => startClose(w.id)}
          onCloseComplete={() => removeWindow(w.id)}
          onFocus={() => focusWindow(w.id)}
          zIndex={w.zIndex}
          initialX={w.initialX}
          initialY={w.initialY}
          width={WIN_CONFIG[w.id].width}
          folderCenterX={w.folderCenterX}
          folderCenterY={w.folderCenterY}
          closing={w.closing}
        >
          {getContent(w.id)}
        </Window>
      ))}
    </div>
  );
}
