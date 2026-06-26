// Locked Windmill video style tokens. Copy verbatim into the Remotion project's
// src/. Do not invent new colors — keep promos visually consistent.
import { loadFont } from "@remotion/google-fonts/Inter";

export const { fontFamily } = loadFont();

export const theme = {
  bg0: "#080b1f", // gradient base (dark)
  bg1: "#111a3a", // gradient mid
  windmill: "#3b82f6", // Windmill brand blue — primary accent, inbound arrows
  windmillLight: "#bcd4fc", // kicker / highlights
  teams: "#6264a7", // Microsoft Teams brand
  discord: "#5865f2", // Discord blurple
  white: "#ffffff",
  muted: "#94a3b8", // secondary text, outbound arrows
  card: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(255,255,255,0.12)",
};

// Logo filenames expected in public/. Copy the real assets from the docs repo —
// never fake a logo with colored text. See SKILL.md "Assets".
//   static/img/windmill.svg            -> public/windmill.svg
//   static/third_party_logos/teams.svg -> public/teams.svg
//   static/third_party_logos/<x>.svg   -> public/<x>.svg
export const logos = {
  windmill: "windmill.svg",
  teams: "teams.svg",
  discord: "discord.svg",
};
