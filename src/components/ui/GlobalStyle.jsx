import React from "react";

export const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-body { font-family: 'IBM Plex Sans', sans-serif; }
    @media print {
      body * { visibility: hidden; }
      .receipt-print, .receipt-print * { visibility: visible; }
      .receipt-print { position: fixed; inset: 0; padding: 24px; }
    }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 8px; }
  `}</style>
);
