// ─── Color ───────────────────────────────────────────────────────────────────

export type SemanticColorToken =
  | "background"
  | "foreground"
  | "card"
  | "card-foreground"
  | "popover"
  | "popover-foreground"
  | "primary"
  | "primary-foreground"
  | "secondary"
  | "secondary-foreground"
  | "muted"
  | "muted-foreground"
  | "accent"
  | "accent-foreground"
  | "destructive"
  | "destructive-foreground"
  | "success"
  | "success-foreground"
  | "warning"
  | "warning-foreground"
  | "info"
  | "info-foreground"
  | "border"
  | "input"
  | "ring";

export type ChartColorToken = "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5";

export type SidebarColorToken =
  | "sidebar"
  | "sidebar-foreground"
  | "sidebar-primary"
  | "sidebar-primary-foreground"
  | "sidebar-accent"
  | "sidebar-accent-foreground"
  | "sidebar-border"
  | "sidebar-ring";

export type GrayPaletteColor = "slate" | "gray" | "zinc" | "neutral" | "stone";

export type HuePaletteColor =
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

export type PaletteColor = GrayPaletteColor | HuePaletteColor;

export type PaletteScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type SpecialColor = "black" | "white" | "transparent" | "inherit" | "current";

export type ColorToken =
  | SemanticColorToken
  | ChartColorToken
  | SidebarColorToken
  | `${PaletteColor}-${PaletteScale}`
  | SpecialColor;

// ─── Spacing ─────────────────────────────────────────────────────────────────

export type SpacingToken =
  | "px"
  | "0"
  | "0.5"
  | "1"
  | "1.5"
  | "2"
  | "2.5"
  | "3"
  | "3.5"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "14"
  | "16"
  | "20"
  | "24"
  | "28"
  | "32"
  | "36"
  | "40"
  | "44"
  | "48"
  | "52"
  | "56"
  | "60"
  | "64"
  | "72"
  | "80"
  | "96";

// ─── Radius ──────────────────────────────────────────────────────────────────

export type RadiusToken = "base" | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";

// ─── Typography ──────────────────────────────────────────────────────────────

export type FontSizeToken =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

export type FontWeightToken =
  | "thin"
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

export type LineHeightToken = "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";

export type LetterSpacingToken = "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";

export type FontFamilyToken = "sans" | "mono" | "serif";

// ─── Shadow ──────────────────────────────────────────────────────────────────

export type ShadowToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "inner" | "none";

// ─── Motion ──────────────────────────────────────────────────────────────────

export type EasingToken = "linear" | "in" | "out" | "in-out";

export type DurationToken = "75" | "100" | "150" | "200" | "300" | "500" | "700" | "1000";

export type BlurToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

// ─── Layout ──────────────────────────────────────────────────────────────────

export type BreakpointToken = "sm" | "md" | "lg" | "xl" | "2xl";

export type ZIndexToken = "auto" | "0" | "10" | "20" | "30" | "40" | "50";
