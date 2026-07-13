/**
 * Fixed film-grain texture over the whole experience. Pure CSS/SVG fractal
 * noise — no JS, no network request, GPU-cheap. This one detail is most of what
 * separates "a website" from "a film still".
 */
const GRAIN_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>
       <filter id='n'>
         <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>
         <feColorMatrix type='saturate' values='0'/>
       </filter>
       <rect width='100%' height='100%' filter='url(#n)'/>
     </svg>`,
  );

export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="grain-layer"
      style={{ backgroundImage: `url("${GRAIN_SVG}")`, backgroundSize: "140px 140px" }}
    />
  );
}
