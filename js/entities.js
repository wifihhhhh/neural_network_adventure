class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 10;
        this.jumpPower = 16;
        this.gravity = 0.45;
        this.friction = 0.85;
        this.grounded = false;
        this.facingRight = true;
        this.animationFrame = 0;
        this.jumpCount = 0;
        this.maxJumps = 2;
        this.canJump = true;
    }
    
    update(deltaTime, keys, platforms) {
        // Horizontal movement
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.velocityX -= this.speed * 0.5;
            this.facingRight = false;
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            this.velocityX += this.speed * 0.5;
            this.facingRight = true;
        }
        
        // Apply friction
        this.velocityX *= this.friction;
        
        // Jump with double jump
        if (keys['Space'] || keys['ArrowUp'] || keys['KeyW']) {
            if (this.canJump && (this.grounded || this.jumpCount < this.maxJumps)) {
                this.velocityY = -this.jumpPower;
                this.grounded = false;
                this.jumpCount++;
                this.canJump = false;
            }
        } else {
            this.canJump = true;
        }
        
        // Apply gravity
        this.velocityY += this.gravity;
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Platform collision
        this.grounded = false;
        platforms.forEach(platform => {
            if (this.checkCollision(platform)) {
                // Landing on top
                if (this.velocityY > 0 && this.y < platform.y) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.grounded = true;
                    this.jumpCount = 0;
                }
                // Hitting from below
                else if (this.velocityY < 0 && this.y > platform.y) {
                    this.y = platform.y + platform.height;
                    this.velocityY = 0;
                }
                // Side collision
                else if (this.velocityX > 0) {
                    this.x = platform.x - this.width;
                    this.velocityX = 0;
                }
                else if (this.velocityX < 0) {
                    this.x = platform.x + platform.width;
                    this.velocityX = 0;
                }
            }
        });
        
        // Animation
        this.animationFrame += deltaTime * 10;
    }
    
    checkCollision(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
    
    render(ctx) {
        ctx.save();
        
        // Advanced glow effect with multiple colors
        const gradient = ctx.createRadialGradient(
            this.x + this.width/2, this.y + this.height/2, 0,
            this.x + this.width/2, this.y + this.height/2, 40
        );
        gradient.addColorStop(0, 'rgba(0, 245, 255, 0.6)');
        gradient.addColorStop(0.5, 'rgba(184, 41, 221, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - 25, this.y - 25, this.width + 50, this.height + 50);
        
        // Player body with gradient
        const bodyGradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        bodyGradient.addColorStop(0, '#00f5ff');
        bodyGradient.addColorStop(0.5, '#b829dd');
        bodyGradient.addColorStop(1, '#ff00d0');
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Inner core with glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 6, this.y + 6, this.width - 12, this.height - 12);
        ctx.shadowBlur = 0;
        
        // Eyes with neon effect
        ctx.fillStyle = '#0a0a1a';
        if (this.facingRight) {
            ctx.fillRect(this.x + 18, this.y + 8, 4, 4);
            ctx.fillRect(this.x + 18, this.y + 18, 4, 4);
        } else {
            ctx.fillRect(this.x + 8, this.y + 8, 4, 4);
            ctx.fillRect(this.x + 8, this.y + 18, 4, 4);
        }
        
        // Enhanced trail effect when moving fast
        if (Math.abs(this.velocityX) > 5) {
            const trailGradient = ctx.createLinearGradient(
                this.facingRight ? this.x - 20 : this.x + this.width + 20,
                this.y,
                this.facingRight ? this.x : this.x + this.width,
                this.y
            );
            trailGradient.addColorStop(0, 'rgba(0, 245, 255, 0)');
            trailGradient.addColorStop(0.5, 'rgba(184, 41, 221, 0.2)');
            trailGradient.addColorStop(1, 'rgba(255, 0, 208, 0.4)');
            ctx.fillStyle = trailGradient;
            const trailX = this.facingRight ? this.x - 20 : this.x + this.width;
            ctx.fillRect(trailX, this.y + 5, 20, this.height - 10);
        }
        
        ctx.restore();
    }
}

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    render(ctx) {
        ctx.save();
        
        // Main platform with glassmorphism effect
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, 'rgba(30, 30, 60, 0.9)');
        gradient.addColorStop(0.5, 'rgba(20, 20, 45, 0.95)');
        gradient.addColorStop(1, 'rgba(15, 15, 35, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Top border glow with gradient
        const topGradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
        topGradient.addColorStop(0, 'rgba(0, 245, 255, 0.3)');
        topGradient.addColorStop(0.5, 'rgba(184, 41, 221, 0.8)');
        topGradient.addColorStop(1, 'rgba(255, 0, 208, 0.3)');
        ctx.fillStyle = topGradient;
        ctx.fillRect(this.x, this.y, this.width, 2);
        
        // Side borders with glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 245, 255, 0.5)';
        ctx.fillStyle = 'rgba(0, 245, 255, 0.4)';
        ctx.fillRect(this.x, this.y, 2, this.height);
        ctx.fillRect(this.x + this.width - 2, this.y, 2, this.height);
        ctx.shadowBlur = 0;
        
        // Tech pattern with multiple colors
        for (let i = 10; i < this.width; i += 20) {
            const patternGradient = ctx.createLinearGradient(this.x + i, this.y + 5, this.x + i, this.y + this.height - 5);
            patternGradient.addColorStop(0, 'rgba(0, 245, 255, 0.15)');
            patternGradient.addColorStop(0.5, 'rgba(184, 41, 221, 0.2)');
            patternGradient.addColorStop(1, 'rgba(255, 0, 208, 0.15)');
            ctx.fillStyle = patternGradient;
            ctx.fillRect(this.x + i, this.y + 5, 2, this.height - 10);
        }
        
        ctx.restore();
    }
}

class Collectible {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.type = type;
        this.animationOffset = Math.random() * Math.PI * 2;
        this.collected = false;
    }
    
    render(ctx) {
        if (this.collected) return;
        
        const time = Date.now() / 1000;
        const floatY = Math.sin(time * 3 + this.animationOffset) * 5;
        const scale = 1 + Math.sin(time * 4 + this.animationOffset) * 0.1;
        
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2 + floatY);
        ctx.scale(scale, scale);
        
        if (this.type === 'energy') {
            // Energy orb with cyan-purple gradient
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 25);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(0.2, 'rgba(0, 245, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(184, 41, 221, 0.5)');
            gradient.addColorStop(0.8, 'rgba(255, 0, 208, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 0, 208, 0)');
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(0, 245, 255, 0.8)';
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Inner core with glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffffff';
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Rotating ring
            ctx.strokeStyle = 'rgba(0, 245, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 18, time * 2, time * 2 + Math.PI * 1.5);
            ctx.stroke();
            
        } else if (this.type === 'neuron') {
            // Neuron with gold-purple gradient
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 25);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(0.2, 'rgba(255, 215, 0, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 107, 53, 0.5)');
            gradient.addColorStop(0.8, 'rgba(184, 41, 221, 0.2)');
            gradient.addColorStop(1, 'rgba(184, 41, 221, 0)');
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Inner core with glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffffff';
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Pulsing ring
            const pulseScale = 1 + Math.sin(time * 4) * 0.2;
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 18 * pulseScale, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 35;
        this.type = type;
        this.velocityX = type === 'overfit' ? 1.2 : 0.8;
        this.patrolStart = x - 80;
        this.patrolEnd = x + 80;
        this.animationFrame = 0;
    }
    
    update(deltaTime, player) {
        this.animationFrame += deltaTime * 5;
        
        // Patrol movement
        this.x += this.velocityX;
        
        if (this.x <= this.patrolStart || this.x >= this.patrolEnd) {
            this.velocityX *= -1;
        }
        
        // Chase player if close
        const distToPlayer = Math.abs(player.x - this.x);
        if (distToPlayer < 100 && Math.abs(player.y - this.y) < 80) {
            if (player.x > this.x) {
                this.velocityX = Math.abs(this.velocityX);
            } else {
                this.velocityX = -Math.abs(this.velocityX);
            }
        }
    }
    
    render(ctx) {
        ctx.save();
        
        const bounce = Math.sin(this.animationFrame) * 3;
        
        if (this.type === 'overfit') {
            // Overfit monster - red spiky
            const gradient = ctx.createRadialGradient(
                this.x + this.width/2, this.y + this.height/2 + bounce, 0,
                this.x + this.width/2, this.y + this.height/2 + bounce, 30
            );
            gradient.addColorStop(0, 'rgba(255, 51, 102, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 51, 102, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x - 10, this.y - 10 + bounce, this.width + 20, this.height + 20);
            
            // Body
            ctx.fillStyle = '#ff3366';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2, this.y + bounce);
            ctx.lineTo(this.x + this.width, this.y + this.height/2 + bounce);
            ctx.lineTo(this.x + this.width/2, this.y + this.height + bounce);
            ctx.lineTo(this.x, this.y + this.height/2 + bounce);
            ctx.closePath();
            ctx.fill();
            
            // Spikes
            ctx.fillStyle = '#ff0000';
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2) + this.animationFrame * 0.5;
                const spikeX = this.x + this.width/2 + Math.cos(angle) * 25;
                const spikeY = this.y + this.height/2 + bounce + Math.sin(angle) * 25;
                ctx.beginPath();
                ctx.arc(spikeX, spikeY, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Eyes
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x + 10, this.y + 12 + bounce, 4, 0, Math.PI * 2);
            ctx.arc(this.x + 25, this.y + 12 + bounce, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(this.x + 10, this.y + 12 + bounce, 2, 0, Math.PI * 2);
            ctx.arc(this.x + 25, this.y + 12 + bounce, 2, 0, Math.PI * 2);
            ctx.fill();
            
        } else {
            // Vanish gradient - dark fading
            const gradient = ctx.createRadialGradient(
                this.x + this.width/2, this.y + this.height/2 + bounce, 0,
                this.x + this.width/2, this.y + this.height/2 + bounce, 30
            );
            gradient.addColorStop(0, 'rgba(100, 100, 100, 0.8)');
            gradient.addColorStop(1, 'rgba(100, 100, 100, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x - 10, this.y - 10 + bounce, this.width + 20, this.height + 20);
            
            // Body - fading effect
            const fadeAlpha = 0.5 + Math.sin(this.animationFrame * 2) * 0.3;
            ctx.fillStyle = `rgba(100, 100, 100, ${fadeAlpha})`;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2 + bounce, this.width/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Border
            ctx.strokeStyle = `rgba(150, 150, 150, ${fadeAlpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Ghostly eyes
            ctx.fillStyle = `rgba(200, 200, 200, ${fadeAlpha})`;
            ctx.beginPath();
            ctx.arc(this.x + 10, this.y + 15 + bounce, 3, 0, Math.PI * 2);
            ctx.arc(this.x + 25, this.y + 15 + bounce, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, colors) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.life = 1;
        this.decay = 0.02 + Math.random() * 0.02;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = 3 + Math.random() * 5;
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // gravity
        this.life -= this.decay;
        this.size *= 0.98;
    }
    
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
