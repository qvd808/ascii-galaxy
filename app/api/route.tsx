import { NextResponse } from 'next/server';

interface StarProps {
  size: number;
  left: number;
  top: number;
  opacity: number;
}

// Named export for the GET method
export function GET() {
  // Extract width and height from query parameters (with defaults)

	const width = 800;
	const height = 400;

  // Ensure width and height are numbers
  const parsedWidth = Number(width);
  const parsedHeight = Number(height);

  // Generate 200 random stars
  const stars: StarProps[] = Array.from({ length: 200 }, () => ({
	size: Math.random() * 2,  // Random size between 0 and 2
	left: Math.random() * 100,	// Random position between 0% and 100%
	top: Math.random() * 100,  // Random position between 0% and 100%
	opacity: Math.random(),  // Random opacity between 0 and 1
  }));

  // ASCII text
  const asciiText = `
_			 _ _	   
| |__	___| | | ___  
| '_ \ / _ \ | |/ _ \ 
| | | |  __/ | | (_) |
|_| |_|\___|_|_|\___/ 
					  `.trim();

  // Split the ASCII text into lines and wrap each line in a <tspan>
  const asciiTextLines = asciiText.split('\n').map((line, index) => {
	return `<tspan x="50%" dy="${index === 0 ? 0 : '1.2em'}">${line}</tspan>`;
  }).join('');

  // Font size calculation (responsive based on SVG width and number of lines)
  const fontSize = 50; // Adjusting the font size to fit within width
  // const fontSize = parsedWidth / (asciiText.split('\n').length + 1); // Adjusting the font size to fit within width
  const verticalCenter = 50; // Vertical center for the text

  // SVG content with a gradient background and stars
  const svgContent = `
	<svg xmlns="http://www.w3.org/2000/svg" width="${parsedWidth}" height="${parsedHeight}" viewBox="0 0 ${parsedWidth} ${parsedHeight}">
	  <!-- Background Gradient -->
	  <defs>
		<linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
		  <stop offset="0%" style="stop-color:rgba(0, 0, 0, 0.8);stop-opacity:1" />
		  <stop offset="100%" style="stop-color:rgba(0, 0, 0, 0.2);stop-opacity:1" />
		</linearGradient>
	  </defs>
	  <rect width="100%" height="100%" fill="url(#bg-gradient)" />
	  
	  <!-- Stars -->
	  <g>
		${stars
		  .map(
			(star, index) => `
			  <circle 
				class="star-${index}"
				cx="${star.left}%" 
				cy="${star.top}%" 
				r="${star.size}" 
				fill="white" 
				fill-opacity="${star.opacity}" 
			  />
			`
		  )
		  .join('')}
	  </g>

	  <!-- ASCII Text -->
	  <text x="50%" y="${verticalCenter}%" text-anchor="middle" font-size="${fontSize}" fill="white" style="font-size: ${fontSize}px; transform: translateY(-20%);">
		${asciiTextLines}
	  </text>

	  <!-- Global styles for float animation -->
	  <style>
		@keyframes move {
		  0% {
			transform: translate(${Math.random() * 10}px, ${Math.random() * 10}px);
		  }
		  100% {
			transform: translate(${Math.random() * 10}px, ${Math.random() * 10}px);
		  }
		}
		g circle {
		  animation: move 5s linear infinite;
		}
	  </style>
	</svg>
  `;

  // Return the SVG as a response
  return new NextResponse(svgContent, {
	headers: {
	  'Content-Type': 'image/svg+xml',
	  'Content-Disposition': `inline; filename=starry-background-${parsedWidth}x${parsedHeight}.svg`,
	},
  });
}
