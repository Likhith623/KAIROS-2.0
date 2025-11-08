'use client';

import { useEffect, useRef } from 'react';
import type { AROverlay } from '@/types';

interface AROverlayCanvasProps {
  detections: any[];
  overlays: AROverlay[];
}

export default function AROverlayCanvas({ detections, overlays }: AROverlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const videoElement = document.querySelector('video');
    if (!videoElement) return;

    // Set canvas size to match video display
    const resizeCanvas = () => {
      canvas.width = videoElement.clientWidth;
      canvas.height = videoElement.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw overlays
      overlays.forEach((overlay) => {
        drawOverlay(ctx, overlay, detections, canvas);
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [overlays, detections]);

  const drawOverlay = (
    ctx: CanvasRenderingContext2D,
    overlay: AROverlay,
    detections: any[],
    canvas: HTMLCanvasElement
  ) => {
    if (detections.length === 0) return;

    const detection = detections[0]; // Use first/main detection
    const [x, y, width, height] = detection.bbox;

    const videoElement = document.querySelector('video');
    if (!videoElement) return;

    const scaleX = canvas.width / videoElement.videoWidth;
    const scaleY = canvas.height / videoElement.videoHeight;

    const centerX = (x + width / 2) * scaleX;
    const centerY = (y + height / 2) * scaleY;
    const scaledWidth = width * scaleX;
    const scaledHeight = height * scaleY;

    ctx.save();

    switch (overlay.type) {
      case 'vector':
        drawVector(ctx, centerX, centerY, overlay);
        break;
      case 'flow':
        drawFlow(ctx, centerX, centerY, scaledWidth, overlay);
        break;
      case 'label':
        drawLabel(ctx, centerX, y * scaleY - 20, overlay);
        break;
      case 'arrow':
        drawArrow(ctx, centerX, centerY, overlay);
        break;
      case 'heatmap':
        drawHeatmap(ctx, x * scaleX, y * scaleY, scaledWidth, scaledHeight, overlay);
        break;
      case 'particles':
        drawParticles(ctx, x * scaleX, y * scaleY, scaledWidth, scaledHeight, overlay);
        break;
      case 'trajectory':
        drawTrajectory(ctx, centerX, centerY, overlay);
        break;
      case 'dimension':
        drawDimension(ctx, x * scaleX, y * scaleY, scaledWidth, scaledHeight, overlay);
        break;
    }

    ctx.restore();
  };

  const drawVector = (ctx: CanvasRenderingContext2D, x: number, y: number, overlay: AROverlay) => {
    const color = overlay.color || '#ff0000';
    const length = 80;
    const angle = Date.now() / 1000; // Rotating animation

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;

    // Draw arrow
    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw arrowhead
    const headLength = 15;
    const headAngle = Math.PI / 6;
    
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle - headAngle),
      endY - headLength * Math.sin(angle - headAngle)
    );
    ctx.lineTo(
      endX - headLength * Math.cos(angle + headAngle),
      endY - headLength * Math.sin(angle + headAngle)
    );
    ctx.closePath();
    ctx.fill();
  };

  const drawFlow = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, overlay: AROverlay) => {
    const color = overlay.color || '#00ff00';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    const offset = (Date.now() / 100) % 10;
    ctx.lineDashOffset = -offset;

    ctx.beginPath();
    ctx.arc(x, y, width / 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([]);
  };

  const drawLabel = (ctx: CanvasRenderingContext2D, x: number, y: number, overlay: AROverlay) => {
    const text = overlay.label || overlay.text || '';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x - 50, y - 15, 100, 30);
    
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, overlay: AROverlay) => {
    const color = overlay.color || '#ffff00';
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;

    const direction = overlay.direction || 'up';
    let angle = 0;
    switch (direction) {
      case 'up': angle = -Math.PI / 2; break;
      case 'down': angle = Math.PI / 2; break;
      case 'left': angle = Math.PI; break;
      case 'right': angle = 0; break;
    }

    const length = 60;
    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Arrowhead
    const headLength = 15;
    const headAngle = Math.PI / 6;
    
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle - headAngle),
      endY - headLength * Math.sin(angle - headAngle)
    );
    ctx.lineTo(
      endX - headLength * Math.cos(angle + headAngle),
      endY - headLength * Math.sin(angle + headAngle)
    );
    ctx.closePath();
    ctx.fill();
  };

  const drawHeatmap = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    overlay: AROverlay
  ) => {
    const gradient = ctx.createRadialGradient(
      x + width / 2,
      y + height / 2,
      0,
      x + width / 2,
      y + height / 2,
      Math.max(width, height) / 2
    );

    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
    gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 0, 0.1)');

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
  };

  const drawParticles = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    overlay: AROverlay
  ) => {
    const color = overlay.color || '#00ffff';
    ctx.fillStyle = color;

    // Simple particle animation
    const numParticles = 20;
    const time = Date.now() / 1000;

    for (let i = 0; i < numParticles; i++) {
      const px = x + (Math.sin(time + i) * width) / 2 + width / 2;
      const py = y + (Math.cos(time * 0.8 + i) * height) / 2 + height / 2;
      
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawTrajectory = (ctx: CanvasRenderingContext2D, x: number, y: number, overlay: AROverlay) => {
    const color = overlay.color || '#ffff00';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    // Parabolic trajectory
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const px = x + t * 200;
      const py = y - (4 * t * (1 - t)) * 150;
      ctx.lineTo(px, py);
    }
    
    ctx.stroke();
  };

  const drawDimension = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    overlay: AROverlay
  ) => {
    const color = overlay.color || '#00ffff';
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.font = 'bold 14px sans-serif';

    // Width dimension
    ctx.beginPath();
    ctx.moveTo(x, y + height + 20);
    ctx.lineTo(x + width, y + height + 20);
    ctx.stroke();

    // Height dimension
    ctx.beginPath();
    ctx.moveTo(x + width + 20, y);
    ctx.lineTo(x + width + 20, y + height);
    ctx.stroke();

    // Labels
    ctx.textAlign = 'center';
    ctx.fillText('w', x + width / 2, y + height + 35);
    ctx.fillText('h', x + width + 35, y + height / 2);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
