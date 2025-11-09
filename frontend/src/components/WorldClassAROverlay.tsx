'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

interface WorldClassAROverlayProps {
  detections: Detection[];
  videoRef: React.RefObject<HTMLVideoElement>;
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
    this.vy += 0.05; // Gravity for some particles
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
 * WORLD-CLASS AR OVERLAY SYSTEM
 * Premium AR visualization for Water Bottle, Mobile Phone, Human Face, and Plants
 * Features: Particle systems, vector fields, animated overlays, concept visualization
 */
export default function WorldClassAROverlay({ detections, videoRef }: WorldClassAROverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<any[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Match canvas to video size
    const resizeCanvas = () => {
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    let localParticles: Particle[] = [];

    const animate = () => {
      time += 0.016; // ~60fps

      // Clear canvas with subtle fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (detections.length > 0) {
        const detection = detections[0];
        const objectClass = detection.class.toLowerCase();

        // Scale bbox to canvas
        const videoWidth = video.videoWidth || 640;
        const videoHeight = video.videoHeight || 480;
        const scaleX = canvas.width / videoWidth;
        const scaleY = canvas.height / videoHeight;

        const [x, y, width, height] = detection.bbox;
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;

        const centerX = scaledX + scaledWidth / 2;
        const centerY = scaledY + scaledHeight / 2;

        // Route to specific AR overlay based on object
        if (objectClass.includes('bottle')) {
          drawBottleAR(ctx, scaledX, scaledY, scaledWidth, scaledHeight, centerX, centerY, time, localParticles);
        } else if (objectClass.includes('phone') || objectClass.includes('cell')) {
          drawMobilePhoneAR(ctx, scaledX, scaledY, scaledWidth, scaledHeight, centerX, centerY, time, localParticles);
        } else if (objectClass.includes('person') || objectClass.includes('face')) {
          drawHumanFaceAR(ctx, scaledX, scaledY, scaledWidth, scaledHeight, centerX, centerY, time, localParticles);
        } else if (objectClass.includes('plant') || objectClass.includes('potted')) {
          drawPlantAR(ctx, scaledX, scaledY, scaledWidth, scaledHeight, centerX, centerY, time, localParticles);
        } else {
          // Generic overlay
          drawGenericAR(ctx, scaledX, scaledY, scaledWidth, scaledHeight, centerX, centerY, time);
        }
      }

      // Update and draw particles
      localParticles = localParticles.filter(p => p.life > 0);
      localParticles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [detections, videoRef]);

  // ==================== WATER BOTTLE AR ====================
  const drawBottleAR = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    time: number,
    particles: Particle[]
  ) => {
    // 1. Glowing bounding box
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#06b6d4';
    ctx.strokeRect(x, y, width, height);
    ctx.shadowBlur = 0;

    // 2. Label with animation
    ctx.font = 'bold 22px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#06b6d4';
    ctx.fillText('💧 Water Bottle Analysis', x, y - 15);
    ctx.shadowBlur = 0;

    // 3. Comprehensive data overlay
    const volume = ((width * height * 0.5) / 1000).toFixed(0);
    const surfaceArea = (2 * Math.PI * (width/2) * height + 2 * Math.PI * Math.pow(width/2, 2)).toFixed(0);
    drawInfoBox(ctx, x + width + 20, centerY - 120, [
      { icon: '📏', label: 'Volume', value: `~${volume}ml` },
      { icon: '📐', label: 'Surface', value: `${surfaceArea}cm²` },
      { icon: '🌊', label: 'State', value: 'Liquid H₂O' },
      { icon: '🧪', label: 'Material', value: 'Polymer' },
      { icon: '⚖️', label: 'Density', value: '1.0 g/cm³' },
      { icon: '🌡️', label: 'Temp', value: 'Room 20°C' },
      { icon: '💪', label: 'Pressure', value: 'Hydrostatic' },
    ]);

    // 4. H₂O Molecule particles with bonding
    if (Math.random() > 0.6) {
      particles.push(new Particle(centerX + (Math.random() - 0.5) * width * 0.7, centerY + (Math.random() - 0.5) * height * 0.7, '#06b6d4', 'water'));
    }

    // Draw H₂O molecular structure in corner
    const molX = x + width - 80;
    const molY = y + 40;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(molX, molY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('O', molX - 3, molY + 3);
    
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.arc(molX - 20, molY + 15, 6, 0, Math.PI * 2);
    ctx.arc(molX + 20, molY + 15, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(molX, molY);
    ctx.lineTo(molX - 20, molY + 15);
    ctx.moveTo(molX, molY);
    ctx.lineTo(molX + 20, molY + 15);
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Arial';
    ctx.fillText('H', molX - 23, molY + 18);
    ctx.fillText('H', molX + 17, molY + 18);

    // 5. Hydrostatic Pressure gradient with arrows
    const gradientSteps = 10;
    for (let i = 0; i < gradientSteps; i++) {
      const ratio = i / gradientSteps;
      const barY = y + height - (ratio * height);
      const alpha = 0.05 + ratio * 0.25;
      
      ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
      ctx.fillRect(x + 5, barY, width - 10, height / gradientSteps);
      
      // Pressure indicators
      if (i % 2 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(`P${i}`, x - 25, barY + 5);
        
        // Pressure arrows pointing inward
        drawArrow(ctx, x - 30, barY, 15, 0, '#06b6d4', 1.5);
        drawArrow(ctx, x + width + 30, barY, -15, 0, '#06b6d4', 1.5);
      }
    }

    // 6. Fluid dynamics - circular flow patterns
    const flowLayers = 6;
    for (let i = 0; i < flowLayers; i++) {
      const flowY = y + (i / (flowLayers - 1)) * height;
      const flowX = centerX;
      const offset = Math.sin(time * 2 + i) * 15;
      
      // Horizontal flow arrows
      drawArrow(ctx, flowX - 30 + offset, flowY, 25, 0, '#22d3ee', 2);
      drawArrow(ctx, flowX + 30 - offset, flowY, -25, 0, '#22d3ee', 2);
      
      // Add flow labels
      ctx.fillStyle = '#22d3ee';
      ctx.font = '10px Arial';
      ctx.fillText('Flow', flowX - 15, flowY - 10);
    }

    // 7. Convection currents (thermal circulation)
    const convectionX = x + width / 4;
    drawCurvedArrow(ctx, convectionX, y + height - 30, convectionX, y + 30, '#fbbf24', 2, 'Convection');
    drawCurvedArrow(ctx, x + width * 0.75, y + 30, x + width * 0.75, y + height - 30, '#fbbf24', 2, '');

    // 8. Surface tension at top
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const waveX = x + (i / 4) * width;
      const waveY = y + 20 + Math.sin(time * 3 + i) * 3;
      ctx.beginPath();
      ctx.moveTo(waveX, waveY);
      ctx.lineTo(waveX + width / 4, waveY);
      ctx.stroke();
    }
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Surface Tension', centerX - 55, y + 15);

    // 9. Geometry overlay - 3D cylinder representation
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Top ellipse
    ctx.beginPath();
    ctx.ellipse(centerX, y + 10, width / 2.2, 12, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Bottom ellipse
    ctx.beginPath();
    ctx.ellipse(centerX, y + height - 10, width / 2.2, 12, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.setLineDash([]);

    // 10. Volume formula display
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x + 10, y + height - 50, 120, 40);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 10, y + height - 50, 120, 40);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('V = πr²h', x + 20, y + height - 32);
    ctx.font = '10px Arial';
    ctx.fillText(`≈ ${volume}ml`, x + 20, y + height - 18);

    // 11. Measurement lines with detailed annotations
    drawMeasurementLine(ctx, x - 10, y, x - 10, y + height, `H: ${height.toFixed(0)}px`, '#22d3ee');
    drawMeasurementLine(ctx, x, y + height + 15, x + width, y + height + 15, `D: ${width.toFixed(0)}px`, '#22d3ee');
    
    // 12. Gravity arrow
    drawArrow(ctx, centerX, y - 50, 0, 30, '#ef4444', 3);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('g = 9.8 m/s²', centerX - 35, y - 55);
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
    time: number,
    particles: Particle[]
  ) => {
    // 1. High-tech bounding box
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#8b5cf6';
    
    // Animated corners
    const cornerSize = 30;
    drawAnimatedCorners(ctx, x, y, width, height, cornerSize, time, '#8b5cf6');
    ctx.shadowBlur = 0;

    // 2. Label with icon
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('📱 Mobile Device', x, y - 10);

    // 3. Device specs overlay
    const diagonal = Math.sqrt(width * width + height * height) / 50;
    drawInfoBox(ctx, x + width + 20, centerY - 80, [
      { icon: '📐', label: 'Display', value: `${diagonal.toFixed(1)}"` },
      { icon: '⚡', label: 'Type', value: 'OLED/LCD' },
      { icon: '🔋', label: 'Power', value: 'Battery' },
      { icon: '📡', label: 'Signal', value: 'Active' },
    ]);

    // 4. EM wave particles
    if (Math.random() > 0.5) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.max(width, height) / 2;
      particles.push(
        new Particle(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius,
          '#a78bfa',
          'em'
        )
      );
    }

    // 5. Electromagnetic field visualization
    for (let i = 0; i < 3; i++) {
      const radius = (Math.max(width, height) / 2) + (i * 30) + Math.sin(time * 3 + i) * 10;
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 - i * 0.1})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 6. Signal wave propagation
    const waveCount = 6;
    for (let i = 0; i < waveCount; i++) {
      const angle = (i / waveCount) * Math.PI * 2 + time * 2;
      const waveX = centerX + Math.cos(angle) * (width / 2 + 40);
      const waveY = centerY + Math.sin(angle) * (height / 2 + 40);
      
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(waveX, waveY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Circuit board pattern
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let gx = 0; gx < width; gx += gridSize) {
      for (let gy = 0; gy < height; gy += gridSize) {
        if (Math.random() > 0.7) {
          ctx.strokeRect(x + gx, y + gy, gridSize, gridSize);
        }
      }
    }

    // 8. Screen glow effect
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 2);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
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
    time: number,
    particles: Particle[]
  ) => {
    // 1. Biometric scanning box
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#10b981';
    
    // Scanning line effect
    const scanY = y + ((time * 100) % height);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.fillRect(x, scanY, width, 5);
    
    drawAnimatedCorners(ctx, x, y, width, height, 40, time, '#10b981');
    ctx.shadowBlur = 0;

    // 2. Label
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('👤 Human Detected', x, y - 10);

    // 3. Biometric data
    const headCircumference = ((width + height) / 2).toFixed(0);
    drawInfoBox(ctx, x + width + 20, centerY - 100, [
      { icon: '🧠', label: 'Brain', value: 'Active' },
      { icon: '💓', label: 'Heart', value: '~70 BPM' },
      { icon: '🫁', label: 'Lungs', value: 'O₂ Exchange' },
      { icon: '👁️', label: 'Vision', value: 'Optical' },
      { icon: '📏', label: 'Size', value: `${headCircumference}px` },
    ]);

    // 4. Oxygen particles around head
    if (Math.random() > 0.6) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.max(width, height) / 2;
      particles.push(
        new Particle(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius,
          '#34d399',
          'oxygen'
        )
      );
    }

    // 5. Neural network visualization
    const landmarks = [
      { x: centerX - width * 0.2, y: centerY - height * 0.2, label: 'Eye' },
      { x: centerX + width * 0.2, y: centerY - height * 0.2, label: 'Eye' },
      { x: centerX, y: centerY, label: 'Nose' },
      { x: centerX, y: centerY + height * 0.2, label: 'Mouth' },
    ];

    landmarks.forEach((point, i) => {
      // Draw landmark point
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Connect to center
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      // Pulsing effect
      const pulse = 1 + Math.sin(time * 3 + i) * 0.2;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 10 * pulse, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 6. Respiratory system visualization
    const breathPhase = Math.sin(time);
    const breathRadius = 30 + breathPhase * 10;
    
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY + height * 0.4, breathRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 7. Thermal gradient (body heat)
    const thermalGradient = ctx.createLinearGradient(centerX, y, centerX, y + height);
    thermalGradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
    thermalGradient.addColorStop(0.5, 'rgba(251, 191, 36, 0.2)');
    thermalGradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
    ctx.fillStyle = thermalGradient;
    ctx.fillRect(x, y, width, height);

    // 8. Nervous system pulses
    for (let i = 0; i < 4; i++) {
      const pulseY = centerY + (i - 2) * (height / 8);
      const pulseOffset = Math.sin(time * 4 + i) * 15;
      
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - width / 4 + pulseOffset, pulseY);
      ctx.lineTo(centerX + width / 4 + pulseOffset, pulseY);
      ctx.stroke();
    }
  };

  // ==================== PLANT AR (UNIVERSAL FOR ALL PLANTS) ====================
  const drawPlantAR = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    time: number,
    particles: Particle[]
  ) => {
    // 1. Organic bounding box with glow
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#22c55e';
    ctx.strokeRect(x, y, width, height);
    ctx.shadowBlur = 0;

    // 2. Enhanced Label
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#22c55e';
    ctx.fillText('🌱 Plant Life - Photosynthesis Active', x, y - 15);
    ctx.shadowBlur = 0;

    // 3. Comprehensive Plant Biology Data
    const leafArea = (width * height * 0.6 / 1000).toFixed(1);
    drawInfoBox(ctx, x + width + 20, centerY - 140, [
      { icon: '☀️', label: 'Process', value: 'Photosynthesis' },
      { icon: '💧', label: 'H₂O', value: 'Absorbing ↑' },
      { icon: '🌬️', label: 'CO₂', value: 'Intake →' },
      { icon: '🫧', label: 'O₂', value: 'Release ↑' },
      { icon: '🍃', label: 'Stomata', value: 'OPEN' },
      { icon: '🌿', label: 'Chlorophyll', value: 'Active' },
      { icon: '📏', label: 'Leaf Area', value: `~${leafArea}cm²` },
      { icon: '🌡️', label: 'Temp', value: '20-25°C' },
    ]);

    // 4. PHOTOSYNTHESIS EQUATION DISPLAY
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(x + 10, y + 10, 280, 45);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 10, y + 10, 280, 45);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Arial';
    ctx.fillText('6CO₂ + 6H₂O + Light', x + 20, y + 30);
    ctx.fillText('→ C₆H₁₂O₆ + 6O₂', x + 20, y + 48);

    // 5. Enhanced Photosynthesis Particle System
    // SUNLIGHT PHOTONS (yellow) coming down with energy
    if (Math.random() > 0.4) {
      const photonParticle = new Particle(
        centerX + (Math.random() - 0.5) * width,
        y - 30,
        '#fbbf24',
        'sunlight'
      );
      photonParticle.vy = 1.5; // Moving down
      photonParticle.vx = 0;
      particles.push(photonParticle);
    }
    
    // OXYGEN (bright green) going up - abundant release
    if (Math.random() > 0.5) {
      const oxygenParticle = new Particle(
        centerX + (Math.random() - 0.5) * width * 0.8,
        y + height * 0.6,
        '#22c55e',
        'oxygen'
      );
      oxygenParticle.vy = -2.5; // Move upward faster
      oxygenParticle.vx = (Math.random() - 0.5) * 0.5;
      particles.push(oxygenParticle);
    }
    
    // CO₂ (red) coming from sides - intake
    if (Math.random() > 0.6) {
      const co2Particle = new Particle(
        x - 30,
        centerY + (Math.random() - 0.5) * height,
        '#ef4444',
        'co2'
      );
      co2Particle.vx = 2; // Moving right into plant
      co2Particle.vy = (Math.random() - 0.5) * 0.5;
      particles.push(co2Particle);
    }
    
    // WATER (blue) from bottom - absorption
    if (Math.random() > 0.7) {
      const waterParticle = new Particle(
        centerX + (Math.random() - 0.5) * width * 0.8,
        y + height + 20,
        '#06b6d4',
        'water'
      );
      waterParticle.vy = -1.5; // Moving up through xylem
      waterParticle.vx = 0;
      particles.push(waterParticle);
    }

    // 6. SUNLIGHT ENERGY RAYS - Dynamic and abundant
    const rayCount = 12;
    for (let i = 0; i < rayCount; i++) {
      const angle = ((i / rayCount) * Math.PI * 2) + time;
      const rayLength = 60 + Math.sin(time * 3 + i) * 25;
      const startX = centerX;
      const startY = y - 40;
      const endX = startX + Math.cos(angle) * rayLength;
      const endY = startY + Math.sin(angle) * rayLength;

      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
      gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    // Sun symbol
    ctx.fillStyle = '#fbbf24';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#fbbf24';
    ctx.beginPath();
    ctx.arc(centerX, y - 40, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 7. CHLOROPLAST VISUALIZATION - Energy factories
    const chloroplastCount = 9;
    for (let i = 0; i < chloroplastCount; i++) {
      const chloroX = x + (i % 3) * (width / 3) + width / 6;
      const chloroY = y + Math.floor(i / 3) * (height / 3) + height / 6;
      const chloroSize = 18 + Math.sin(time * 3 + i) * 4;

      // Chloroplast body
      ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.beginPath();
      ctx.arc(chloroX, chloroY, chloroSize, 0, Math.PI * 2);
      ctx.fill();

      // Thylakoid stacks inside
      ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
      for (let j = 0; j < 3; j++) {
        ctx.fillRect(chloroX - 8, chloroY - 6 + j * 5, 16, 2);
      }

      // Chlorophyll glow
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(chloroX, chloroY, chloroSize + 6, 0, Math.PI * 2);
      ctx.stroke();
      
      // Energy pulse
      const pulse = 1 + Math.sin(time * 4 + i) * 0.3;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(chloroX, chloroY, chloroSize * pulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 8. STOMATA - Gas exchange pores with labels
    const stomataCount = 8;
    for (let i = 0; i < stomataCount; i++) {
      const stomataX = x + width + 15;
      const stomataY = y + (i / (stomataCount - 1)) * height;
      
      // Stomata opening
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(stomataX, stomataY, 8, 4 + Math.sin(time * 2 + i) * 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // CO₂ arrow going IN
      drawArrow(ctx, stomataX - 25, stomataY, 15, 0, '#ef4444', 2);
      
      // O₂ arrow coming OUT
      drawArrow(ctx, stomataX + 8, stomataY, 15, 0, '#22c55e', 2);
      
      // Labels every other stomata
      if (i % 2 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '9px Arial';
        ctx.fillText('Stomata', stomataX + 25, stomataY + 3);
      }
    }

    // 9. XYLEM - Water transport arrows from roots
    const xylemArrows = 7;
    for (let i = 0; i < xylemArrows; i++) {
      const xylemX = x + (i / (xylemArrows - 1)) * width;
      const xylemY = y + height;
      const arrowLength = 40 + Math.sin(time * 2 + i) * 15;
      const offset = Math.sin(time * 3 + i * 0.5) * 3;

      // Water pathway
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(xylemX, xylemY + arrowLength);
      ctx.lineTo(xylemX + offset, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrows showing upward water flow
      drawArrow(ctx, xylemX, xylemY + arrowLength, offset, -arrowLength * 0.8, '#06b6d4', 2.5);
      
      if (i === 3) {
        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 11px Arial';
        ctx.fillText('H₂O ↑ Xylem', xylemX - 35, xylemY + arrowLength + 15);
      }
    }

    // 10. PHLOEM - Sugar transport (bidirectional)
    const phloemY = centerY;
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.7)';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(x, phloemY);
    ctx.lineTo(x + width, phloemY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Bidirectional arrows for sugar transport
    drawArrow(ctx, x + width * 0.3, phloemY, 30, 0, '#fb923c', 2);
    drawArrow(ctx, x + width * 0.7, phloemY, -30, 0, '#fb923c', 2);
    
    ctx.fillStyle = '#fb923c';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('C₆H₁₂O₆ Phloem', x + width * 0.35, phloemY - 8);

    // 11. CELLULAR RESPIRATION in roots
    ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.fillRect(x, y + height - 30, width, 30);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y + height - 30, width, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('Root Respiration: O₂ consumed', x + 10, y + height - 12);

    // 12. TRANSPIRATION - Water vapor leaving
    for (let i = 0; i < 8; i++) {
      const vaporX = x + (i / 7) * width;
      const vaporY = y - (Math.sin(time * 2 + i) * 15) - 10;
      const vaporSize = 4 + i * 0.5;
      
      ctx.fillStyle = `rgba(6, 182, 212, ${0.4 - i * 0.04})`;
      ctx.beginPath();
      ctx.arc(vaporX, vaporY, vaporSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Upward arrows for water vapor
      if (i % 2 === 0) {
        drawArrow(ctx, vaporX, y + 20, 0, -15, '#06b6d4', 1.5);
      }
    }
    
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('H₂O Vapor (Transpiration)', centerX - 75, y - 25);

    // 13. CELLULAR STRUCTURE GRID with labels
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.lineWidth = 1;
    const cellSize = 18;
    for (let gx = x; gx < x + width; gx += cellSize) {
      for (let gy = y; gy < y + height; gy += cellSize) {
        ctx.strokeRect(gx, gy, cellSize, cellSize);
        
        // Cell nucleus
        if (Math.random() > 0.85) {
          ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
          ctx.beginPath();
          ctx.arc(gx + cellSize / 2, gy + cellSize / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 14. GROWTH DIRECTION with explanation
    drawArrow(ctx, centerX, y + height + 50, 0, -35, '#22c55e', 4);
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#22c55e';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#22c55e';
    ctx.fillText('↑ Growth (Auxin Hormone)', centerX - 85, y + height + 70);
    ctx.shadowBlur = 0;

    // 15. PHOTOTROPISM indicator (bending toward light)
    const bendAngle = Math.sin(time) * 0.1;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX, y + height);
    ctx.quadraticCurveTo(
      centerX + width * 0.2 * bendAngle,
      centerY,
      centerX,
      y
    );
    ctx.stroke();
    ctx.setLineDash([]);

    // 16. CARBON FIXATION annotation
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x + 10, y + height - 80, 150, 40);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 10, y + height - 80, 150, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('Calvin Cycle Active', x + 20, y + height - 62);
    ctx.font = '9px Arial';
    ctx.fillText('CO₂ → Sugar', x + 20, y + height - 48);
  };

  // ==================== GENERIC AR ====================
  const drawGenericAR = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    time: number
  ) => {
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ec4899';
    ctx.strokeRect(x, y, width, height);
    ctx.shadowBlur = 0;

    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🎯 Object Detected', x, y - 10);
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
    const headLength = 10;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;

    // Arrow line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();

    // Arrow head
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
    const boxWidth = 200;
    const lineHeight = 30;
    const boxHeight = info.length * lineHeight + 20;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(x, y, boxWidth, boxHeight);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    // Info lines
    ctx.font = 'bold 14px Arial';
    info.forEach((item, i) => {
      const lineY = y + 25 + i * lineHeight;
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(item.icon, x + 10, lineY);
      
      ctx.fillStyle = '#a0a0a0';
      ctx.fillText(item.label + ':', x + 40, lineY);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(item.value, x + 120, lineY);
    });
  };

  const drawMeasurementLine = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    label: string,
    color: string
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);

    // Line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // End caps
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x1 - 5, y1);
    ctx.lineTo(x1 + 5, y1);
    ctx.moveTo(x2 - 5, y2);
    ctx.lineTo(x2 + 5, y2);
    ctx.stroke();

    // Label
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = color;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    ctx.fillText(label, midX, midY - 5);
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
    ctx.lineWidth = 3;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(x, y + size * pulse);
    ctx.lineTo(x, y);
    ctx.lineTo(x + size * pulse, y);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(x + width - size * pulse, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + size * pulse);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(x, y + height - size * pulse);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + size * pulse, y + height);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(x + width - size * pulse, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y + height - size * pulse);
    ctx.stroke();
  };

  const drawCurvedArrow = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    width: number,
    label: string
  ) => {
    const controlPointOffset = 30;
    const cpX = x1 - controlPointOffset;
    const cpY = (y1 + y2) / 2;

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash([]);

    // Draw curved path
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cpX, cpY, x2, y2);
    ctx.stroke();

    // Arrow head at end
    const headLength = 10;
    const angle = Math.atan2(y2 - cpY, x2 - cpX);
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle - Math.PI / 6),
      y2 - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      x2 - headLength * Math.cos(angle + Math.PI / 6),
      y2 - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    // Label
    if (label) {
      ctx.fillStyle = color;
      ctx.font = 'bold 10px Arial';
      ctx.fillText(label, cpX - 40, cpY);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
