// app/api/starry-background/route.ts

import { NextResponse } from 'next/server';

interface StarProps {
  size: number;
  left: number;
  top: number;
  opacity: number;
}

// Function to generate random stars
const generateStars = (): StarProps[] => {
  const stars: StarProps[] = [];
  for (let i = 0; i < 200; i++) {
    const size = Math.random() * 2;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const opacity = Math.random();
    stars.push({ size, left, top, opacity });
  }
  return stars;
};

// Named export for the GET method
export function GET() {
  // Generate stars
  const stars = generateStars();

  // Define SVG structure
  const svgHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100vh">`;

  // Create star circle elements
  const starElements = stars
    .map(
      (star) =>
        `<circle cx="${star.left}%" cy="${star.top}%" r="${star.size / 2}" fill="white" opacity="${star.opacity}" />`
    )
    .join('\n');

  const svgFooter = `</svg>`;

  // Combine all parts to form the full SVG content
  const svgContent = svgHeader + starElements + svgFooter;

  // Return the SVG as a response
  return new NextResponse(svgContent, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Content-Disposition': 'inline; filename=starry-background.svg',
    },
  });
}
