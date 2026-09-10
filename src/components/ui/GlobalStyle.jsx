import React from "react";

export const GlobalStyle = ({ receiptPaperWidth = "80mm" }) => {
  const width = receiptPaperWidth === "58mm" ? "58mm" : "80mm";
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
      .font-display { font-family: 'Space Grotesk', sans-serif; }
      .font-body { font-family: 'IBM Plex Sans', sans-serif; }
      
      @media print {
        @page {
          size: ${width} auto;
          margin: 0;
        }
        html, body {
          width: ${width};
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
        }
        body * {
          visibility: hidden;
        }
        .receipt-print, .receipt-print * {
          visibility: visible;
        }
        .receipt-print {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: ${width} !important;
          margin: 0 !important;
          padding: 4mm 3mm !important;
          box-shadow: none !important;
          border: none !important;
          background: #ffffff !important;
          color: #000000 !important;
          font-size: 12px !important;
          line-height: 1.3 !important;
        }
        .no-print {
          display: none !important;
        }
      }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 8px; }
    `}</style>
  );
};
