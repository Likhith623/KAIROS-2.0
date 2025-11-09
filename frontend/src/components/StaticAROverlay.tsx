'use client';

import { useEffect, useRef } from 'react';

interface StaticAROverlayProps {
  imageUrl: string;
  objectType: string;
  onClose: () => void;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: string;

  constructor(x: number, y: number, color: string, type: string = 'default') {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.life = 1;
    this.maxLife = 60;
    this.size = Math.random() * 3 + 2;
    this.color = color;
    this.type = type;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 1 / this.maxLife;
    this.vy += 0.05;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

/**
 * STATIC AR OVERLAY - Applies AR effects to captured images
 */
export default function StaticAROverlay({ imageUrl, objectType, onClose }: StaticAROverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Wait for image to load
    const handleImageLoad = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      let time = 0;
      const objectClass = objectType.toLowerCase();

      const animate = () => {
        time += 0.016;

        // Draw original image
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Get center and dimensions (assume object is centered)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const width = canvas.width * 0.4; // Assume object takes 40% of width
        const height = canvas.height * 0.6; // Assume object takes 60% of height
        const x = centerX - width / 2;
        const y = centerY - height / 2;

        // Apply appropriate AR overlay
        if (objectClass.includes('bottle')) {
          drawBottleAR(ctx, x, y, width, height, centerX, centerY, time);
        } else if (objectClass.includes('plant') || objectClass.includes('potted')) {
          drawPlantAR(ctx, x, y, width, height, centerX, centerY, time);
        } else if (objectClass.includes('phone') || objectClass.includes('cell')) {
          drawMobilePhoneAR(ctx, x, y, width, height, centerX, centerY, time);
        } else if (objectClass.includes('person') || objectClass.includes('face')) {
          drawHumanFaceAR(ctx, x, y, width, height, centerX, centerY, time);
        }

        // Update and draw particles
        particlesRef.current = particlesRef.current.filter(p => p.life > 0);
        particlesRef.current.forEach(p => {
          p.update();
          p.draw(ctx);
        });

        animationRef.current = requestAnimationFrame(animate);
      };

      animate();
    };

    if (image.complete) {
      handleImageLoad();
    } else {
      image.addEventListener('load', handleImageLoad);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [imageUrl, objectType]);

  // ==================== WATER BOTTLE AR ====================
  const drawBottleAR = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    time: number
  ) => {
    // Create particles
    if (Math.random() > 0.6) {
      particlesRef.current.push(
        new Particle(
          centerX + (Math.random() - 0.5) * width * 0.7,
          centerY + (Math.random() - 0.5) * height * 0.7,
          '#06b6d4',
          'water'
        )
      );
    }

    // 1. Glowing bounding box
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#06b6d4';
    ctx.strokeRect(x, y, width, height);
    ctx.shadowBlur = 0;

    // 2. Label
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#06b6d4';
    ctx.fillText('💧 Water Bottle Analysis', x, y - 20);
    ctx.shadowBlur = 0;

    // 3. Data box
    const volume = ((width * height * 0.5) / 1000).toFixed(0);
    drawInfoBox(ctx, x + width + 30, centerY - 120, [
      { icon: '📏', label: 'Volume', value: `~${volume}ml` },
      { icon: '🌊', label: 'State', value: 'Liquid H₂O' },
      { icon: '🧪', label: 'Material', value: 'Polymer' },
      { icon: '⚖️', label: 'Density', value: '1.0 g/cm³' },
      { icon: '🌡️', label: 'Temp', value: '~20°C' },
    ]);

    // 4. H₂O Molecule
    const molX = x + width - 100;
    const molY = y + 60;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(molX, molY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('O', molX - 5, molY + 5);
    
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.arc(molX - 25, molY + 20, 8, 0, Math.PI * 2);
    ctx.arc(molX + 25, molY + 20, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(molX, molY);
    ctx.lineTo(molX - 25, molY + 20);
    ctx.moveTo(molX, molY);
    ctx.lineTo(molX + 25, molY + 20);
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('H', molX - 30, molY + 25);
    ctx.fillText('H', molX + 20, molY + 25);

    // 5. Pressure gradient
    const gradientSteps = 10;
    for (let i = 0; i < gradientSteps; i++) {
      const ratio = i / gradientSteps;
      const barY = y + height - (ratio * height);
      const alpha = 0.05 + ratio * 0.25;
      
      ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
      ctx.fillRect(x + 8, barY, width - 16, height / gradientSteps);
      
      if (i % 2 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`P${i}`, x - 35, barY + 8);
        drawArrow(ctx, x - 40, barY, 20, 0, '#06b6d4', 2);
        drawArrow(ctx, x + width + 40, barY, -20, 0, '#06b6d4', 2);
      }
    }

    // 6. Flow arrows
    const flowLayers = 6;
    for (let i = 0; i < flowLayers; i++) {
      const flowY = y + (i / (flowLayers - 1)) * height;
      const offset = Math.sin(time * 2 + i) * 20;
      
      drawArrow(ctx, centerX - 40 + offset, flowY, 30, 0, '#22d3ee', 3);
      drawArrow(ctx, centerX + 40 - offset, flowY, -30, 0, '#22d3ee', 3);
    }

    // 7. Surface tension
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    for (let i = 0; i < 5; i++) {
      const waveX = x + (i / 4) * width;
      const waveY = y + 25 + Math.sin(time * 3 + i) * 4;
      ctx.beginPath();
      ctx.moveTo(waveX, waveY);
      ctx.lineTo(waveX + width / 4, waveY);
      ctx.stroke();
    }
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Surface Tension', centerX - 70, y + 20);

    // 8. Volume formula
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(x + 15, y + height - 70, 160, 55);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 15, y + height - 70, 160, 55);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('V = πr²h', x + 30, y + height - 45);
    ctx.font = '14px Arial';
    ctx.fillText(`≈ ${volume}ml`, x + 30, y + height - 25);

    // 9. Gravity arrow
    drawArrow(ctx, centerX, y - 70, 0, 40, '#ef4444', 4);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('g = 9.8 m/s²', centerX - 50, y - 80);
  };

  // ==================== PLANT AR ====================
  const drawPlantAR = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    time: number
  ) => {
    // Create particles
    if (Math.random() > 0.4) {
      const photon = new Particle(
        centerX + (Math.random() - 0.5) * width,
        y - 30,
        '#fbbf24',
        'sunlight'
      );
      photon.vy = 1.5;
      photon.vx = 0;
      particlesRef.current.push(photon);
    }
    
    if (Math.random() > 0.5) {
      const oxygen = new Particle(
        centerX + (Math.random() - 0.5) * width * 0.8,
        y + height * 0.6,
        '#22c55e',
        'oxygen'
      );
      oxygen.vy = -2.5;
      oxygen.vx = (Math.random() - 0.5) * 0.5;
      particlesRef.current.push(oxygen);
    }
    
    if (Math.random() > 0.6) {
      const co2 = new Particle(
        x - 30,
        centerY + (Math.random() - 0.5) * height,
        '#ef4444',
        'co2'
      );
      co2.vx = 2;
      co2.vy = (Math.random() - 0.5) * 0.5;
      particlesRef.current.push(co2);
    }

    // 1. Bounding box
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 5;
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#22c55e';
    ctx.strokeRect(x, y, width, height);
    ctx.shadowBlur = 0;

    // 2. Label
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#22c55e';
    ctx.fillText('🌱 Plant - Photosynthesis Active', x, y - 20);
    ctx.shadowBlur = 0;

    // 3. Equation
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(x + 15, y + 15, 350, 65);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 15, y + 15, 350, 65);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('6CO₂ + 6H₂O + Light', x + 30, y + 40);
    ctx.fillText('→ C₆H₁₂O₆ + 6O₂', x + 30, y + 65);

    // 4. Data box
    drawInfoBox(ctx, x + width + 30, centerY - 140, [
      { icon: '☀️', label: 'Process', value: 'Photosynthesis' },
      { icon: '💧', label: 'H₂O', value: 'Absorbing ↑' },
      { icon: '🌬️', label: 'CO₂', value: 'Intake →' },
      { icon: '🫧', label: 'O₂', value: 'Release ↑' },
      { icon: '🍃', label: 'Stomata', value: 'OPEN' },
      { icon: '🌿', label: 'Chlorophyll', value: 'Active' },
    ]);

    // 5. Sunlight rays
    const rayCount = 12;
    for (let i = 0; i < rayCount; i++) {
      const angle = ((i / rayCount) * Math.PI * 2) + time;
      const rayLength = 70 + Math.sin(time * 3 + i) * 30;
      const startX = centerX;
      const startY = y - 50;
      const endX = startX + Math.cos(angle) * rayLength;
      const endY = startY + Math.sin(angle) * rayLength;

      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
      gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    // Sun
    ctx.fillStyle = '#fbbf24';
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#fbbf24';
    ctx.beginPath();
    ctx.arc(centerX, y - 50, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 6. Chloroplasts
    const chloroplastCount = 9;
    for (let i = 0; i < chloroplastCount; i++) {
      const chloroX = x + (i % 3) * (width / 3) + width / 6;
      const chloroY = y + Math.floor(i / 3) * (height / 3) + height / 6;
      const chloroSize = 22 + Math.sin(time * 3 + i) * 5;

      ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.beginPath();
      ctx.arc(chloroX, chloroY, chloroSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
      for (let j = 0; j < 3; j++) {
        ctx.fillRect(chloroX - 10, chloroY - 8 + j * 6, 20, 3);
      }

      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(chloroX, chloroY, chloroSize + 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 7. Stomata with arrows
    const stomataCount = 8;
    for (let i = 0; i < stomataCount; i++) {
      const stomataX = x + width + 20;
      const stomataY = y + (i / (stomataCount - 1)) * height;
      
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(stomataX, stomataY, 10, 5 + Math.sin(time * 2 + i) * 3, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // CO₂ in
      drawArrow(ctx, stomataX - 35, stomataY, 20, 0, '#ef4444', 3);
      // O₂ out
      drawArrow(ctx, stomataX + 10, stomataY, 20, 0, '#22c55e', 3);
      
      if (i % 2 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText('Stomata', stomataX + 35, stomataY + 5);
      }
    }

    // 8. Xylem water transport
    const xylemArrows = 7;
    for (let i = 0; i < xylemArrows; i++) {
      const xylemX = x + (i / (xylemArrows - 1)) * width;
      const arrowLength = 50 + Math.sin(time * 2 + i) * 20;

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(xylemX, y + height + arrowLength);
      ctx.lineTo(xylemX, y);
      ctx.stroke();
      ctx.setLineDash([]);

      drawArrow(ctx, xylemX, y + height + arrowLength, 0, -arrowLength * 0.8, '#06b6d4', 3);
      
      if (i === 3) {
        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('H₂O ↑ Xylem', xylemX - 50, y + height + arrowLength + 25);
      }
    }

    // 9. Phloem
    const phloemY = centerY;
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.8)';
    ctx.lineWidth = 5;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(x, phloemY);
    ctx.lineTo(x + width, phloemY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    drawArrow(ctx, x + width * 0.3, phloemY, 35, 0, '#fb923c', 3);
    drawArrow(ctx, x + width * 0.7, phloemY, -35, 0, '#fb923c', 3);
    
    ctx.fillStyle = '#fb923c';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('C₆H₁₂O₆ Phloem', x + width * 0.35, phloemY - 12);

    // 10. Growth arrow
    drawArrow(ctx, centerX, y + height + 70, 0, -50, '#22c55e', 5);
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#22c55e';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#22c55e';
    ctx.fillText('↑ Growth (Auxin)', centerX - 70, y + height + 95);
    ctx.shadowBlur = 0;
  };

  // ==================== MOBILE PHONE AR ====================
  const drawMobilePhoneAR = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    time: number
  ) => {
    // Particles
    if (Math.random() > 0.5) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.max(width, height) / 2;
      particlesRef.current.push(
        new Particle(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius,
          '#a78bfa',
          'em'
        )
      );
    }

    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#8b5cf6';
    drawAnimatedCorners(ctx, x, y, width, height, 40, time, '#8b5cf6');
    ctx.shadowBlur = 0;

    ctx.font = 'bold 26px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('📱 Mobile Device', x, y - 15);

    const diagonal = Math.sqrt(width * width + height * height) / 60;
    drawInfoBox(ctx, x + width + 30, centerY - 80, [
      { icon: '📐', label: 'Display', value: `${diagonal.toFixed(1)}"` },
      { icon: '⚡', label: 'Type', value: 'OLED/LCD' },
      { icon: '🔋', label: 'Power', value: 'Battery' },
      { icon: '📡', label: 'Signal', value: 'Active' },
    ]);

    // EM waves
    for (let i = 0; i < 3; i++) {
      const radius = (Math.max(width, height) / 2) + (i * 40) + Math.sin(time * 3 + i) * 15;
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.4 - i * 0.1})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 6]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  // ==================== HUMAN FACE AR ====================
  const drawHumanFaceAR = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    time: number
  ) => {
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#10b981';
    
    const scanY = y + ((time * 120) % height);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.fillRect(x, scanY, width, 6);
    
    drawAnimatedCorners(ctx, x, y, width, height, 50, time, '#10b981');
    ctx.shadowBlur = 0;

    ctx.font = 'bold 26px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('👤 Human Detected', x, y - 15);

    drawInfoBox(ctx, x + width + 30, centerY - 100, [
      { icon: '🧠', label: 'Brain', value: 'Active' },
      { icon: '💓', label: 'Heart', value: '~70 BPM' },
      { icon: '🫁', label: 'Lungs', value: 'O₂ Exchange' },
      { icon: '👁️', label: 'Vision', value: 'Optical' },
    ]);

    // Landmarks
    const landmarks = [
      { x: centerX - width * 0.2, y: centerY - height * 0.2, label: 'Eye' },
      { x: centerX + width * 0.2, y: centerY - height * 0.2, label: 'Eye' },
      { x: centerX, y: centerY, label: 'Nose' },
      { x: centerX, y: centerY + height * 0.2, label: 'Mouth' },
    ];

    landmarks.forEach((point, i) => {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      const pulse = 1 + Math.sin(time * 3 + i) * 0.3;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 15 * pulse, 0, Math.PI * 2);
      ctx.stroke();
    });
  };

  // ==================== HELPER FUNCTIONS ====================
  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dx: number,
    dy: number,
    color: string,
    width: number
  ) => {
    const headLength = 15;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(
      x + dx - headLength * Math.cos(angle - Math.PI / 6),
      y + dy - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      x + dx - headLength * Math.cos(angle + Math.PI / 6),
      y + dy - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  const drawInfoBox = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    info: Array<{ icon: string; label: string; value: string }>
  ) => {
    const boxWidth = 240;
    const lineHeight = 38;
    const boxHeight = info.length * lineHeight + 25;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(x, y, boxWidth, boxHeight);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    ctx.font = 'bold 18px Arial';
    info.forEach((item, i) => {
      const lineY = y + 32 + i * lineHeight;
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(item.icon, x + 15, lineY);
      
      ctx.fillStyle = '#a0a0a0';
      ctx.fillText(item.label + ':', x + 50, lineY);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(item.value, x + 145, lineY);
    });
  };

  const drawAnimatedCorners = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    size: number,
    time: number,
    color: string
  ) => {
    const pulse = 1 + Math.sin(time * 3) * 0.2;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(x, y + size * pulse);
    ctx.lineTo(x, y);
    ctx.lineTo(x + size * pulse, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + width - size * pulse, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + size * pulse);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y + height - size * pulse);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + size * pulse, y + height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + width - size * pulse, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y + height - size * pulse);
    ctx.stroke();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      {/* Hidden image for loading */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Original"
        className="hidden"
        crossOrigin="anonymous"
      />

      {/* Canvas with AR overlay */}
      <div className="relative max-w-full max-h-full">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full rounded-2xl shadow-2xl border-4 border-purple-500/30"
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center font-bold text-2xl border-4 border-white/20 hover:scale-110 transition-transform"
        >
          ✕
        </button>

        {/* Info overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20">
          <p className="text-white font-bold">
            🎨 AR Analysis: {objectType}
          </p>
        </div>
      </div>
    </div>
  );
}
