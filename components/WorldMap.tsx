"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { geoGraticule10, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";

const WIDTH = 960;
const HEIGHT = 440;

// [longitude, latitude]
const CAMEROON: [number, number] = [11.52, 3.85]; // Yaoundé

const ORIGINS: [number, number][] = [
  [-74.0, 40.7], // New York
  [-122.4, 37.8], // San Francisco
  [-99.1, 19.4], // Mexico City
  [-46.6, -23.5], // São Paulo
  [-0.1, 51.5], // London
  [2.35, 48.85], // Paris
  [37.6, 55.8], // Moscow
  [55.3, 25.2], // Dubai
  [72.9, 19.1], // Mumbai
  [116.4, 39.9], // Beijing
  [139.7, 35.7], // Tokyo
  [151.2, -33.9], // Sydney
];

// Crop to the inhabited latitudes (about 56°S to 80°N). Without this, the
// polar regions waste a third of the frame and the land looks small.
const projection = geoNaturalEarth1().fitExtent(
  [
    [4, 4],
    [WIDTH - 4, HEIGHT - 4],
  ],
  {
    type: "Polygon",
    coordinates: [
      [
        [-170, -56],
        [180, -56],
        [180, 80],
        [-170, 80],
        [-170, -56],
      ],
    ],
  },
);
const path = geoPath(projection);

// The world-atlas JSON is a TopoJSON topology; topojson-client converts it to GeoJSON.
const land = feature(
  worldData as any,
  (worldData as any).objects.countries,
) as any;

const landPaths: string[] = land.features.map((f: any) => path(f) ?? "");
const graticulePath = path(geoGraticule10()) ?? "";
const spherePath = path({ type: "Sphere" }) ?? "";

// Each arc is a great-circle line from an origin to Cameroon, projected onto the map.
const arcs: string[] = ORIGINS.map(
  (origin) =>
    path({ type: "LineString", coordinates: [origin, CAMEROON] }) ?? "",
);

const originPoints = ORIGINS.map((p) => projection(p)).filter(
  (p): p is [number, number] => p !== null,
);
const hub = projection(CAMEROON) as [number, number];

export default function WorldMap() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const lines = Array.from(
        svg.querySelectorAll<SVGPathElement>(".arc-line"),
      );

      // Each line draws itself from its origin toward Cameroon, then retracts,
      // so the map keeps moving without ever looking busy.
      lines.forEach((line, i) => {
        const length = line.getTotalLength();
        gsap.fromTo(
          line,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 2.4,
            ease: "power2.inOut",
            delay: i * 0.35,
            repeat: -1,
            yoyo: true,
            repeatDelay: 0.8,
          },
        );
      });

      gsap.from(".origin-dot", {
        attr: { r: 0 },
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "back.out(2)",
      });

      gsap.fromTo(
        ".hub-ring",
        { attr: { r: 5 }, opacity: 0.9 },
        {
          attr: { r: 30 },
          opacity: 0,
          duration: 2.2,
          ease: "power2.out",
          repeat: -1,
          stagger: 1.1,
        },
      );
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-label="Map showing visitors from around the world connecting to Cameroon"
    >
      <path d={spherePath} fill="none" stroke="rgba(245,236,215,0.08)" />
      <path d={graticulePath} fill="none" stroke="rgba(245,236,215,0.04)" />

      {landPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="#5a5a54"
          stroke="#6a6a63"
          strokeWidth={0.4}
        />
      ))}

      {arcs.map((d, i) => (
        <path
          key={i}
          className="arc-line"
          d={d}
          fill="none"
          stroke="#e8d7b0"
          strokeWidth={1.3}
          strokeLinecap="round"
          opacity={0.8}
        />
      ))}

      {originPoints.map(([x, y], i) => (
        <circle
          key={i}
          className="origin-dot"
          cx={x}
          cy={y}
          r={2.5}
          fill="#e8d7b0"
        />
      ))}

      <circle
        className="hub-ring"
        cx={hub[0]}
        cy={hub[1]}
        r={5}
        fill="none"
        stroke="#e8d7b0"
        strokeWidth={1.2}
      />
      <circle cx={hub[0]} cy={hub[1]} r={4.5} fill="#f5ecd7" />
      <text
        x={hub[0] + 12}
        y={hub[1] + 4}
        fill="#f5ecd7"
        fontSize={20}
        fontFamily="inherit"
      >
        Cameroon
      </text>
    </svg>
  );
}