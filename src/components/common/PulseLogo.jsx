import React from "react";

export default function PulseLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" className="fill-teal-600" />
      <path
        d="M6 24H15L19 14L26 34L30 20L33 24H42"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="pulse-path"
      />
    </svg>
  );
}
