import {
  MKZ_PROFILE,
  MKZ_GREENHOUSE,
  OLLI_PROFILE,
  type Pt2,
} from "@/lib/hero-geometry";

/**
 * Renders the same stylized vehicle profiles used by the WebGL scenes as
 * flat SVG line art — for the mobile / reduced-motion experience and any
 * place a lightweight wireframe is needed. Keeps the visual system in sync.
 */

const S = 56; // px per world unit

function toPoints(profile: Pt2[], h: number): string {
  return profile.map(([x, y]) => `${(x + 2.75) * S},${h - y * S}`).join(" ");
}

function Wheel({ cx, h, r }: { cx: number; h: number; r: number }) {
  return (
    <circle
      cx={(cx + 2.75) * S}
      cy={h - 0.36 * S}
      r={r * S}
      fill="none"
    />
  );
}

export function MkzSVG({ className = "" }: { className?: string }) {
  const h = 1.7 * S;
  return (
    <svg
      viewBox={`0 0 ${5.5 * S} ${h}`}
      className={className}
      role="img"
      aria-label="Line drawing of the Lincoln MKZ research vehicle"
      stroke="#7DD3FC"
      strokeWidth="1.2"
      fill="none"
      opacity="0.9"
    >
      <polygon points={toPoints(MKZ_PROFILE, h)} fill="none" />
      <polyline points={toPoints(MKZ_GREENHOUSE, h)} fill="none" />
      <Wheel cx={1.52} h={h} r={0.36} />
      <Wheel cx={-1.52} h={h} r={0.36} />
    </svg>
  );
}

export function OlliSVG({ className = "" }: { className?: string }) {
  const h = 2.4 * S;
  return (
    <svg
      viewBox={`0 0 ${5.5 * S} ${h}`}
      className={className}
      role="img"
      aria-label="Line drawing of the Olli autonomous shuttle"
      stroke="#5EEAD4"
      strokeWidth="1.2"
      fill="none"
      opacity="0.9"
    >
      <polygon points={toPoints(OLLI_PROFILE, h)} fill="none" />
      <line x1={(-1.58 + 2.75) * S} y1={h - 1.05 * S} x2={(1.58 + 2.75) * S} y2={h - 1.05 * S} />
      <line x1={(-1.58 + 2.75) * S} y1={h - 1.78 * S} x2={(1.58 + 2.75) * S} y2={h - 1.78 * S} />
      <Wheel cx={0.95} h={h} r={0.26} />
      <Wheel cx={-0.95} h={h} r={0.26} />
    </svg>
  );
}

/** Driving-simulator rig (monitor + wheel + pedals) for the digital-twin
 *  beat's static representation — same line-art system as the vehicles. */
export function SimRigSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 170"
      className={className}
      role="img"
      aria-label="Line drawing of a driving simulator rig with monitor, steering wheel, and pedals"
      stroke="#7DD3FC"
      strokeWidth="1.2"
      fill="none"
      opacity="0.9"
    >
      {/* monitor + screen with a tiny live intersection inside */}
      <rect x="60" y="18" width="120" height="70" rx="2" />
      <rect x="66" y="24" width="108" height="58" rx="1" />
      <g stroke="#5EEAD4" strokeWidth="0.9">
        <line x1="74" y1="66" x2="166" y2="66" />
        <line x1="120" y1="30" x2="120" y2="76" strokeDasharray="3 3" />
        <rect x="94" y="58" width="16" height="7" />
        <rect x="134" y="50" width="12" height="10" />
        <circle cx="152" cy="40" r="7" opacity="0.6" />
      </g>
      {/* stand + desk */}
      <line x1="120" y1="88" x2="120" y2="98" />
      <line x1="40" y1="104" x2="200" y2="104" />
      <line x1="48" y1="104" x2="48" y2="158" />
      <line x1="192" y1="104" x2="192" y2="158" />
      {/* steering wheel */}
      <ellipse cx="120" cy="118" rx="22" ry="9" />
      <line x1="120" y1="112" x2="120" y2="104" />
      {/* pedals */}
      <rect x="104" y="140" width="12" height="16" transform="skewY(-8)" />
      <rect x="126" y="138" width="12" height="16" transform="skewY(-8)" />
      {/* sync leader */}
      <g stroke="#5EEAD4" strokeWidth="0.9">
        <line x1="180" y1="26" x2="196" y2="12" />
        <line x1="196" y1="12" x2="222" y2="12" />
      </g>
    </svg>
  );
}

/** Small LiDAR puck glyph. */
export function LidarSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 90"
      className={className}
      role="img"
      aria-label="Line drawing of a LiDAR sensor"
      stroke="#5EEAD4"
      strokeWidth="1.2"
      fill="none"
      opacity="0.9"
    >
      <ellipse cx="60" cy="25" rx="34" ry="9" />
      <ellipse cx="60" cy="65" rx="34" ry="9" />
      <line x1="26" y1="25" x2="26" y2="65" />
      <line x1="94" y1="25" x2="94" y2="65" />
      <ellipse cx="60" cy="45" rx="34" ry="9" opacity="0.5" />
      <ellipse cx="60" cy="55" rx="34" ry="9" opacity="0.5" />
    </svg>
  );
}
