import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract parameters from the URL query string (like username, theme, etc.)
  const { username, theme = 'light' } = req.query;

  // Generate an SVG dynamically based on parameters
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="150">
      <rect width="100%" height="100%" fill="${theme === 'dark' ? '#333' : '#fff'}"/>
      <text x="50%" y="50%" font-size="30" fill="${theme === 'dark' ? '#fff' : '#000'}" text-anchor="middle">
        Hello, ${username}
      </text>
    </svg>
  `;

  // Set headers to serve the response as an SVG file
  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(svgContent);
}
