import React from "react";

export const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-body { font-family: 'IBM Plex Sans', sans-serif; }
    @media print {
      @page {
        size: auto;
        margin: 0mm;
      }
      body {
        margin: 0;
        padding: 0;
        background: #fff;
      }
      body * {
        visibility: hidden;
      }
      .receipt-print, .receipt-print * {
        visibility: visible !important;
      }
      .receipt-print {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 12px 16px !important;
        box-shadow: none !important;
        border: none !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }
    }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 8px; }
  `}</style>
);
