import React, { useEffect, useRef } from 'react';

interface AmbientCanvasProps {
  type: 'rain' | 'motes' | 'leaves' | 'stars' | 'none';
  enabled: boolean;
}

export const AmbientCanvas: React.FC<AmbientCanvasProps> = ({ type, enabled }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled || type === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    const count = type === 'rain' ? 80 : type === 'stars' ? 50 : 35;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speedX: type === 'rain' ? -0.5 : (Math.random() - 0.5) * 0.4,
      speedY: type === 'rain' ? 6 + Math.random() * 4 : type === 'motes' ? -0.3 - Math.random() * 0.4 : 0.4 + Math.random() * 0.5,
      size: type === 'stars' ? 1 + Math.random() * 2 : type === 'motes' ? 1.5 + Math.random() * 2.5 : type === 'leaves' ? 4 + Math.random() * 4 : 12,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;

        // Wrap around
        if (p.y > height + 20) {
          p.y = -10;
          p.x = Math.random() * width;
        } else if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -10;
        else if (p.x < -20) p.x = width + 10;

        ctx.save();
        if (type === 'rain') {
          ctx.strokeStyle = `rgba(224, 242, 254, ${p.opacity * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 3, p.y + p.size);
          ctx.stroke();
        } else if (type === 'stars') {
          const currentAlpha = Math.max(0.1, Math.min(1, Math.sin(p.pulse) * 0.5 + 0.5)) * p.opacity;
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'motes') {
          const currentAlpha = (Math.sin(p.pulse) * 0.3 + 0.7) * p.opacity;
          ctx.fillStyle = `rgba(253, 230, 138, ${currentAlpha * 0.6})`;
          ctx.shadowColor = 'rgba(251, 191, 36, 0.4)';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'leaves') {
          p.rot += p.rotSpeed;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = `rgba(134, 239, 172, ${p.opacity * 0.4})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [type, enabled]);

  if (!enabled || type === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
};
