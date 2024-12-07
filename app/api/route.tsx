import { NextResponse } from 'next/server';

interface StarProps {
  size: number;
  left: number;
  top: number;
  opacity: number;
}

// Named export for the GET method
export function GET() {
  // Generate 200 random stars
  const stars: StarProps[] = Array.from({ length: 200 }, () => ({
    size: Math.random() * 2,  // Random size between 0 and 2
    left: Math.random() * 100,  // Random position between 0% and 100%
    top: Math.random() * 100,  // Random position between 0% and 100%
    opacity: Math.random(),  // Random opacity between 0 and 1
  }));

  // Escape the ASCII text properly for SVG compatibility
  const asciiText = `hello`.trim().split('\n').map(line => `${line}`).join('');

  // SVG content with a gradient background and stars
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
      <!-- Background Gradient -->
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(0, 0, 0, 0.8);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(0, 0, 0, 0.2);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg-gradient)" />
      
      <!-- Stars -->
      ${stars
        .map(
          (star) => `
            <circle cx="${star.left}%" cy="${star.top}%" r="${star.size}" fill="white" fill-opacity="${star.opacity}" />
          `
        )
        .join('')}
      
      <!-- ASCII Text -->
      <text x="50%" y="50%" text-anchor="middle" font-size="5" fill="white">${asciiText}</text>
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
