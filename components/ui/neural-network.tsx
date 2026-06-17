"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

export function NeuralNetwork() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        
        let mouseX = -1000;
        let mouseY = -1000;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };
        
        const handleMouseLeave = () => {
            mouseX = -1000;
            mouseY = -1000;
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        // Helper function to define the brain mask using overlapping circles
        const isInsideBrain = (x: number, y: number, w: number, h: number) => {
            const minDim = Math.min(w, h);
            
            const circles = [
                // Main Cerebrum
                { cx: w * 0.5, cy: h * 0.45, r: minDim * 0.35 },
                // Frontal Lobe (Left)
                { cx: w * 0.5 - minDim * 0.2, cy: h * 0.5, r: minDim * 0.22 },
                // Occipital Lobe (Right)
                { cx: w * 0.5 + minDim * 0.2, cy: h * 0.5, r: minDim * 0.22 },
                // Cerebellum (Bottom Right)
                { cx: w * 0.5 + minDim * 0.15, cy: h * 0.65, r: minDim * 0.18 },
                // Brain Stem area (Bottom Center)
                { cx: w * 0.5, cy: h * 0.65, r: minDim * 0.15 },
            ];

            return circles.some(c => {
                const dx = x - c.cx;
                const dy = y - c.cy;
                return Math.sqrt(dx * dx + dy * dy) <= c.r;
            });
        };

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                initParticles();
            }
        };

        const initParticles = () => {
            particles = [];
            // Increased density: ~250 nodes for a 1000x1000 area
            const area = canvas.width * canvas.height;
            const particleCount = Math.min(Math.floor(area / 3000), 250); 

            let attempts = 0;
            while (particles.length < particleCount && attempts < particleCount * 10) {
                const px = Math.random() * canvas.width;
                const py = Math.random() * canvas.height;
                
                if (isInsideBrain(px, py, canvas.width, canvas.height)) {
                    particles.push({
                        x: px,
                        y: py,
                        vx: (Math.random() - 0.5) * 0.8,
                        vy: (Math.random() - 0.5) * 0.8,
                        radius: Math.random() * 1.5 + 0.5,
                    });
                }
                attempts++;
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const isDark = resolvedTheme === "dark";
            const particleColor = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)";
            const lineColorRGB = isDark ? "255, 255, 255" : "0, 0, 0";
            
            // Reduced distance to match higher density
            const maxDistance = 70;
            const mouseDistance = 120;

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off the brain mask boundary
                if (!isInsideBrain(p.x, p.y, canvas.width, canvas.height)) {
                    p.vx *= -1;
                    p.vy *= -1;
                    p.x += p.vx;
                    p.y += p.vy;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();

                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = 1 - Math.pow(distance / maxDistance, 2); // Non-linear opacity for glowing effect
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${lineColorRGB}, ${opacity * 0.3})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }

                const dxMouse = p.x - mouseX;
                const dyMouse = p.y - mouseY;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                
                if (distMouse < mouseDistance) {
                    const opacity = 1 - distMouse / mouseDistance;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(${lineColorRGB}, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        draw();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [resolvedTheme, mounted]);

    // Removed borders and background to integrate cleanly with the page
    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}
            />
        </div>
    );
}
