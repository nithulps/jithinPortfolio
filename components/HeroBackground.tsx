"use client";

import { useEffect, useRef } from "react";

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: -1000, y: -1000, active: false };

    function handleResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDots();
    }

    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }

    function handleMouseLeave() {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const spacing = 55;
    let cols = 0;
    let rows = 0;
    const dots: Array<{
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      size: number;
      opacity: number;
    }> = [];

    function initDots() {
      dots.length = 0;
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          dots.push({
            baseX: x,
            baseY: y,
            x: x,
            y: y,
            size: 2.0,
            opacity: 0.15,
          });
        }
      }
    }

    initDots();

    let time = 0;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      time += 0.005;

      const hoverRadius = 140;

      // 1. Update all dots position and size/opacity target values
      for (const dot of dots) {
        const waveX = Math.sin(time + dot.baseY * 0.01) * 4;
        const waveY = Math.cos(time + dot.baseX * 0.01) * 4;

        let targetX = dot.baseX + waveX;
        let targetY = dot.baseY + waveY;
        let targetSize = 2.0;
        let targetOpacity = 0.15;

        if (mouse.active) {
          const dx = mouse.x - dot.x;
          const dy = mouse.y - dot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < hoverRadius) {
            const force = (hoverRadius - dist) / hoverRadius;
            
            targetX = dot.baseX + waveX - (dx / dist) * force * 18;
            targetY = dot.baseY + waveY - (dy / dist) * force * 18;

            targetSize = 2.0 + force * 2.8;
            targetOpacity = 0.15 + force * 0.65;
          }
        }

        dot.x += (targetX - dot.x) * 0.12;
        dot.y += (targetY - dot.y) * 0.12;
        dot.size += (targetSize - dot.size) * 0.12;
        dot.opacity += (targetOpacity - dot.opacity) * 0.12;
      }

      // 2. Draw grid lines connecting adjacent dots
      ctx.lineWidth = 0.8;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = i * rows + j;
          const dot = dots[idx];
          if (!dot) continue;

          // Line to right neighbor (i + 1, j)
          if (i < cols - 1) {
            const rightIdx = (i + 1) * rows + j;
            const rightDot = dots[rightIdx];
            if (rightDot) {
              const opacity = ((dot.opacity + rightDot.opacity) / 2) * 0.28;
              ctx.strokeStyle = `rgba(0, 222, 255, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(dot.x, dot.y);
              ctx.lineTo(rightDot.x, rightDot.y);
              ctx.stroke();
            }
          }

          // Line to bottom neighbor (i, j + 1)
          if (j < rows - 1) {
            const bottomIdx = i * rows + (j + 1);
            const bottomDot = dots[bottomIdx];
            if (bottomDot) {
              const opacity = ((dot.opacity + bottomDot.opacity) / 2) * 0.28;
              ctx.strokeStyle = `rgba(0, 222, 255, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(dot.x, dot.y);
              ctx.lineTo(bottomDot.x, bottomDot.y);
              ctx.stroke();
            }
          }
        }
      }

      // 3. Draw dots on top of the lines
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        
        if (dot.opacity > 0.25) {
          ctx.shadowBlur = (dot.size - 2.0) * 6;
          ctx.shadowColor = "rgba(0, 222, 255, 0.5)";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgba(0, 222, 255, ${dot.opacity})`;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.85
      }}
    />
  );
}
