import { NextResponse, NextRequest } from 'next/server';
import figlet from 'figlet';
import fs from 'fs';
import path from 'path';
import background from './background';

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

	// Parse width, height, text, font, and fontSize from search params
	const width = parseInt(searchParams.get('width') || '800');
	const height = parseInt(searchParams.get('height') || '200');
	const text = searchParams.get('text') || '';
	const font = searchParams.get('font') || 'Standard';
	const fontSize = parseInt(searchParams.get('fontSize') || '20');
	const textColor = searchParams.get('textColor') || 'ffffff';
	const x1 = parseInt(searchParams.get('x1') || '0');
	const x2 = parseInt(searchParams.get('x2') || '100');
	const y1 = parseInt(searchParams.get('y1') || '50');
	const y2 = parseInt(searchParams.get('y2') || '50');
	const c1 = searchParams.get('c1') || '000033';
	const c2 = searchParams.get('c2') || '000066';
	const c3 = searchParams.get('c3') || '000099';
	const configs = [
		{ offset: '0%', color: `#${c1}` },
		{ offset: '50%', color: `#${c2}` },
		{ offset: '100%', color: `#${c3}` },
	];
	console.log(configs);
	const backgroundTest = background(x1, y1, x2, y2, configs);

	try {
		const fontPath = path.resolve(process.cwd(), `public/fonts/${font}.flf`);

		// Check if the font file exists
		if (!fs.existsSync(fontPath)) {
			return NextResponse.json({
				message: `Font file not found at ${fontPath}`,
				status: 404,
			});
		}

		// Read font file contents
		const fontContents = fs.readFileSync(fontPath, 'utf8');

		// Register the font manually
		figlet.parseFont(font, fontContents);

		// Generate ASCII text
		const asciiText = figlet
			.textSync(text)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');

		// Generate stars
		const stars: StarProps[] = Array.from({ length: 200 }, (_, index) => ({
			size: 1 + Math.sin(index * 0.1) * 1,
			left: (index * 7) % 100,
			top: (index * 13) % 100,
			opacity: 0.5 + Math.sin(index * 0.2) * 0.5,
		}));

		// Create SVG content
		const svgContent = `
	  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">

		${backgroundTest}

		<foreignObject width="100%" height="100%">
		  <div 
			xmlns="http://www.w3.org/1999/xhtml"
			style="display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			text-align: center;
			color: #${textColor};
			font-weight: bold;">
			<pre style="font-size: ${fontSize}px; white-space: pre-wrap;">
${asciiText}
			</pre>
		  </div>
		</foreignObject>

		<g class="stars">
		  ${stars
				.map(
					(star) => `
			<circle 
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

		<style type="text/css">
		  <![CDATA[
		  @keyframes float {
			0% { transform: translateY(0); }
			100% { transform: translateY(-10px); }
		  }
		  @keyframes starMove {
			0% { transform: translate(0, 0); }
			50% { transform: translate(10px, 10px); }
			100% { transform: translate(-10px, -10px); }
		  }
		  .stars circle {
			animation: starMove 7s ease-in-out infinite alternate;
		  }
		  ]]>
		</style>
	  </svg>
	`;

		// Return the SVG as a response
		return new NextResponse(svgContent, {
			headers: {
				'Content-Type': 'image/svg+xml',
				'Content-Disposition': 'inline; filename=tech-star-background.svg',
			},
		});
	} catch (error) {
		// Handle any errors gracefully
		return NextResponse.json(
			{
				message: `Error generating ASCII text: ${error instanceof Error ? error.message : 'Unknown error'}`,
			},
			{
				status: 500,
			}
		);
	}
}
