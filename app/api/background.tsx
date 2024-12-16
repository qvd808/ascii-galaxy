type Stop = {
  offset: string;
  color: string;
};

function background(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stop_offset: Stop[]
) {
  const stops = stop_offset
    .map(
      (stop) => `
    <stop offset="${stop.offset}" stop-color="${stop.color}"/>
  `
    )
    .join('');

  return `
<defs>
  <linearGradient id="bg-gradient" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
    ${stops}
  </linearGradient>
</defs>
<rect width="100%" height="100%" fill="url(#bg-gradient)"/>
`;
}

export default background;
