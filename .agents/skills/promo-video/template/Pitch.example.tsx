// EXAMPLE composition — copy to src/Pitch.tsx and adapt the nodes/labels/text to
// your topic. Demonstrates the default 3-act structure: title -> architecture
// (dataflow) -> demo. Keep the architecture act as the centerpiece. Tone is
// explanatory, not salesy (see SKILL.md).
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily, theme, logos } from "./theme";
import {
  Background,
  BrowserFrame,
  Center,
  FlowDots,
  Logo,
  NodeCard,
  Pill,
  Rise,
  useSceneOpacity,
} from "./components";

// ----- Act 1: title ---------------------------------------------------------

const Title: React.FC<{ dur: number }> = ({ dur }) => {
  const opacity = useSceneOpacity(dur);
  return (
    <AbsoluteFill style={{ opacity }}>
      <Center>
        <Rise delay={0}>
          <div style={{ color: theme.windmillLight, fontSize: 28, fontWeight: 700, letterSpacing: 6, textTransform: "uppercase", marginBottom: 40 }}>
            Teams &#8596; Discord bridge
          </div>
        </Rise>
        <Rise delay={6}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 50 }}>
            <Logo file={logos.teams} height={150} />
            <span style={{ fontSize: 78, color: theme.muted, fontWeight: 300 }}>&#8644;</span>
            <Logo file={logos.discord} height={120} />
          </div>
        </Rise>
        <Rise delay={16}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontSize: 50, fontWeight: 700, color: theme.white, marginTop: 46 }}>
            <span>bridged with</span>
            <Logo file={logos.windmill} height={56} />
            <span>Windmill</span>
          </div>
        </Rise>
        {/* Neutral, mechanical subline — not a marketing claim. */}
        <Rise delay={24}>
          <div style={{ fontSize: 32, fontWeight: 500, color: theme.muted, marginTop: 24 }}>
            Two scripts, two triggers, one shared state.
          </div>
        </Rise>
      </Center>
    </AbsoluteFill>
  );
};

// ----- Act 2: architecture / dataflow (the centerpiece) ---------------------

const CY = 600;
// Wide gaps (~185px) between cards so trigger labels fit between them, not over them.
const NODES = {
  teams: { cx: 128, w: 185, h: 250 },
  wm: { cx: 540, w: 270, h: 330 },
  discord: { cx: 952, w: 185, h: 250 },
};

const Architecture: React.FC<{ dur: number }> = ({ dur }) => {
  const opacity = useSceneOpacity(dur);
  const frame = useCurrentFrame();
  const conn = interpolate(frame, [22, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tRight = NODES.teams.cx + NODES.teams.w / 2;
  const wLeft = NODES.wm.cx - NODES.wm.w / 2;
  const wRight = NODES.wm.cx + NODES.wm.w / 2;
  const dLeft = NODES.discord.cx - NODES.discord.w / 2;
  const topY = CY - 34;
  const botY = CY + 34;
  const pad = 6;

  const arrow = (x1: number, x2: number, y: number, color: string, marker: string) => (
    <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={3} markerEnd={`url(#${marker})`} opacity={conn} />
  );
  // Label width is constrained to the inter-card gap and centered in it, so a long
  // label wraps inside the gap instead of spilling over the cards.
  const LW = 182;
  const label = (text: string, cx: number, y: number, color: string, size = 20, weight = 700) => (
    <div style={{ position: "absolute", left: cx - LW / 2, top: y, width: LW, textAlign: "center", lineHeight: 1.12, color, fontSize: size, fontWeight: weight, opacity: conn }}>
      {text}
    </div>
  );

  return (
    <AbsoluteFill style={{ opacity, fontFamily }}>
      <div style={{ position: "absolute", top: 96, width: "100%", textAlign: "center" }}>
        <Rise delay={0}>
          <div style={{ fontSize: 60, fontWeight: 800, color: theme.white }}>Where Windmill sits</div>
        </Rise>
        <Rise delay={6}>
          <div style={{ fontSize: 28, fontWeight: 500, color: theme.muted, marginTop: 10 }}>
            Two trigger-driven scripts route messages both ways
          </div>
        </Rise>
      </div>

      <svg width={1080} height={1080} viewBox="0 0 1080 1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <marker id="ahBlue" markerWidth={8} markerHeight={8} refX={5} refY={3} orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" fill={theme.windmill} />
          </marker>
          <marker id="ahMuted" markerWidth={8} markerHeight={8} refX={5} refY={3} orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" fill={theme.muted} />
          </marker>
        </defs>
        {/* inbound (blue, toward Windmill) on top, outbound (muted) on bottom */}
        {arrow(tRight + pad, wLeft - pad, topY, theme.windmill, "ahBlue")}
        {arrow(wLeft - pad, tRight + pad, botY, theme.muted, "ahMuted")}
        <FlowDots x0={tRight + pad} x1={wLeft - pad} y={topY} color={theme.windmill} opacity={conn} />
        <FlowDots x0={wLeft - pad} x1={tRight + pad} y={botY} color={theme.muted} opacity={conn} />
        {arrow(dLeft - pad, wRight + pad, topY, theme.windmill, "ahBlue")}
        {arrow(wRight + pad, dLeft - pad, botY, theme.muted, "ahMuted")}
        <FlowDots x0={dLeft - pad} x1={wRight + pad} y={topY} color={theme.windmill} opacity={conn} />
        <FlowDots x0={wRight + pad} x1={dLeft - pad} y={botY} color={theme.muted} opacity={conn} />
      </svg>

      {/* Label inbound arrows with the actual triggers; outbound with the mechanism. */}
      {label("HTTP trigger", (tRight + wLeft) / 2, topY - 52, theme.windmill, 20)}
      {label("Bot Framework send", (tRight + wLeft) / 2, botY + 18, theme.muted, 16, 500)}
      {label("WebSocket trigger", (wRight + dLeft) / 2, topY - 52, theme.windmill, 20)}
      {label("create / reply", (wRight + dLeft) / 2, botY + 18, theme.muted, 16, 500)}

      <NodeCard cx={NODES.teams.cx} cy={CY} w={NODES.teams.w} h={NODES.teams.h} delay={8} accent={theme.teams}>
        <Logo file={logos.teams} height={72} />
        <div style={{ fontSize: 24, fontWeight: 800, color: theme.white }}>Microsoft Teams</div>
        <div style={{ fontSize: 18, color: theme.muted }}>channel + bot</div>
      </NodeCard>
      <NodeCard cx={NODES.wm.cx} cy={CY} w={NODES.wm.w} h={NODES.wm.h} delay={12} accent={theme.windmill}>
        <Logo file={logos.windmill} height={60} />
        <div style={{ fontSize: 27, fontWeight: 800, color: theme.white }}>Windmill</div>
        <Pill>bot_framework_handler</Pill>
        <Pill>discord_handler</Pill>
        <div style={{ fontSize: 17, color: theme.muted, marginTop: 2 }}>shared state &middot; data table</div>
      </NodeCard>
      <NodeCard cx={NODES.discord.cx} cy={CY} w={NODES.discord.w} h={NODES.discord.h} delay={16} accent={theme.discord}>
        <Logo file={logos.discord} height={58} />
        <div style={{ fontSize: 24, fontWeight: 800, color: theme.white }}>Discord</div>
        <div style={{ fontSize: 18, color: theme.muted }}>forum channel + bot</div>
      </NodeCard>
    </AbsoluteFill>
  );
};

// ----- Act 3: demo ----------------------------------------------------------

const Demo: React.FC<{ dur: number }> = ({ dur }) => {
  const opacity = useSceneOpacity(dur);
  return (
    <AbsoluteFill style={{ opacity }}>
      <Center pad={70}>
        <Rise delay={0}>
          <div style={{ fontSize: 56, fontWeight: 800, color: theme.white, marginBottom: 14 }}>
            A dashboard over the bridge
          </div>
        </Rise>
        <Rise delay={6}>
          <div style={{ fontSize: 30, fontWeight: 500, color: theme.muted, marginBottom: 40 }}>
            A Windmill app reading the shared state and the data table
          </div>
        </Rise>
        <Rise delay={12} distance={30}>
          <BrowserFrame src="dashboard.mp4" width={900} />
        </Rise>
      </Center>
    </AbsoluteFill>
  );
};

// ----- assembly -------------------------------------------------------------

export const SCENES = { title: 3.5, arch: 7, demo: 5.5 }; // seconds

export const Pitch: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = (n: number) => Math.round(n * fps);
  let at = 0;
  const next = (d: number) => {
    const from = at;
    at += d;
    return from;
  };
  const titleDur = s(SCENES.title);
  const archDur = s(SCENES.arch);
  const demoDur = s(SCENES.demo);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg0 }}>
      <Background />
      <Sequence from={next(titleDur)} durationInFrames={titleDur} layout="none">
        <Title dur={titleDur} />
      </Sequence>
      <Sequence from={next(archDur)} durationInFrames={archDur} layout="none">
        <Architecture dur={archDur} />
      </Sequence>
      <Sequence from={next(demoDur)} durationInFrames={demoDur} layout="none">
        <Demo dur={demoDur} />
      </Sequence>
    </AbsoluteFill>
  );
};
