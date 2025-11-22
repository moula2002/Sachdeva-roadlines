import React from "react";

/**
 * SechdevaLogo
 *  - Renders a white-only logo icon with a transparent background using an image mask.
 *  - Props:
 *     - src: string (required) - URL or data-URI of the source raster logo image (preferably high-contrast: white-on-black or black-on-white)
 *     - size: number (optional) - width & height in pixels (default: 45)
 *     - ariaLabel: string (optional) - accessibility label
 *
 * Example usage:
 * <SechdevaLogo src="/assets/sachdeva_logo_45.png" size={45} ariaLabel="Company logo" />
 *
 * Notes:
 * - This component uses an SVG mask. The source image's luminance will be used to create the alpha mask
 *   so the visible part will render in solid white while the background stays transparent.
 * - If you already have an SVG path version of the logo, prefer embedding the path directly for best
 *   scalability and crispness. This approach works well with high-contrast raster images.
 */



export default function SachdevaLogo({
  src,
  size = 55,
  color = "#ffffff", // <-- add this line
  ariaLabel = "logo",
}) {
  const id = React.useMemo(() => `logoMask-${Math.random().toString(36).slice(2)}`, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id={id} maskUnits="objectBoundingBox" maskContentUnits="userSpaceOnUse">
          <image
            href={src}
            x="0"
            y="0"
            width={size}
            height={size}
            preserveAspectRatio="xMidYMid meet"
          />
        </mask>
      </defs>

      {/* Use the dynamic color instead of fixed white */}
      <rect x="0" y="0" width={size} height={size} fill={color} mask={`url(#${id})`} />
    </svg>
  );
}
