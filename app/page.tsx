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
    <div 
      style={{
        margin: 0,
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #000033, #000066, #000099)',
        overflow: 'hidden',
        fontFamily: 'monospace',
        color: 'white',
        position: 'relative'
      }}
    >
      {/* Stars container */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        {stars.map((star, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              backgroundColor: 'white',
              borderRadius: '50%',
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.opacity
            }}
          />
        ))}
      </div>

      {/* ASCII Text */}
      <pre 
        style={{
          fontSize: '20px',
          textAlign: 'center',
          animation: 'float 2s ease-in-out infinite alternate',
          textShadow: '0 0 10px rgba(255,255,255,0.5)'
        }}
      >
        {` _____         _           _             _    
|_   _|__  ___| |__    ___| |_ __ _  ___| | __
  | |/ _ \/ __| '_ \\  / __| __/ _\` |/ __| |/ /
  | |  __/ (__| | | | \\__ \ || (_| | (__|   < 
  |_|\\___|\\___| |_| |_| |___/\\__\\__,_|\\___|_|\\_\\
        `}
      </pre>

      {/* Global styles for float animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );

}
