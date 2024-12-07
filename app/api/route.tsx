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
    const { username, theme = 'light' } = req.query;// Generate stars

  // Combine all parts to form the full SVG content
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="150">
      <rect width="100%" height="100%" fill="${theme === 'dark' ? '#333' : '#fff'}"/>
      <text x="50%" y="50%" font-size="30" fill="${theme === 'dark' ? '#fff' : '#000'}" text-anchor="middle">
        Hello, ${username}
      </text>
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
