// Renderer class for advanced visual effects
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.effects = [];
    }

    // Draw glowing line
    drawGlowLine(x1, y1, x2, y2, color, width = 2) {
        this.ctx.save();
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.restore();
    }

    // Draw gradient rectangle with glow
    drawGlowRect(x, y, width, height, color1, color2) {
        this.ctx.save();
        const gradient = this.ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        this.ctx.fillStyle = gradient;
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = color1;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.restore();
    }

    // Draw animated pulse
    drawPulse(x, y, radius, color, phase = 0) {
        const time = Date.now() / 1000;
        const pulseRadius = radius + Math.sin(time * 3 + phase) * 5;
        const alpha = 0.5 + Math.sin(time * 3 + phase) * 0.3;

        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
    }

    // Draw tech text
    drawTechText(text, x, y, options = {}) {
        const {
            size = 16,
            color = '#00f5ff',
            align = 'left',
            glow = true
        } = options;

        this.ctx.save();
        this.ctx.font = `${size}px 'Orbitron', sans-serif`;
        this.ctx.textAlign = align;
        this.ctx.fillStyle = color;

        if (glow) {
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = color;
        }

        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }

    // Draw energy wave
    drawEnergyWave(x, y, width, amplitude, frequency, phase, color) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = color;
        this.ctx.beginPath();

        for (let i = 0; i <= width; i += 2) {
            const waveY = y + Math.sin((i * frequency) + phase) * amplitude;
            if (i === 0) {
                this.ctx.moveTo(x + i, waveY);
            } else {
                this.ctx.lineTo(x + i, waveY);
            }
        }

        this.ctx.stroke();
        this.ctx.restore();
    }

    // Draw particle trail
    drawParticleTrail(points, color, width = 3) {
        if (points.length < 2) return;

        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = color;

        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            const alpha = i / points.length;
            this.ctx.globalAlpha = alpha;
            this.ctx.lineTo(points[i].x, points[i].y);
        }

        this.ctx.stroke();
        this.ctx.restore();
    }

    // Draw hologram effect
    drawHologram(x, y, width, height, color) {
        const time = Date.now() / 1000;

        this.ctx.save();

        // Scanline effect
        const scanY = y + (time * 100) % height;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(x, scanY, width, 2);

        // Flicker effect
        if (Math.random() > 0.95) {
            this.ctx.fillStyle = color;
            this.ctx.globalAlpha = 0.1;
            this.ctx.fillRect(x, y, width, height);
        }

        // Border glow
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.5 + Math.sin(time * 5) * 0.3;
        this.ctx.strokeRect(x, y, width, height);

        this.ctx.restore();
    }

    // Draw connection lines between points
    drawConnections(points, color, maxDistance = 100) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;

        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const alpha = 1 - (distance / maxDistance);
                    this.ctx.globalAlpha = alpha * 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(points[i].x, points[i].y);
                    this.ctx.lineTo(points[j].x, points[j].y);
                    this.ctx.stroke();
                }
            }
        }

        this.ctx.restore();
    }

    // Draw progress ring
    drawProgressRing(x, y, radius, progress, color) {
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (Math.PI * 2 * progress);

        this.ctx.save();

        // Background ring
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();

        // Progress ring
        this.ctx.strokeStyle = color;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, startAngle, endAngle);
        this.ctx.stroke();

        this.ctx.restore();
    }

    // Draw grid background
    drawGrid(cameraX, cameraY, width, height, gridSize = 50) {
        const startX = Math.floor(cameraX / gridSize) * gridSize;
        const startY = Math.floor(cameraY / gridSize) * gridSize;

        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0, 245, 255, 0.05)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = startX; x < cameraX + width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, cameraY);
            this.ctx.lineTo(x, cameraY + height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = startY; y < cameraY + height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(cameraX, y);
            this.ctx.lineTo(cameraX + width, y);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    // Draw mini map
    drawMiniMap(player, levelWidth, levelHeight, x, y, width, height) {
        const scaleX = width / levelWidth;
        const scaleY = height / levelHeight;

        this.ctx.save();

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x, y, width, height);
        this.ctx.strokeStyle = 'rgba(0, 245, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Player dot
        const playerX = x + (player.x * scaleX);
        const playerY = y + (player.y * scaleY);

        this.ctx.fillStyle = '#00f5ff';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00f5ff';
        this.ctx.beginPath();
        this.ctx.arc(playerX, playerY, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }
}

// Chart drawer for gradient visualization
class GradientChart {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.data = [];
        this.maxDataPoints = 50;
    }

    addValue(value) {
        this.data.push(value);
        if (this.data.length > this.maxDataPoints) {
            this.data.shift();
        }
        this.draw();
    }

    draw() {
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);

        if (this.data.length < 2) return;

        // Draw grid
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, height / 2);
        this.ctx.lineTo(width, height / 2);
        this.ctx.stroke();

        // Draw line
        const stepX = width / (this.maxDataPoints - 1);
        const minVal = Math.min(...this.data);
        const maxVal = Math.max(...this.data);
        const range = maxVal - minVal || 1;

        this.ctx.save();
        this.ctx.strokeStyle = '#00ff88';
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00ff88';
        this.ctx.beginPath();

        this.data.forEach((val, i) => {
            const x = i * stepX;
            const y = height - ((val - minVal) / range) * height * 0.8 - height * 0.1;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        this.ctx.stroke();
        this.ctx.restore();

        // Draw area under line
        this.ctx.save();
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
        this.ctx.fillStyle = gradient;

        this.ctx.beginPath();
        this.data.forEach((val, i) => {
            const x = i * stepX;
            const y = height - ((val - minVal) / range) * height * 0.8 - height * 0.1;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        this.ctx.lineTo(width, height);
        this.ctx.lineTo(0, height);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }
}
