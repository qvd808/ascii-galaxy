// app/api/starry-background/route.ts

import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

interface StarProps {
  size: number;
  left: number;
  top: number;
  opacity: number;
}

// Named export for the GET method
export function GET(req: NextApiRequest, res: NextResponse) {
  // Generate 200 random stars
  const stars: StarProps[] = Array.from({ length: 200 }, () => ({
    size: Math.random() * 2,  // Random size between 0 and 2
    left: Math.random() * 100,  // Random position between 0% and 100%
    top: Math.random() * 100,   // Random position between 0% and 100%
    opacity: Math.random()  // Random opacity between 0 and 1
  }));

  // Escape the ASCII text properly for SVG compatibility
  const asciiText = `hello`.trim().split('\n').map(line => `<tspan x="50%" dy="1.2em">${line}</tspan>`).join('');

  // SVG content with a gradient background and stars
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100vh" viewBox="0 0 100 100">
      <!-- Gradient Background -->
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#000033" />
          <stop offset="50%" stop-color="#000066" />
          <stop offset="100%" stop-color="#000099" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#gradient)" />
      
      <!-- Stars (represented by circles) -->
      <g>
        ${stars
          .map(
            (star) => `
            <circle
              cx="${star.left}%"
              cy="${star.top}%"
              r="${star.size / 2}" 
              fill="white"
              opacity="${star.opacity}"
            />
          `
          )
          .join('')}
      </g>

      <!-- ASCII Text -->
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        alignment-baseline="middle"
        font-size="5"
        style="animation: float 2s ease-in-out infinite alternate; text-shadow: 0 0 10px rgba(255,255,255,0.5); font-family: monospace;"
      >
        ${asciiText}
      </text>

      <!-- Global styles for float animation -->
      <style>
        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
      </style>
    </svg>
  `;

  // Return the SVG as a response
  return new NextResponse(svgContent, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Content-Disposition': 'inline; filename=starry-background.svg',
    },
  });
}
