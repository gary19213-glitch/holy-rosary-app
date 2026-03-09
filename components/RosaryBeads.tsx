import React from 'react';

export default function RosaryBeads({ currentBead }) {
  // We generate 10 beads for a decade
  const beads = Array.from({ length: 10 });
  const radius = 110; 
  const center = 150; 

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
      <svg width="300" height="360" viewBox="0 0 300 360">
        
        {/* The Chain (circle) */}
        <circle cx={center} cy={center} r={radius} stroke="#444" strokeWidth="2" fill="none" />
        {/* The Chain dropping down to the cross */}
        <path d="M 150 260 L 150 320" stroke="#444" strokeWidth="2" />

        {/* The 10 Decade Beads */}
        {beads.map((_, index) => {
          // Math to put them perfectly in a circle
          const angle = (index / 10) * (Math.PI * 2) - (Math.PI / 2);
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          
          const isActive = currentBead === index;

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={isActive ? 14 : 10} /* Active bead gets bigger */
              fill={isActive ? "#d4af37" : "#1a1a2e"} /* Gold if active */
              stroke="#d4af37"
              strokeWidth="2"
              style={{
                filter: isActive ? "drop-shadow(0px 0px 10px #d4af37)" : "none",
                transition: "all 0.4s ease" /* Feature #90: Smooth animation */
              }}
            />
          );
        })}

        {/* The Our Father Bead (Drop down) */}
        <circle 
          cx="150" cy="280" r={currentBead === 10 ? 16 : 12} 
          fill={currentBead === 10 ? "#d4af37" : "#1a1a2e"} 
          stroke="#d4af37" strokeWidth="2" 
          style={{ transition: "all 0.4s ease" }}
        />
        
        {/* The Cross */}
        <text x="150" y="355" fontSize="50" textAnchor="middle" fill="#d4af37">✝</text>
      </svg>
    </div>
  );
              }
