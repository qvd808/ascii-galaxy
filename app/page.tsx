"use client";
import React, { useEffect, useState } from 'react';

interface StarProps {
  size: number;
  left: number;
  top: number;
  opacity: number;
}

export default function Home() {
  const [stars, setStars] = useState<StarProps[]>([]);

  useEffect(() => {
    const createStars = () => {
      const starsArray: StarProps[] = Array.from({ length: 200 }, () => ({
        size: Math.random() * 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random()
      }));
      setStars(starsArray);
    };

    createStars();
  }, []);

  return (
    <svg 
      width="100%" 
      height="100vh" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{
        background: 'linear-gradient(45deg, #000033, #000066, #000099)', 
        overflow: 'hidden',
        fontFamily: 'monospace',
        color: 'white',
        position: 'relative'
      }}
    >
      {/* Stars (represented by circles) */}
      <g>
        {stars.map((star, index) => (
          <circle
            key={index}
            cx={`${star.left}%`}
            cy={`${star.top}%`}
            r={`${star.size / 2}`}  // Size of the star (circle radius)
            fill="white"
            opacity={star.opacity}
          />
        ))}
      </g>

      {/* ASCII Text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="5"
        style={{
          animation: 'float 2s ease-in-out infinite alternate',
          textShadow: '0 0 10px rgba(255,255,255,0.5)',
          fontFamily: 'monospace'
        }}
      >
        {` _____         _           _             _    
|_   _|__  ___| |__    ___| |_ __ _  ___| | __
  | |/ _ \/ __| '_ \\  / __| __/ _\` |/ __| |/ /
  | |  __/ (__| | | | \\__ \ || (_| | (__|   < 
  |_|\\___|\\___| |_| |_| |___/\\__\\__,_|\\___|_|\\_\\
        `}
      </text>

      {/* Global styles for float animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
      `}</style>
    </svg>
  );
}
