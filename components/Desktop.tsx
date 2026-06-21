"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import FolderIcon from "./FolderIcon";
import Window from "./Window";

type WinId = "PJ_01" | "VISION" | "DRUCKER_NG";
type Lang = "vi" | "en";

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

// ─── Bio text ───────────────────────────────────────────────────

const VI_BIO = [
  "Mình là Nguyễn Trí Đức — sinh viên Công nghệ Sinh học tại Đại học Bách Khoa TP.HCM.",
  "Nghe có vẻ không liên quan, nhưng song song với hành trình học thuật đó, mình còn đang theo đuổi sáng tạo nội dung, kỹ thuật hình ảnh, quay phim, powerlifting và khoa học thể thao. Mình không có một lý giải hoàn hảo nào cho việc tại sao một người học sinh học lại quan tâm đến tất cả những thứ đó cùng một lúc — nhưng nhìn lại, mình nghĩ đó chính xác là con người mình: một người không chịu được cảm giác dừng lại ở bề mặt của bất cứ thứ gì.",
  "Mỗi lĩnh vực mình chạm vào đều dạy mình một cách nhìn khác nhau. Sinh học dạy mình tư duy hệ thống và sự kiên nhẫn với những thứ không thể thấy ngay kết quả. Kỹ thuật hình ảnh và quay phim dạy mình cách chuyển hóa một ý tưởng còn mơ hồ thành thứ gì đó người khác có thể nhìn thấy và cảm nhận được. Powerlifting dạy mình rằng giới hạn thường nằm trong đầu trước khi nằm trong cơ thể — và rằng tiến bộ thật sự không bao giờ đến từ việc làm vừa đủ.",
  "Chính vì vậy, khi mình tham gia vào bất kỳ dự án nào — dù là một video, một buổi coaching, hay một công trình nghiên cứu — mình không có thói quen làm cho xong. Với mình, được tin tưởng giao việc là một thứ gì đó mình xem rất nghiêm túc. Mình hiểu rằng đằng sau mỗi dự án đều có người đã đặt vào đó thời gian, kỳ vọng và đôi khi là cả niềm tin — và mình không muốn là người làm những thứ đó trở nên lãng phí.",
  "Mình không tự nhận mình đã giỏi ở tất cả mọi thứ. Nhưng có một thứ mình chắc chắn: mình luôn mang vào từng dự án tất cả những gì mình có ở thời điểm đó — sự tập trung, sự tò mò, và cái mong muốn được đẩy kết quả đi xa hơn mức chỉ “đạt yêu cầu”. Với mình, khoảng cách giữa một sản phẩm ổn và một sản phẩm thật sự tốt thường nằm ở chỗ người làm ra nó có thực sự quan tâm đến nó hay không.",
  "Tất cả những thứ mình theo đuổi — dù khác nhau đến đâu — đều có chung một điểm xuất phát: mình chỉ làm những gì mình thực sự muốn đi đến tận cùng. Và với mình, đó là cách duy nhất để tạo ra thứ gì đó có ý nghĩa — không chỉ với bản thân mình, mà còn với những người đã tin tưởng đồng hành cùng mình.",
];

const EN_BIO = [
  "I’m Nguyen Tri Duc — a Biotechnology student at Ho Chi Minh City University of Technology (HCMUT).",
  "It might not seem like an obvious combination, but alongside my academic path, I’ve been pursuing content creation, visual production, filmmaking, powerlifting, and sports science. I don’t have a perfect explanation for why someone studying biology would care about all of these at once — but looking back, I think that’s exactly who I am: someone who can’t stay on the surface of anything.",
  "Every field I’ve touched has given me a different way of seeing. Biology taught me systems thinking and patience with things that don’t show results right away. Visual production and filmmaking taught me how to turn a vague idea into something others can actually see and feel. Powerlifting taught me that limits usually live in the mind before they live in the body — and that real progress never comes from doing just enough.",
  "That’s why, when I take on any project — whether it’s a video, a coaching session, or a research assignment — I don’t do it just to get it done. Being trusted with someone’s work is something I take seriously. I understand that behind every project, there’s someone who has invested time, expectations, and sometimes genuine trust — and I don’t want to be the person who wastes that.",
  "I don’t claim to be great at everything. But there’s one thing I’m certain of: I bring everything I have to each project at that moment — focus, curiosity, and the desire to push the outcome further than just “good enough.” To me, the gap between a decent product and a truly great one usually comes down to whether the person who made it actually cared.",
  "Everything I pursue — no matter how different — shares the same starting point: I only commit to what I genuinely want to see through to the end. To me, that’s the only way to create something meaningful — not just for myself, but for the people who trusted me along the way.",
];

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

function VisionContent({ lang }: { lang: Lang }) {
  return (
    <div>
      <p className="text-[12px] tracking-[0.2em] uppercase text-black/30 mb-4">PJ SERIES</p>
      {lang === "vi" ? (
        <p className="text-[15px] text-black/65 leading-[1.9]">
          PJ SERIES là chuỗi dự án thử nghiệm mang tính cá nhân — có thể là short film, MV,
          visual effects, hay bất cứ thứ gì mình muốn khám phá. Đây là nơi mình vận dụng những
          gì đã học, kết hợp kỹ thuật và sáng tạo để tạo ra những thứ thật sự của riêng mình.{" "}
          <span className="text-black/35">Không có công thức. Chỉ có thử nghiệm.</span>
        </p>
      ) : (
        <p className="text-[15px] text-black/65 leading-[1.9]">
          PJ SERIES is a personal experimental project series — it could be a short film, MV,
          visual effects, or anything I want to explore. This is where I apply what I&apos;ve
          learned, blending technique and creativity to make things that are genuinely my own.{" "}
          <span className="text-black/35">No formula. Just experimentation.</span>
        </p>
      )}
    </div>
  );
}

function DruckerContent({ lang }: { lang: Lang }) {
  const bio = lang === "vi" ? VI_BIO : EN_BIO;
  const role = lang === "vi"
    ? "Sinh viên · HCMUT · TP. Hồ Chí Minh"
    : "Student · HCMUT · Ho Chi Minh City";

  return (
    <div>
      <p className="text-[19px] font-bold tracking-[0.08em] text-black mb-1">DRUCKER NGUYEN</p>
      <p className="text-[13px] text-black/35 tracking-[0.05em] mb-6">{role}</p>

      <div className="border-t border-black/8 pt-5 mb-6 flex flex-col gap-4">
        {bio.map((p, i) => (
          <p key={i} className="text-[15px] text-black/55 leading-[1.85]">{p}</p>
        ))}
      </div>

      <div className="border-t border-black/8 pt-5">
        <p className="text-[12px] tracking-[0.2em] uppercase text-black/25 mb-4">Links</p>
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

function getContent(id: WinId, lang: Lang) {
  if (id === "PJ_01")  return <PJ01Content />;
  if (id === "VISION") return <VisionContent lang={lang} />;
  return <DruckerContent lang={lang} />;
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
  // Separate refs for mobile and desktop layouts so getBoundingClientRect works on the visible element
  const mFolderRefs = useRef<Partial<Record<WinId, HTMLDivElement | null>>>({});
  const dFolderRefs = useRef<Partial<Record<WinId, HTMLDivElement | null>>>({});

  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoVisible, setPhotoVisible] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lang, setLang] = useState<Lang>("vi");

  const getFolderCenter = (id: WinId) => {
    const isMob = typeof window !== "undefined" && window.innerWidth < 768;
    const el = isMob ? mFolderRefs.current[id] : dFolderRefs.current[id];
    const rect = el?.getBoundingClientRect();
    return {
      x: rect ? rect.left + rect.width  / 2 : (typeof window !== "undefined" ? window.innerWidth  / 2 : 640),
      y: rect ? rect.top  + rect.height / 2 : (typeof window !== "undefined" ? window.innerHeight / 2 : 360),
    };
  };

  const handleFolderClick = useCallback((id: WinId) => {
    const center = getFolderCenter(id);
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      topZ.current += 1;

      if (existing && !existing.closing) {
        return prev.map((w) => w.id === id ? { ...w, closing: true } : w);
      }
      if (existing && existing.closing) return prev;

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

  const startClose = useCallback((id: WinId) => {
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, closing: true } : w));
  }, []);

  const removeWindow = useCallback((id: WinId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: WinId) => {
    setWindows((prev) => {
      topZ.current += 1;
      return prev.map((w) => w.id === id ? { ...w, zIndex: topZ.current } : w);
    });
  }, []);

  const openPhoto = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setPhotoOpen(true);
    requestAnimationFrame(() => setPhotoVisible(true));
  }, []);

  const closePhoto = useCallback(() => {
    setPhotoVisible(false);
    closeTimerRef.current = setTimeout(() => setPhotoOpen(false), 250);
  }, []);

  const openIds = new Set(windows.filter((w) => !w.closing).map((w) => w.id));

  return (
    <div className="desktop-bg w-screen h-screen overflow-hidden relative flex flex-col select-none">

      {/* Menubar */}
      <div className="flex items-center justify-between px-5 py-[9px] border-b border-black/[0.06] shrink-0 z-50 bg-white">
        <span className="text-[11px] font-bold tracking-[0.18em] text-black/60">DRUCKER.NG</span>
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <div className="flex items-center gap-[6px] text-[11px] tracking-[0.1em]">
            <button
              onClick={() => setLang("en")}
              className={`transition-colors duration-100 ${lang === "en" ? "text-black/70" : "text-black/25 hover:text-black/50"}`}
            >
              EN
            </button>
            <span className="text-black/20">/</span>
            <button
              onClick={() => setLang("vi")}
              className={`transition-colors duration-100 ${lang === "vi" ? "text-black/70" : "text-black/25 hover:text-black/50"}`}
            >
              VI
            </button>
          </div>
          <Clock />
        </div>
      </div>

      {/* Desktop area */}
      <div className="flex-1 relative overflow-hidden">

        {/* ── Mobile layout (< 768px) ── */}
        <div className="md:hidden h-full relative">

          {/* Photo — centered */}
          <div className="absolute" style={{ left: "calc(50% - 60px)", top: "calc(50% - 80px)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photo.jpg.png"
              alt="photo"
              onClick={openPhoto}
              style={{ width: 120, height: 160, objectFit: "contain", display: "block", cursor: "pointer" }}
            />
          </div>

          {/* PJ_01 — left side, vertically centered with photo */}
          <div
            ref={(el) => { mFolderRefs.current["PJ_01"] = el; }}
            className="absolute"
            style={{ left: "calc(50% - 162px)", top: "calc(50% - 51px)", transform: "scale(0.67)", transformOrigin: "center center" }}
          >
            <FolderIcon name="PJ_01" onClick={() => handleFolderClick("PJ_01")} isOpen={openIds.has("PJ_01")} variant="gray" />
          </div>

          {/* VISION — top right of photo */}
          <div
            ref={(el) => { mFolderRefs.current["VISION"] = el; }}
            className="absolute"
            style={{ left: "calc(50% + 50px)", top: "calc(50% - 173px)", transform: "scale(0.67)", transformOrigin: "center center" }}
          >
            <FolderIcon name="VISION" onClick={() => handleFolderClick("VISION")} isOpen={openIds.has("VISION")} variant="yellow" />
          </div>

          {/* DRUCKER.NG — bottom right of photo */}
          <div
            ref={(el) => { mFolderRefs.current["DRUCKER_NG"] = el; }}
            className="absolute"
            style={{ left: "calc(50% + 50px)", top: "calc(50% + 68px)", transform: "scale(0.67)", transformOrigin: "center center" }}
          >
            <FolderIcon name="DRUCKER.NG" onClick={() => handleFolderClick("DRUCKER_NG")} isOpen={openIds.has("DRUCKER_NG")} variant="dark" />
          </div>

        </div>

        {/* ── Desktop layout (≥ 768px) ── */}
        <div className="hidden md:block h-full relative">

          {/* Photo */}
          <div className="absolute" style={{ left: "calc(50% - 90px)", top: "calc(50% - 120px)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photo.jpg.png"
              alt="photo"
              onClick={openPhoto}
              style={{ width: 180, height: 240, objectFit: "contain", display: "block", cursor: "pointer" }}
            />
          </div>

          {/* DRUCKER.NG — top right (dark) */}
          <div
            ref={(el) => { dFolderRefs.current["DRUCKER_NG"] = el; }}
            className="absolute"
            style={{ top: "20%", right: "25%" }}
          >
            <FolderIcon name="DRUCKER.NG" onClick={() => handleFolderClick("DRUCKER_NG")} isOpen={openIds.has("DRUCKER_NG")} variant="dark" />
          </div>

          {/* PJ_01 — center left (gray) */}
          <div
            ref={(el) => { dFolderRefs.current["PJ_01"] = el; }}
            className="absolute"
            style={{ top: "35%", left: "35%" }}
          >
            <FolderIcon name="PJ_01" onClick={() => handleFolderClick("PJ_01")} isOpen={openIds.has("PJ_01")} variant="gray" />
          </div>

          {/* VISION — bottom right (yellow) */}
          <div
            ref={(el) => { dFolderRefs.current["VISION"] = el; }}
            className="absolute"
            style={{ bottom: "25%", right: "28%" }}
          >
            <FolderIcon name="VISION" onClick={() => handleFolderClick("VISION")} isOpen={openIds.has("VISION")} variant="yellow" />
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="fixed bottom-6 md:bottom-10 left-0 right-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="flex items-center pointer-events-auto">
          {[
            { label: "youtube",   url: "https://www.youtube.com/@Druckernguyen" },
            { label: "instagram", url: "https://www.instagram.com/drucker_nguyen/" },
            { label: "facebook",  url: "https://www.facebook.com/nguyen.drucker/" },
          ].map(({ label, url }, i) => (
            <span key={label} className="flex items-center">
              {i > 0 && (
                <span className="mx-2 md:mx-3 text-[14px]" style={{ color: "#999999", letterSpacing: "0.1em" }}>/</span>
              )}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] md:text-[14px] transition-colors duration-100 hover:opacity-70"
                style={{ color: "#999999", letterSpacing: "0.14em" }}
              >
                {label}
              </a>
            </span>
          ))}
        </div>
      </div>

      {/* Photo overlay */}
      {photoOpen && (
        <div
          onClick={closePhoto}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: photoVisible ? 1 : 0,
            transition: "opacity 250ms ease",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photo.jpg.png"
            alt="photo"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              display: "block",
              transform: photoVisible ? "scale(1)" : "scale(0.95)",
              transition: "transform 250ms ease",
            }}
          />
        </div>
      )}

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
          {getContent(w.id, lang)}
        </Window>
      ))}
    </div>
  );
}
