'use client';

import React, { useEffect, useRef, useId } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, ''); // remove colons for valid HTML id

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set loading state first
    containerRef.current.innerHTML = '<p style="color:#fbbf24;font-family:VT323,monospace;font-size:18px;">Memanggil gulungan sihir...</p>';
    
    const renderChart = async () => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor: '#684530',
            primaryTextColor: '#fff',
            primaryBorderColor: '#3b261b',
            lineColor: '#fbbf24',
            secondaryColor: '#8c5d41',
            tertiaryColor: '#4a2e1d',
            fontFamily: 'VT323, monospace',
            nodeBorder: '#3b261b',
            clusterBkg: '#4a2e1d',
            clusterBorder: '#5a3a29',
            titleColor: '#fbbf24',
            edgeLabelBackground: '#3b261b',
          },
          fontFamily: 'VT323, monospace',
          fontSize: 14,
        });

        const renderId = `mermaid-chart-${Date.now()}`;
        const { svg } = await mermaid.render(renderId, chart);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector('svg');
          if (svgEl) {
            svgEl.style.width = '100%';
            svgEl.style.height = 'auto';
            svgEl.style.maxWidth = '800px';
            svgEl.style.maxHeight = '600px';
          }
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<p style="color:#ef4444;font-family:VT323,monospace;font-size:18px;">⚠ Diagram gagal dimuat. Cek console.</p>`;
        }
      }
    };
    
    renderChart();
  }, [chart]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        overflowX: 'auto',
        padding: '24px',
        background: '#8c5d41', /* Wooden background */
        borderRadius: '8px',
        border: '6px solid #3b261b',
        boxShadow: 'inset 0 0 0 4px #a37255, 0 16px 32px rgba(0,0,0,0.5)',
        minHeight: '200px',
        display: 'flex',
        justifyContent: 'center'
      }}
    />
  );
}
