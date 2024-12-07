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
  // Extract search params instead of using json()
  const { searchParams } = new URL(req.url);
  
  // Parse width and height from search params
  let width = parseInt(searchParams.get('width') || '400');
  let height = parseInt(searchParams.get('height') || '200');

  // Ensure width and height are numbers and have minimum values
  width = isNaN(width) ? 400 : Math.max(width, 100);
  height = isNaN(height) ? 200 : Math.max(height, 100);

  // Generate 200 random stars with more precise randomization
  const stars: StarProps[] = Array.from({ length: 200 }, () => ({
	size: Math.random() * 2,
	left: Math.random() * 100,
	top: Math.random() * 100,
	opacity: Math.random(),
  }));

  // Use try-catch for file reading to handle potential errors
  let asciiText = '';
  try {
	const filePath = path.join(process.cwd(), 'data', 'test.txt');
	asciiText = fs.readFileSync(filePath, 'utf8').trimEnd();
  } catch (error) {
	asciiText = 'ASCII Text Not Found';
	console.error('Error reading ASCII text:', error);
  }

  // Split the ASCII text into lines and create tspan elements
  const asciiTextLines = asciiText.split('\n').map((line, index) => {
	// Escape special XML characters
	const escapedLine = line
	  .replace(/&/g, '&amp;')
	  .replace(/</g, '&lt;')
	  .replace(/>/g, '&gt;')
	  .replace(/"/g, '&quot;')
	  .replace(/'/g, '&apos;');
	
	return `<tspan x="50%" dy="${index === 0 ? 0 : '1.2em'}" text-anchor="middle" font-family="monospace" letter-spacing="0.3em">${escapedLine}</tspan>`;
  }).join('');

  // SVG content
  const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Background Gradient -->
  <defs>
	<linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
	  <stop offset="0%" stop-color="#000033"/>
	  <stop offset="50%" stop-color="#000066"/>
	  <stop offset="100%" stop-color="#000099"/>
	</linearGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bg-gradient)"/>

  <!-- Stars -->
  <g class="stars">
	${stars.map((star, index) => `
	  <circle 
		class="star star-${index}"
		cx="${star.left}%" 
		cy="${star.top}%" 
		r="${star.size}" 
		fill="white" 
		fill-opacity="${star.opacity}"
	  />
	`).join('')}
  </g>

  <!-- ASCII Text -->
  <text 
	x="50%" 
	text-anchor="middle" 
	font-family="monospace" 
	font-size="${(width) / 40}" 
	fill="white" 
	style="text-shadow: 0 0 10px rgba(255,255,255,0.5); white-space: pre; font-weight: bold;"
	letter-spacing="0.3em"
  >
	${asciiTextLines}
  </text>

  <!-- Animations -->
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
