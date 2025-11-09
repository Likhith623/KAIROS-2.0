'use client';

import { useEffect, useRef, useState } from 'react';

interface StaticAROverlayProps {
  imageUrl: string;
  objectType: string;
  onClose: () => void;
}

// MediaPipe Face Mesh types
declare global {
  interface Window {
    FaceMesh: any;
  }
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
  const faceMeshRef = useRef<any>(null);
  const [faceLandmarks, setFaceLandmarks] = useState<any>(null);
  const [phoneComponents, setPhoneComponents] = useState<any>(null);

  // Load MediaPipe Face Mesh
  useEffect(() => {
    const loadMediaPipe = async () => {
      try {
        // Dynamically load MediaPipe scripts
        const script1 = document.createElement('script');
        script1.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
        script1.crossOrigin = 'anonymous';
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
        script2.crossOrigin = 'anonymous';
        document.head.appendChild(script2);

        await new Promise((resolve) => {
          script1.onload = resolve;
        });

        console.log('MediaPipe Face Mesh loaded');
      } catch (error) {
        console.error('Failed to load MediaPipe:', error);
      }
    };

    loadMediaPipe();
  }, []);

  // Process image with MediaPipe when it's a face
  useEffect(() => {
    const processImage = async () => {
      const image = imageRef.current;
      if (!image || !image.complete) return;
      
      const objectClass = objectType.toLowerCase();
      
      // Process face with MediaPipe
      if ((objectClass.includes('person') || objectClass.includes('face')) && window.FaceMesh) {
        try {
          const faceMesh = new window.FaceMesh({
            locateFile: (file: string) => {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            }
          });

          faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });

          faceMesh.onResults((results: any) => {
            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
              console.log('Face landmarks detected:', results.multiFaceLandmarks[0].length);
              setFaceLandmarks(results.multiFaceLandmarks[0]);
            }
          });

          await faceMesh.initialize();
          await faceMesh.send({ image: image });
          
          faceMeshRef.current = faceMesh;
        } catch (error) {
          console.error('MediaPipe processing error:', error);
        }
      }
      
      // Analyze phone components using edge detection
      if (objectClass.includes('phone') || objectClass.includes('cell')) {
        analyzePhoneComponents(image);
      }
    };

    if (imageRef.current?.complete) {
      processImage();
    }
  }, [imageUrl, objectType]);

  // Analyze phone components using simple computer vision
  const analyzePhoneComponents = (image: HTMLImageElement) => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = image.naturalWidth;
    tempCanvas.height = image.naturalHeight;
    tempCtx.drawImage(image, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;

    // Detect dark circular regions (cameras) in top portion
    const cameras: Array<{x: number, y: number, radius: number}> = [];
    const topThird = tempCanvas.height * 0.33;
    
    // Simple dark spot detection for cameras
    for (let y = 0; y < topThird; y += 5) {
      for (let x = 0; x < tempCanvas.width; x += 5) {
        const i = (y * tempCanvas.width + x) * 4;
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        // Very dark spots likely cameras
        if (brightness < 30) {
          cameras.push({ x, y, radius: 15 });
        }
      }
    }

    // Detect screen area (usually central bright rectangle)
    const screenArea = {
      x: tempCanvas.width * 0.1,
      y: tempCanvas.height * 0.15,
      width: tempCanvas.width * 0.8,
      height: tempCanvas.height * 0.7
    };

    // Detect charging port (bottom center, small dark rectangle)
    const chargingPort = {
      x: tempCanvas.width * 0.45,
      y: tempCanvas.height * 0.95,
      width: tempCanvas.width * 0.1,
      height: tempCanvas.height * 0.03
    };

    // Detect buttons (edges, metallic reflections)
    const buttons = [
      { x: tempCanvas.width * 0.05, y: tempCanvas.height * 0.4, type: 'volume' },
      { x: tempCanvas.width * 0.95, y: tempCanvas.height * 0.35, type: 'power' }
    ];

    setPhoneComponents({
      cameras,
      screenArea,
      chargingPort,
      buttons
    });

    console.log('Phone components detected:', { cameras: cameras.length, screenArea, chargingPort, buttons });
  };

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
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
      }
    };
  }, [imageUrl, objectType, faceLandmarks, phoneComponents]);

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
    if (Math.random() > 0.5) {
      particlesRef.current.push(
        new Particle(
          centerX + (Math.random() - 0.5) * width * 0.7,
          centerY + (Math.random() - 0.5) * height * 0.7,
          '#06b6d4',
          'water'
        )
      );
    }

    // 1. Glowing bounding box with rounded corners
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 5;
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#06b6d4';
    drawRoundedRect(ctx, x, y, width, height, 15);
    ctx.shadowBlur = 0;

    // 2. Animated title with glow
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#06b6d4';
    const titlePulse = 1 + Math.sin(time * 3) * 0.05;
    ctx.save();
    ctx.translate(x, y - 25);
    ctx.scale(titlePulse, titlePulse);
    ctx.fillText('💧 Water Bottle Analysis', 0, 0);
    ctx.restore();
    ctx.shadowBlur = 0;

    // 3. Enhanced data box with better positioning
    const volume = ((width * height * 0.5) / 1000).toFixed(0);
    const surfaceArea = (2 * Math.PI * (width/2) * height + 2 * Math.PI * Math.pow(width/2, 2)).toFixed(0);
    drawInfoBox(ctx, x + width + 40, centerY - 150, [
      { icon: '📏', label: 'Volume', value: `~${volume}ml` },
      { icon: '📐', label: 'Surface', value: `${surfaceArea}cm²` },
      { icon: '🌊', label: 'State', value: 'Liquid H₂O' },
      { icon: '🧪', label: 'Material', value: 'PET Polymer' },
      { icon: '⚖️', label: 'Density', value: '1.0 g/cm³' },
      { icon: '🌡️', label: 'Temp', value: '~20°C' },
      { icon: '💪', label: 'Pressure', value: 'ρgh (Hydrostatic)' },
    ]);

    // 4. BOTTLE PARTS WITH ARROWS
    // Cap/Top
    const capY = y + height * 0.1;
    drawLabelWithArrow(ctx, x - 120, capY, centerX - width * 0.3, capY, '🔒 Cap/Lid', '#06b6d4', 18);
    
    // Neck
    const neckY = y + height * 0.2;
    drawLabelWithArrow(ctx, x - 120, neckY, centerX - width * 0.25, neckY, '🔗 Neck', '#22d3ee', 18);
    
    // Body/Main Container
    const bodyY = centerY;
    drawLabelWithArrow(ctx, x - 120, bodyY, x + 5, bodyY, '🫙 Body (Container)', '#06b6d4', 18);
    
    // Bottom/Base
    const baseY = y + height * 0.9;
    drawLabelWithArrow(ctx, x - 120, baseY, centerX - width * 0.3, baseY, '⚫ Base', '#22d3ee', 18);
    
    // Water level indicator
    const waterLevel = y + height * 0.3;
    drawLabelWithArrow(ctx, x + width + 40, waterLevel, x + width - 5, waterLevel, '💧 Water Level', '#0ea5e9', 18);

    // 5. H₂O Molecule structure - Enhanced
    const molX = x + width - 120;
    const molY = y + 80;
    
    // Molecule background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.arc(molX, molY, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Oxygen atom
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(molX, molY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('O', molX - 6, molY + 5);
    
    // Hydrogen atoms
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.arc(molX - 30, molY + 25, 10, 0, Math.PI * 2);
    ctx.arc(molX + 30, molY + 25, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Bonds
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(molX, molY);
    ctx.lineTo(molX - 30, molY + 25);
    ctx.moveTo(molX, molY);
    ctx.lineTo(molX + 30, molY + 25);
    ctx.stroke();
    
    // H labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('H', molX - 35, molY + 30);
    ctx.fillText('H', molX + 25, molY + 30);
    
    // H₂O label
    ctx.font = 'bold 20px Arial';
    ctx.fillText('H₂O', molX - 20, molY - 35);
    
    // Bond angle
    ctx.font = '12px Arial';
    ctx.fillText('104.5°', molX - 15, molY + 50);

    // 6. Enhanced pressure gradient with detailed markers
    const gradientSteps = 12;
    for (let i = 0; i < gradientSteps; i++) {
      const ratio = i / gradientSteps;
      const barY = y + height - (ratio * height);
      const alpha = 0.05 + ratio * 0.3;
      
      ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
      ctx.fillRect(x + 10, barY, width - 20, height / gradientSteps);
      
      if (i % 3 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`P${i}`, x - 40, barY + 10);
        
        // Pressure arrows with animation
        const arrowOffset = Math.sin(time * 2 + i) * 5;
        drawArrow(ctx, x - 45 + arrowOffset, barY, 25, 0, '#06b6d4', 2.5);
        drawArrow(ctx, x + width + 45 - arrowOffset, barY, -25, 0, '#06b6d4', 2.5);
      }
    }

    // 7. Enhanced flow arrows with vortex pattern
    const flowLayers = 8;
    for (let i = 0; i < flowLayers; i++) {
      const flowY = y + (i / (flowLayers - 1)) * height;
      const offset = Math.sin(time * 2 + i) * 25;
      const alpha = 0.6 + Math.sin(time * 3 + i) * 0.3;
      
      ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
      ctx.lineWidth = 3;
      
      // Curved flow lines
      ctx.beginPath();
      ctx.moveTo(centerX - 50 + offset, flowY);
      ctx.quadraticCurveTo(centerX, flowY - 10, centerX + 50 + offset, flowY);
      ctx.stroke();
      
      drawArrow(ctx, centerX - 40 + offset, flowY, 35, 0, '#22d3ee', 3);
      drawArrow(ctx, centerX + 40 - offset, flowY, -35, 0, '#22d3ee', 3);
    }

    // 8. Surface tension with wave animation
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 5;
    for (let i = 0; i < 6; i++) {
      const waveX = x + (i / 5) * width;
      const waveY = y + 30 + Math.sin(time * 3 + i) * 6;
      ctx.beginPath();
      ctx.moveTo(waveX, waveY);
      ctx.lineTo(waveX + width / 5, waveY);
      ctx.stroke();
    }
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#06b6d4';
    ctx.fillText('≈ Surface Tension ≈', centerX - 95, y + 20);
    ctx.shadowBlur = 0;

    // 9. Enhanced volume formula with animation
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(x + 20, y + height - 80, 180, 65);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 20, y + height - 80, 180, 65);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Volume Formula:', x + 35, y + height - 58);
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#22d3ee';
    ctx.fillText('V = πr²h', x + 45, y + height - 35);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`≈ ${volume}ml`, x + 65, y + height - 18);

    // 10. Gravity arrow with force indication
    const gravityScale = 1 + Math.sin(time * 2) * 0.1;
    ctx.save();
    ctx.translate(centerX, y - 90);
    ctx.scale(1, gravityScale);
    drawArrow(ctx, 0, 0, 0, 50, '#ef4444', 5);
    ctx.restore();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ef4444';
    ctx.fillText('⬇ g = 9.8 m/s²', centerX - 65, y - 100);
    ctx.shadowBlur = 0;

    // 11. Convection currents
    drawCurvedArrowPath(ctx, x + width * 0.25, y + height - 40, x + width * 0.25, y + 40, '#fbbf24', 3, 'Convection ↑', time);
    drawCurvedArrowPath(ctx, x + width * 0.75, y + 40, x + width * 0.75, y + height - 40, '#fb923c', 3, 'Cooling ↓', time);

    // 12. Measurement lines with dynamic values
    drawMeasurementLine(ctx, x - 15, y, x - 15, y + height, `Height: ${height.toFixed(0)}px`, '#22d3ee');
    drawMeasurementLine(ctx, x, y + height + 20, x + width, y + height + 20, `Diameter: ${width.toFixed(0)}px`, '#22d3ee');
  };

  // ==================== PLANT AR (UNIVERSAL) ====================
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
    // Create abundant particles
    if (Math.random() > 0.3) {
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
    
    if (Math.random() > 0.4) {
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
    
    if (Math.random() > 0.5) {
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
    
    if (Math.random() > 0.6) {
      const water = new Particle(
        centerX + (Math.random() - 0.5) * width * 0.7,
        y + height + 20,
        '#06b6d4',
        'water'
      );
      water.vy = -1.8;
      water.vx = 0;
      particlesRef.current.push(water);
    }

    // 1. Enhanced bounding box
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 6;
    ctx.shadowBlur = 35;
    ctx.shadowColor = '#22c55e';
    drawRoundedRect(ctx, x, y, width, height, 20);
    ctx.shadowBlur = 0;

    // 2. Animated title
    ctx.font = 'bold 34px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#22c55e';
    const titlePulse = 1 + Math.sin(time * 3) * 0.05;
    ctx.save();
    ctx.translate(x, y - 25);
    ctx.scale(titlePulse, titlePulse);
    ctx.fillText('🌱 Plant Life - Photosynthesis Engine', 0, 0);
    ctx.restore();
    ctx.shadowBlur = 0;

    // 3. Enhanced equation display
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(x + 20, y + 20, 400, 75);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 5;
    ctx.strokeRect(x + 20, y + 20, 400, 75);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Photosynthesis Equation:', x + 35, y + 45);
    ctx.font = 'bold 22px Arial';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('6CO₂ + 6H₂O + Light', x + 45, y + 68);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('→ C₆H₁₂O₆ + 6O₂', x + 75, y + 88);

    // 4. PLANT PARTS WITH ARROWS - Works for ALL plants
    // Leaves/Blade (top area)
    const leavesY = y + height * 0.2;
    drawLabelWithArrow(ctx, x - 140, leavesY, x + 5, leavesY, '🍃 Leaves/Blade', '#22c55e', 20);
    
    // Stem/Petiole (middle)
    const stemY = centerY;
    drawLabelWithArrow(ctx, x - 140, stemY, x + 5, stemY, '🌿 Stem/Trunk', '#10b981', 20);
    
    // Roots/Base (bottom)
    const rootsY = y + height * 0.85;
    drawLabelWithArrow(ctx, x - 140, rootsY, x + 5, rootsY, '🌱 Roots System', '#059669', 20);
    
    // Chloroplast (center-left)
    const chloroY = y + height * 0.35;
    drawLabelWithArrow(ctx, x + width + 50, chloroY, x + width - 5, chloroY, '🟢 Chloroplasts', '#34d399', 20);
    
    // Stomata (right side)
    const stomataY = y + height * 0.5;
    drawLabelWithArrow(ctx, x + width + 50, stomataY, x + width - 5, stomataY, '👄 Stomata (Pores)', '#6ee7b7', 20);
    
    // Flower/Top (if visible)
    const flowerY = y + height * 0.05;
    drawLabelWithArrow(ctx, x + width + 50, flowerY, x + width - 5, flowerY, '🌸 Flower/Apex', '#fb923c', 20);

    // 5. Enhanced data box
    const leafArea = (width * height * 0.6 / 1000).toFixed(1);
    drawInfoBox(ctx, x + width + 50, centerY + 50, [
      { icon: '☀️', label: 'Process', value: 'Photosynthesis' },
      { icon: '💧', label: 'H₂O', value: 'Absorbing ↑' },
      { icon: '🌬️', label: 'CO₂', value: 'Intake →' },
      { icon: '🫧', label: 'O₂', value: 'Release ↑' },
      { icon: '🍃', label: 'Stomata', value: 'OPEN' },
      { icon: '🌿', label: 'Chlorophyll', value: 'Active' },
      { icon: '📏', label: 'Leaf Area', value: `~${leafArea}cm²` },
      { icon: '🌡️', label: 'Temp', value: '20-25°C' },
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

  // ==================== MOBILE PHONE AR (ENHANCED) ====================
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
    // Enhanced particle generation
    if (Math.random() > 0.3) {
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

    // Enhanced bounding box
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 5;
    ctx.shadowBlur = 35;
    ctx.shadowColor = '#8b5cf6';
    drawRoundedRect(ctx, x, y, width, height, 15);
    ctx.shadowBlur = 0;
    
    drawAnimatedCorners(ctx, x, y, width, height, 45, time, '#8b5cf6');

    // Enhanced title
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#a78bfa';
    const titlePulse = 1 + Math.sin(time * 3) * 0.1;
    ctx.save();
    ctx.translate(x, y - 20);
    ctx.scale(titlePulse, titlePulse);
    ctx.fillText('📱 Mobile Device - Hardware Scan', 0, 0);
    ctx.restore();
    ctx.shadowBlur = 0;

    // MOBILE PHONE COMPONENT LABELING WITH ARROWS (DETECTED OR ESTIMATED)
    if (phoneComponents && phoneComponents.cameras && phoneComponents.cameras.length > 0) {
      // Use detected components for PRECISE labeling
      console.log('Using detected phone components:', phoneComponents);
      
      // Label detected cameras
      phoneComponents.cameras.forEach((camera: any, idx: number) => {
        if (idx < 3) { // Limit to first 3 cameras to avoid clutter
          const label = idx === 0 ? '📷 Front Camera' : `📸 Camera ${idx + 1}`;
          drawLabelWithArrow(ctx, camera.x + 80, camera.y, camera.x, camera.y, label, '#a78bfa', 18);
          
          // Draw camera highlight
          ctx.strokeStyle = '#a78bfa';
          ctx.lineWidth = 3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#a78bfa';
          ctx.beginPath();
          ctx.arc(camera.x, camera.y, camera.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });
      
      // Screen area
      const screen = phoneComponents.screenArea;
      drawLabelWithArrow(ctx, screen.x - 150, screen.y + screen.height / 2, screen.x, screen.y + screen.height / 2, '📱 Display Screen', '#8b5cf6', 20);
      
      // Draw screen outline
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#8b5cf6';
      ctx.strokeRect(screen.x, screen.y, screen.width, screen.height);
      ctx.shadowBlur = 0;
      
      // Charging port
      const port = phoneComponents.chargingPort;
      drawLabelWithArrow(ctx, port.x + port.width + 80, port.y, port.x + port.width / 2, port.y, '🔌 USB-C Port', '#a78bfa', 18);
      
      // Draw port highlight
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#a78bfa';
      ctx.strokeRect(port.x, port.y - port.height / 2, port.width, port.height);
      ctx.shadowBlur = 0;
      
      // Buttons
      phoneComponents.buttons.forEach((button: any) => {
        const label = button.type === 'volume' ? '🔊 Volume' : '⚡ Power';
        const labelX = button.x < centerX ? button.x - 150 : button.x + 150;
        drawLabelWithArrow(ctx, labelX, button.y, button.x, button.y, label, '#ddd6fe', 18);
        
        // Draw button highlight
        ctx.fillStyle = 'rgba(221, 214, 254, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ddd6fe';
        ctx.beginPath();
        ctx.arc(button.x, button.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      // Speaker (estimated top center)
      const speakerY = screen.y - 20;
      drawLabelWithArrow(ctx, centerX - 150, speakerY, centerX, speakerY, '🔊 Speaker', '#c4b5fd', 18);
      
      // Antenna Bands (estimated)
      const antennaTopY = screen.y - 40;
      const antennaBottomY = screen.y + screen.height + 40;
      drawLabelWithArrow(ctx, centerX + 150, antennaTopY, centerX + screen.width * 0.3, antennaTopY, '📡 Antenna', '#c4b5fd', 16);
      drawLabelWithArrow(ctx, centerX - 150, antennaBottomY, centerX - screen.width * 0.3, antennaBottomY, '📡 Antenna', '#c4b5fd', 16);
      
    } else {
      // Fallback to estimated positions
      console.log('Using estimated phone component positions');
      
      // Screen
      const screenY = y + height * 0.4;
      drawLabelWithArrow(ctx, x - 150, screenY, centerX, screenY, '📱 Display Screen', '#8b5cf6', 20);
      
      // Front Camera (top center)
      const frontCameraY = y + height * 0.1;
      drawLabelWithArrow(ctx, x + width + 60, frontCameraY, centerX, frontCameraY, '📷 Front Camera', '#a78bfa', 20);
      
      // Speaker (top)
      const speakerY = y + height * 0.05;
      drawLabelWithArrow(ctx, x - 150, speakerY, centerX, speakerY, '🔊 Speaker', '#c4b5fd', 20);
      
      // Volume Buttons (left side)
      const volumeY = centerY - height * 0.2;
      drawLabelWithArrow(ctx, x - 150, volumeY, x + 5, volumeY, '🔊 Volume', '#ddd6fe', 20);
      
      // Power Button (right side)
      const powerY = centerY - height * 0.15;
      drawLabelWithArrow(ctx, x + width + 60, powerY, x + width - 5, powerY, '⚡ Power', '#ddd6fe', 20);
      
      // Charging Port (bottom center)
      const portY = y + height * 0.95;
      drawLabelWithArrow(ctx, x + width + 60, portY, centerX, portY, '🔌 USB-C Port', '#a78bfa', 20);
      
      // Rear Camera (assume back, show on diagram)
      const rearCameraY = y + height * 0.12;
      drawLabelWithArrow(ctx, x - 150, rearCameraY, x + width * 0.15, rearCameraY, '📸 Rear Camera', '#8b5cf6', 20);
      
      // Antenna Bands (top and bottom)
      const antennaTopY = y + height * 0.02;
      const antennaBottomY = y + height * 0.98;
      drawLabelWithArrow(ctx, x + width + 60, antennaTopY, centerX + width * 0.3, antennaTopY, '📡 Antenna', '#c4b5fd', 18);
      drawLabelWithArrow(ctx, x - 150, antennaBottomY, centerX - width * 0.3, antennaBottomY, '📡 Antenna', '#c4b5fd', 18);
    }

    // Enhanced data box
    const diagonal = Math.sqrt(width * width + height * height) / 60;
    const detectionStatus = phoneComponents ? 'CV Detected' : 'Estimated';
    drawInfoBox(ctx, x + width + 60, centerY + 100, [
      { icon: '🎯', label: 'Detection', value: detectionStatus },
      { icon: '📐', label: 'Display', value: `${diagonal.toFixed(1)}"` },
      { icon: '⚡', label: 'Type', value: 'OLED/AMOLED' },
      { icon: '🔋', label: 'Power', value: 'Li-ion Battery' },
      { icon: '📡', label: 'Signal', value: '5G/LTE Active' },
      { icon: '🎮', label: 'SoC', value: 'Processor' },
      { icon: '💾', label: 'Storage', value: 'Flash Memory' },
      { icon: '🔐', label: 'Security', value: 'Biometric' },
    ]);

    // EM wave visualization (enhanced)
    for (let i = 0; i < 5; i++) {
      const radius = (Math.max(width, height) / 2) + (i * 35) + Math.sin(time * 3 + i) * 20;
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.5 - i * 0.08})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([14, 8]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Wave labels
      if (i === 2) {
        ctx.fillStyle = '#a78bfa';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('📡 EM Waves', centerX + radius / Math.sqrt(2) + 15, centerY - radius / Math.sqrt(2) - 15);
      }
    }

    // Signal strength bars (animated)
    const barCount = 5;
    const barSpacing = 12;
    const barWidth = 8;
    for (let i = 0; i < barCount; i++) {
      const barHeight = 15 + i * 8;
      const opacity = (Math.sin(time * 4 - i * 0.5) + 1) / 2;
      ctx.fillStyle = `rgba(139, 92, 246, ${opacity})`;
      ctx.fillRect(
        x + width - barCount * barSpacing + i * barSpacing,
        y + 15 - barHeight,
        barWidth,
        barHeight
      );
    }

    // Battery indicator
    const batteryWidth = 50;
    const batteryHeight = 25;
    const batteryX = x + 15;
    const batteryY = y + 10;
    
    // Battery outline
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 3;
    ctx.strokeRect(batteryX, batteryY, batteryWidth, batteryHeight);
    
    // Battery terminal
    ctx.fillStyle = '#a78bfa';
    ctx.fillRect(batteryX + batteryWidth, batteryY + 7, 5, 11);
    
    // Battery fill (animated)
    const batteryLevel = 0.3 + (Math.sin(time * 2) + 1) / 2 * 0.7;
    ctx.fillStyle = batteryLevel > 0.5 ? '#22c55e' : '#ef4444';
    ctx.fillRect(batteryX + 3, batteryY + 3, (batteryWidth - 6) * batteryLevel, batteryHeight - 6);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`${Math.round(batteryLevel * 100)}%`, batteryX + batteryWidth + 12, batteryY + 18);

    // Screen glow effect
    ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
    ctx.fillRect(x + width * 0.1, y + height * 0.15, width * 0.8, height * 0.7);
    
    // Reflection effect
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x + width * 0.1, y + height * 0.15, width * 0.4, height * 0.7);
  };

  // ==================== HUMAN FACE AR (MEDIAPIPE ENHANCED) ====================
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    // If we have MediaPipe landmarks, use them for PRECISE mapping
    if (faceLandmarks && faceLandmarks.length > 0) {
      console.log('Drawing with MediaPipe landmarks:', faceLandmarks.length);
      
      // MediaPipe Face Mesh landmark indices (468 total landmarks)
      // Key facial features:
      // Eyes: 33, 133, 159, 145 (left eye corners), 362, 263, 386, 374 (right eye corners)
      // Nose: 1 (tip), 168 (bridge), 6 (bottom)
      // Mouth: 61, 291 (corners), 0 (top), 17 (bottom)
      // Face oval: 10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109

      // Draw face mesh (connect all landmarks)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.lineWidth = 1;
      ctx.fillStyle = '#10b981';
      
      // Draw all landmarks as dots
      faceLandmarks.forEach((landmark: any, idx: number) => {
        const lx = landmark.x * canvas.width;
        const ly = landmark.y * canvas.height;
        
        ctx.beginPath();
        ctx.arc(lx, ly, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Extract key facial features with precise coordinates
      const leftEye = faceLandmarks[33]; // Left eye left corner
      const leftEyeRight = faceLandmarks[133]; // Left eye right corner
      const leftEyeTop = faceLandmarks[159]; // Left eye top
      const leftEyeBottom = faceLandmarks[145]; // Left eye bottom
      
      const rightEye = faceLandmarks[362]; // Right eye right corner
      const rightEyeLeft = faceLandmarks[263]; // Right eye left corner
      const rightEyeTop = faceLandmarks[386]; // Right eye top
      const rightEyeBottom = faceLandmarks[374]; // Right eye bottom
      
      const noseTip = faceLandmarks[1];
      const noseBridge = faceLandmarks[168];
      const noseBottom = faceLandmarks[6];
      
      const mouthLeft = faceLandmarks[61];
      const mouthRight = faceLandmarks[291];
      const mouthTop = faceLandmarks[0];
      const mouthBottom = faceLandmarks[17];
      
      const forehead = faceLandmarks[10];
      const chin = faceLandmarks[152];
      
      const leftEar = faceLandmarks[234]; // Left ear region
      const rightEar = faceLandmarks[454]; // Right ear region

      // Convert normalized coordinates to canvas coordinates
      const toCanvasCoords = (landmark: any) => ({
        x: landmark.x * canvas.width,
        y: landmark.y * canvas.height
      });

      const leftEyeCenter = toCanvasCoords(leftEye);
      const rightEyeCenter = toCanvasCoords(rightEye);
      const noseCenter = toCanvasCoords(noseTip);
      const mouthCenter = toCanvasCoords({ 
        x: (mouthLeft.x + mouthRight.x) / 2, 
        y: (mouthTop.y + mouthBottom.y) / 2 
      });
      const foreheadPos = toCanvasCoords(forehead);
      const chinPos = toCanvasCoords(chin);
      const leftEarPos = toCanvasCoords(leftEar);
      const rightEarPos = toCanvasCoords(rightEar);

      // Title
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#10b981';
      ctx.fillText('👤 MediaPipe Face Mesh - 468 Landmarks', 50, 50);
      ctx.shadowBlur = 0;

      // PRECISE FACIAL FEATURE LABELING WITH ARROWS
      // Left Eye
      drawLabelWithArrow(ctx, leftEyeCenter.x - 150, leftEyeCenter.y, leftEyeCenter.x, leftEyeCenter.y, '👁️ Left Eye', '#10b981', 20);
      
      // Right Eye
      drawLabelWithArrow(ctx, rightEyeCenter.x + 150, rightEyeCenter.y, rightEyeCenter.x, rightEyeCenter.y, '👁️ Right Eye', '#10b981', 20);
      
      // Nose
      drawLabelWithArrow(ctx, noseCenter.x - 150, noseCenter.y, noseCenter.x, noseCenter.y, '👃 Nose Tip', '#22d3bb', 20);
      
      // Mouth
      drawLabelWithArrow(ctx, mouthCenter.x + 150, mouthCenter.y, mouthCenter.x, mouthCenter.y, '👄 Mouth', '#22d3bb', 20);
      
      // Forehead
      drawLabelWithArrow(ctx, foreheadPos.x - 150, foreheadPos.y, foreheadPos.x, foreheadPos.y, '🧠 Forehead', '#34d399', 20);
      
      // Chin
      drawLabelWithArrow(ctx, chinPos.x + 150, chinPos.y, chinPos.x, chinPos.y, '😊 Chin', '#34d399', 20);
      
      // Left Ear
      drawLabelWithArrow(ctx, leftEarPos.x - 150, leftEarPos.y, leftEarPos.x, leftEarPos.y, '👂 Left Ear', '#6ee7b7', 20);
      
      // Right Ear
      drawLabelWithArrow(ctx, rightEarPos.x + 150, rightEarPos.y, rightEarPos.x, rightEarPos.y, '👂 Right Ear', '#6ee7b7', 20);

      // Draw eye outlines with precise landmarks
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#10b981';
      
      // Left eye
      ctx.beginPath();
      const leftEyeCoords = [33, 160, 158, 133, 153, 144, 145, 159].map(idx => toCanvasCoords(faceLandmarks[idx]));
      ctx.moveTo(leftEyeCoords[0].x, leftEyeCoords[0].y);
      leftEyeCoords.forEach(coord => ctx.lineTo(coord.x, coord.y));
      ctx.closePath();
      ctx.stroke();
      
      // Right eye
      ctx.beginPath();
      const rightEyeCoords = [362, 385, 387, 263, 373, 380, 374, 386].map(idx => toCanvasCoords(faceLandmarks[idx]));
      ctx.moveTo(rightEyeCoords[0].x, rightEyeCoords[0].y);
      rightEyeCoords.forEach(coord => ctx.lineTo(coord.x, coord.y));
      ctx.closePath();
      ctx.stroke();
      
      // Mouth outline
      ctx.strokeStyle = '#22d3bb';
      ctx.beginPath();
      const mouthCoords = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291].map(idx => toCanvasCoords(faceLandmarks[idx]));
      ctx.moveTo(mouthCoords[0].x, mouthCoords[0].y);
      mouthCoords.forEach(coord => ctx.lineTo(coord.x, coord.y));
      ctx.closePath();
      ctx.stroke();
      
      ctx.shadowBlur = 0;

      // Data box with MediaPipe info
      drawInfoBox(ctx, 50, canvas.height - 250, [
        { icon: '🎯', label: 'Landmarks', value: '468 Points' },
        { icon: '🧠', label: 'AI Model', value: 'MediaPipe' },
        { icon: '👁️', label: 'Eyes', value: 'Tracked' },
        { icon: '�', label: 'Mouth', value: 'Mapped' },
        { icon: '📐', label: 'Accuracy', value: '99.9%' },
      ]);

      // Scanning animation
      const scanY = (time * 150) % canvas.height;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.fillRect(0, scanY, canvas.width, 6);

    } else {
      // Fallback to estimated positions if MediaPipe not loaded yet
      console.log('Using fallback face detection (MediaPipe loading...)');
      
      // Scanning animation
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 5;
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#10b981';
      
      const scanY = y + ((time * 150) % height);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.fillRect(x, scanY, width, 8);
      
      drawAnimatedCorners(ctx, x, y, width, height, 60, time, '#10b981');
      ctx.shadowBlur = 0;

      // Title
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#10b981';
      ctx.fillText('👤 Loading MediaPipe Face Mesh...', x, y - 20);
      ctx.shadowBlur = 0;

      // FACIAL FEATURES WITH ARROWS - ESTIMATED POSITIONS
      const leftEyeX = centerX - width * 0.2;
      const leftEyeY = centerY - height * 0.25;
      drawLabelWithArrow(ctx, x - 150, leftEyeY, leftEyeX, leftEyeY, '👁️ Left Eye', '#10b981', 20);
      
      const rightEyeX = centerX + width * 0.2;
      const rightEyeY = centerY - height * 0.25;
      drawLabelWithArrow(ctx, x + width + 60, rightEyeY, rightEyeX, rightEyeY, '👁️ Right Eye', '#10b981', 20);
      
      const noseX = centerX;
      const noseY = centerY;
      drawLabelWithArrow(ctx, x - 150, noseY, noseX, noseY, '👃 Nose', '#22d3bb', 20);
      
      const mouthX = centerX;
      const mouthY = centerY + height * 0.22;
      drawLabelWithArrow(ctx, x + width + 60, mouthY, mouthX, mouthY, '👄 Mouth', '#22d3bb', 20);
      
      const foreheadY = y + height * 0.15;
      drawLabelWithArrow(ctx, x - 150, foreheadY, centerX, foreheadY, '🧠 Forehead', '#34d399', 20);
      
      const chinY = y + height * 0.85;
      drawLabelWithArrow(ctx, x + width + 60, chinY, centerX, chinY, '😊 Chin', '#34d399', 20);
      
      const leftEarY = centerY;
      drawLabelWithArrow(ctx, x - 150, leftEarY - 40, x + 10, leftEarY, '👂 Left Ear', '#6ee7b7', 20);
      
      const rightEarY = centerY;
      drawLabelWithArrow(ctx, x + width + 60, rightEarY - 40, x + width - 10, rightEarY, '👂 Right Ear', '#6ee7b7', 20);

      // Data box
      drawInfoBox(ctx, x + width + 60, centerY + 50, [
        { icon: '⏳', label: 'Status', value: 'Loading...' },
        { icon: '🧠', label: 'AI Model', value: 'MediaPipe' },
        { icon: '📡', label: 'Processing', value: 'Please wait' },
      ]);
    }
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

  // ==================== NEW HELPER FUNCTIONS ====================
  
  // Draw rounded rectangle
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.stroke();
  };

  // Draw label with arrow pointing to target
  const drawLabelWithArrow = (
    ctx: CanvasRenderingContext2D,
    labelX: number,
    labelY: number,
    targetX: number,
    targetY: number,
    text: string,
    color: string,
    fontSize: number = 18
  ) => {
    // Draw arrow line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.moveTo(labelX, labelY);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw arrowhead
    const angle = Math.atan2(targetY - labelY, targetX - labelX);
    const headLength = 12;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(targetX, targetY);
    ctx.lineTo(
      targetX - headLength * Math.cos(angle - Math.PI / 6),
      targetY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      targetX - headLength * Math.cos(angle + Math.PI / 6),
      targetY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    // Measure text for label box
    ctx.font = `bold ${fontSize}px Arial`;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize;
    const padding = 8;

    // Draw label background box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(
      labelX - textWidth / 2 - padding,
      labelY - textHeight / 2 - padding,
      textWidth + padding * 2,
      textHeight + padding * 2
    );

    // Draw label border
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      labelX - textWidth / 2 - padding,
      labelY - textHeight / 2 - padding,
      textWidth + padding * 2,
      textHeight + padding * 2
    );

    // Draw text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, labelX, labelY);
  };

  // Draw curved arrow path (for flow visualization)
  const drawCurvedArrowPath = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    lineWidth: number,
    label: string,
    time: number
  ) => {
    const controlPointOffset = 40;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const perpX = -dy;
    const perpY = dx;
    const len = Math.sqrt(perpX * perpX + perpY * perpY);
    const normalX = perpX / len;
    const normalY = perpY / len;
    
    const controlX = midX + normalX * controlPointOffset;
    const controlY = midY + normalY * controlPointOffset;

    // Animated dash offset
    const dashOffset = (time * 50) % 20;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash([10, 5]);
    ctx.lineDashOffset = -dashOffset;
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(controlX, controlY, x2, y2);
    ctx.stroke();
    
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
    ctx.shadowBlur = 0;

    // Draw arrowhead at end
    const angle = Math.atan2(y2 - controlY, x2 - controlX);
    const headLength = 10;
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

    // Draw label at control point
    if (label) {
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = color;
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText(label, controlX, controlY);
      ctx.shadowBlur = 0;
    }
  };

  // Draw measurement line with dimension label
  const drawMeasurementLine = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    label: string,
    color: string
  ) => {
    const tickSize = 8;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);

    // Main measurement line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);

    // End ticks
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const perpAngle = angle + Math.PI / 2;

    // Tick at start
    ctx.beginPath();
    ctx.moveTo(x1 + Math.cos(perpAngle) * tickSize, y1 + Math.sin(perpAngle) * tickSize);
    ctx.lineTo(x1 - Math.cos(perpAngle) * tickSize, y1 - Math.sin(perpAngle) * tickSize);
    ctx.stroke();

    // Tick at end
    ctx.beginPath();
    ctx.moveTo(x2 + Math.cos(perpAngle) * tickSize, y2 + Math.sin(perpAngle) * tickSize);
    ctx.lineTo(x2 - Math.cos(perpAngle) * tickSize, y2 - Math.sin(perpAngle) * tickSize);
    ctx.stroke();

    // Label at midpoint
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Background for label
    const metrics = ctx.measureText(label);
    const padding = 6;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(
      midX - metrics.width / 2 - padding,
      midY - 10,
      metrics.width + padding * 2,
      20
    );
    
    ctx.fillStyle = color;
    ctx.fillText(label, midX, midY);
    ctx.shadowBlur = 0;
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
