import React from "react";

export const GraphIcon = ({
  fill = 'currentColor',
  filled,
  size,
  height,
  width,
  label,
  ...props
}) => {
  return (

    <svg
        width={size || width || 24}
        height={size || height || 24}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
      <path
        d="M20 20H4V4 M4 16.5L12 9l3 3l4.5-4.5"
        stroke={fill}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};