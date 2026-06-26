// Reusable, on-brand building blocks for Windmill promo/explainer videos.
// Copy verbatim into the Remotion project's src/. Build scenes from these so the
// look stays consistent across promos. All motion uses interpolate/spring — no
// CSS transitions or Tailwind animation classes (they do not render in Remotion).
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { Video } from "@remotion/media";
import { fontFamily, theme } from "./theme";

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// Fade a scene in at the start and out at the end. Pass the Sequence's
// durationInFrames; uses the local (Sequence-relative) frame.
export const useSceneOpacity = (durationInFrames: number) => {
  const frame = useCurrentFrame();
  return interpolate(
    frame,
    [0, 12, durationInFrames - 12, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};

// Spring entrance: fade + slide up. Stagger siblings by bumping `delay`.
export const Rise: React.FC<{
  delay?: number;
  distance?: number;
  children: React.ReactNode;
}> = ({ delay = 0, distance = 40, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const y = interpolate(s, [0, 1], [distance, 0]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  return <div style={{ transform: `translateY(${y}px)`, opacity }}>{children}</div>;
};

// Constant animated background — render once behind all Sequences.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 70) * 40;
  const blob: React.CSSProperties = {
    position: "absolute",
    width: 760,
    height: 760,
    borderRadius: "50%",
    filter: "blur(130px)",
  };
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${theme.bg0} 0%, ${theme.bg1} 55%, ${theme.bg0} 100%)`,
      }}
    >
      <div style={{ ...blob, background: "rgba(98,100,167,0.38)", top: -180 + drift, left: -160 }} />
      <div style={{ ...blob, background: "rgba(88,101,242,0.32)", bottom: -220 - drift, right: -160 }} />
      <div style={{ ...blob, width: 520, height: 520, background: "rgba(59,130,246,0.20)", top: 300, right: -120 + drift }} />
    </AbsoluteFill>
  );
};

export const Center: React.FC<{ children: React.ReactNode; pad?: number }> = ({
  children,
  pad = 96,
}) => (
  <AbsoluteFill
    style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: pad, fontFamily }}
  >
    {children}
  </AbsoluteFill>
);

// A node in a dataflow diagram. Position by center x; the diagram's vertical
// center `cy` is shared by all nodes on a row.
export const NodeCard: React.FC<{
  cx: number;
  cy: number;
  w: number;
  h: number;
  delay: number;
  accent: string;
  children: React.ReactNode;
}> = ({ cx, cy, w, h, delay, accent, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const scale = interpolate(s, [0, 1], [0.85, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        transform: `scale(${scale})`,
        opacity,
        background: theme.card,
        border: `1px solid ${theme.cardBorder}`,
        borderTop: `4px solid ${accent}`,
        borderRadius: 22,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 18,
        textAlign: "center",
        fontFamily,
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
      }}
    >
      {children}
    </div>
  );
};

// Small monospace chip — good for script/table names inside a NodeCard.
export const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: "ui-monospace, Menlo, monospace",
      fontSize: 17,
      color: theme.white,
      background: "rgba(59,130,246,0.18)",
      border: "1px solid rgba(59,130,246,0.45)",
      borderRadius: 9,
      padding: "6px 12px",
    }}
  >
    {children}
  </div>
);

// Dots traveling along a horizontal segment to show flow direction. Place inside
// an <svg viewBox="0 0 W H">. Direction is x0 -> x1.
export const FlowDots: React.FC<{
  x0: number;
  x1: number;
  y: number;
  color: string;
  opacity: number;
}> = ({ x0, x1, y, color, opacity }) => {
  const frame = useCurrentFrame();
  const period = 45;
  return (
    <>
      {[0, 1].map((i) => {
        const p = ((((frame + i * (period / 2)) % period) + period) % period) / period;
        const x = x0 + (x1 - x0) * p;
        const edge = Math.min(p, 1 - p);
        const o = interpolate(edge, [0, 0.12], [0, 1], { extrapolateRight: "clamp" }) * opacity;
        return <circle key={i} cx={x} cy={y} r={5} fill={color} opacity={o} />;
      })}
    </>
  );
};

const TrafficDot: React.FC<{ c: string }> = ({ c }) => (
  <div style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
);

// A mac-style browser window wrapping an embedded screen recording (from public/).
// Convert the raw .mov to an optimized mp4 first (see SKILL.md "Demo clips").
export const BrowserFrame: React.FC<{ src: string; width?: number }> = ({
  src,
  width = 900,
}) => (
  <div
    style={{
      width,
      borderRadius: 18,
      overflow: "hidden",
      border: `1px solid ${theme.cardBorder}`,
      boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
      background: "#0e1330",
    }}
  >
    <div
      style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "0 18px",
        background: "rgba(255,255,255,0.06)",
      }}
    >
      <TrafficDot c="#ff5f57" />
      <TrafficDot c="#febc2e" />
      <TrafficDot c="#28c840" />
    </div>
    <Video src={staticFile(src)} style={{ width: "100%", display: "block" }} />
  </div>
);

// Convenience: an SVG logo from public/ sized by height.
export const Logo: React.FC<{ file: string; height: number }> = ({ file, height }) => (
  <Img src={staticFile(file)} style={{ height, width: "auto" }} />
);
