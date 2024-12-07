import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

interface StarProps {
  size: number;
  left: number;
  top: number;
  opacity: number;
}

// Named export for the GET method
export async function GET(req: NextRequest) {
  // Extract User-Agent to detect Edge
  const userAgent = req.headers.get('user-agent') || '';
  const isEdge = userAgent.includes('Edg/');

  // Extract search params instead of using json()
  const { searchParams } = new URL(req.url);

  // Parse width and height from search params
  const width = parseInt(searchParams.get('width') || '400');
  const height = parseInt(searchParams.get('height') || '200');

  // Generate stars
  const stars: StarProps[] = Array.from({ length: 200 }, (_, index) => ({
    size: 1 + Math.sin(index * 0.1) * 1,
    left: (index * 7) % 100,
    top: (index * 13) % 100,
    opacity: 0.5 + Math.sin(index * 0.2) * 0.5,
  }));

  // Read ASCII text
  let asciiText = '';
  try {
    const filePath = path.join(process.cwd(), 'data', 'test.txt');
    asciiText = fs.readFileSync(filePath, 'utf8').trimEnd();
  } catch (error) {
    asciiText = 'ASCII Text Not Found';
    console.error('Error reading ASCII text:', error);
  }

  // Split ASCII text into lines
  const asciiTextLines = asciiText.split('\n').map((line, index) => {
    const escapedLine = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    // Apply shift for Edge on the last line
    const dx = isEdge && index === asciiText.split('\n').length - 1 ? '1em' : '0';
    return `<tspan x="50%" dx="${dx}" dy="${index === 0 ? 0 : '1.2em'}" text-anchor="middle" font-family="monospace" letter-spacing="0.3em">${escapedLine}</tspan>`;
  }).join('');

  // SVG content
  const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#000033"/>
      <stop offset="50%" stop-color="#000066"/>
      <stop offset="100%" stop-color="#000099"/>
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg-gradient)"/>

  <g class="stars">
    ${stars.map((star) => `
      <circle 
        cx="${star.left}%"
        cy="${star.top}%"
        r="${star.size}"
        fill="white"
        fill-opacity="${star.opacity}"
      />
    `).join('')}
  </g>

  <text
    x="50%"
    y="${isEdge? "10%": "0%"}"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="Courier, monospace"
    font-size="${width / 40}"
    fill="white"
    letter-spacing="0.2em"
    style="text-shadow: 0 0 10px rgba(255,255,255,0.5); white-space: pre; font-weight: bold;"
  >
    ${asciiTextLines}
  </text>

  <style type="text/css">
    <![CDATA[
    @keyframes float {
      0% { transform: translateY(0); }
      100% { transform: translateY(-10px); }
    }
    @keyframes starMove {
      0% { transform: translate(0, 0); }
      50% { transform: translate(5px, 5px); }
      100% { transform: translate(-5px, -5px); }
    }
    text {
      animation: float 2s ease-in-out infinite alternate;
    }
    .stars circle {
      animation: starMove 5s ease-in-out infinite alternate;
    }
    ]]>
  </style>
</svg>`;

  // Return the SVG as a response
  return new NextResponse(svgContent, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Content-Disposition': 'inline; filename=tech-star-background.svg',
    },
  });
}
