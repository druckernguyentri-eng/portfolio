"use client";

export type FolderVariant = "gray" | "yellow" | "dark";

interface Props {
  name: string;
  onClick: () => void;
  isOpen?: boolean;
  variant?: FolderVariant;
}

// Checkerboard dither per variant — two 45° gradients offset by 2px
const DITHER: Record<FolderVariant, React.CSSProperties> = {
  gray: {
    backgroundImage: [
      "linear-gradient(45deg, rgba(0,0,0,0.16) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.16) 75%)",
      "linear-gradient(45deg, rgba(0,0,0,0.16) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.16) 75%)",
    ].join(", "),
    backgroundSize: "4px 4px",
    backgroundPosition: "0 0, 2px 2px",
  },
  yellow: {
    backgroundImage: [
      "linear-gradient(45deg, rgba(160,100,0,0.22) 25%, transparent 25%, transparent 75%, rgba(160,100,0,0.22) 75%)",
      "linear-gradient(45deg, rgba(160,100,0,0.22) 25%, transparent 25%, transparent 75%, rgba(160,100,0,0.22) 75%)",
    ].join(", "),
    backgroundSize: "4px 4px",
    backgroundPosition: "0 0, 2px 2px",
  },
  dark: {
    backgroundImage: [
      "linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.08) 75%)",
      "linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.08) 75%)",
    ].join(", "),
    backgroundSize: "4px 4px",
    backgroundPosition: "0 0, 2px 2px",
  },
};

const COLORS: Record<FolderVariant, { tab: string; body: string; border: string; openTab: string; openBody: string; openBorder: string }> = {
  gray: {
    tab:         "#e2e2e2",
    body:        "#e2e2e2",
    border:      "#aaa",
    openTab:     "#d0d0d0",
    openBody:    "#c8c8c8",
    openBorder:  "#888",
  },
  yellow: {
    tab:         "#FFE84D",
    body:        "#FFE84D",
    border:      "#c8a800",
    openTab:     "#e6cf00",
    openBody:    "#d4bf00",
    openBorder:  "#b89a00",
  },
  dark: {
    tab:         "#0d0d0d",
    body:        "#0d0d0d",
    border:      "#333",
    openTab:     "#1e1e1e",
    openBody:    "#1a1a1a",
    openBorder:  "#444",
  },
};

function FolderShape({ isOpen, variant }: { isOpen: boolean; variant: FolderVariant }) {
  const c = COLORS[variant];
  const tabColor  = isOpen ? c.openTab    : c.tab;
  const bodyColor = isOpen ? c.openBody   : c.body;
  const border    = isOpen ? c.openBorder : c.border;
  const dither    = DITHER[variant];

  // Container: 80px wide, 70px tall
  // Tab: 40% width (32px), 16px tall, overlaps body by 4px
  // Body: starts at top 12px → body height = 58px

  const tabStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: 32,
    height: 16,
    backgroundColor: tabColor,
    borderWidth: "1.5px 1.5px 0 1.5px",
    borderStyle: "solid",
    borderColor: border,
    borderRadius: "6px 6px 0 0",
    ...dither,
  };

  const bodyStyle: React.CSSProperties = {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: bodyColor,
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: border,
    borderRadius: "4px 8px 8px 8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    ...dither,
  };

  return (
    <div className="w-[80px] h-[70px] relative">
      <div style={tabStyle} />
      <div style={bodyStyle} />
    </div>
  );
}

const LABEL_COLOR: Record<FolderVariant, string> = {
  gray:   "text-black/60 group-hover:text-black/90",
  yellow: "text-[#a07800] group-hover:text-[#7a5c00]",
  dark:   "text-black/60 group-hover:text-black/90",
};

export default function FolderIcon({ name, onClick, isOpen = false, variant = "gray" }: Props) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-[11px] px-4 py-3 rounded transition-colors duration-75 hover:bg-black/[0.04] active:bg-black/[0.08] outline-none"
    >
      <FolderShape isOpen={isOpen} variant={variant} />
      <span className={`text-[14px] tracking-[0.06em] transition-colors duration-75 ${LABEL_COLOR[variant]}`}>
        {name}
      </span>
    </button>
  );
}
