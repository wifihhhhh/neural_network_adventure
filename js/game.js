class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.state = 'start'; // start, playing, paused, gameover, levelcomplete
        this.level = 1;
        this.score = 0;
        this.energy = 100;
        this.maxEnergy = 100;
        
        this.player = null;
        this.platforms = [];
        this.collectibles = [];
        this.enemies = [];
        this.particles = [];
        this.exit = null;
        
        this.camera = { x: 0, y: 0 };
        this.keys = {};
        
        this.lastTime = 0;
        this.deltaTime = 0;
        
        this.levelStartTime = 0;
        this.levelStats = {
            energyCollected: 0,
            neuronsActivated: 0
        };
        
        this.activationFunction = 'relu';
        this.autoAdvanceTimer = null;
        
        this.setupEventListeners();
        this.resize();
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'KeyP') this.togglePause();
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        window.addEventListener('resize', () => this.resize());
        
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resumeBtn').addEventListener('click', () => this.resume());
        document.getElementById('restartFromPause').addEventListener('click', () => this.restart());
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelp());
        document.getElementById('closeHelp').addEventListener('click', () => this.hideHelp());
        document.getElementById('clearLog').addEventListener('click', () => this.clearLog());
        
        document.getElementById('activationSelect').addEventListener('change', (e) => {
            this.activationFunction = e.target.value;
            this.log(`激活函数切换为: ${e.target.value.toUpperCase()}`);
        });
    }
    
    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }
    
    clearAutoAdvance() {
        if (this.autoAdvanceTimer !== null) {
            clearTimeout(this.autoAdvanceTimer);
            this.autoAdvanceTimer = null;
        }
    }
    
    start() {
        this.state = 'playing';
        this.score = 0;
        this.level = 1;
        this.energy = 100;
        
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
        document.getElementById('levelCompleteScreen').classList.add('hidden');
        this.clearAutoAdvance();
        
        this.initLevel();
        this.lastTime = performance.now();
        this.gameLoop();
        
        this.log('游戏开始！欢迎来到神经网络大冒险！');
        this.updateKnowledgeCard('start');
    }
    
    restart() {
        this.state = 'playing';
        this.score = 0;
        this.level = 1;
        this.energy = 100;
        
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
        document.getElementById('levelCompleteScreen').classList.add('hidden');
        
        this.clearAutoAdvance();
        this.initLevel();
        this.lastTime = performance.now();
        this.gameLoop();
        this.log('游戏重新开始！');
    }
    
    nextLevel() {
        this.clearAutoAdvance();
        this.level++;
        if (this.level > 5) {
            this.gameWin();
            return;
        }

        this.state = 'playing';
        this.energy = Math.min(this.energy + 20, this.maxEnergy);

        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
        document.getElementById('levelCompleteScreen').classList.add('hidden');

        this.initLevel();
        this.lastTime = performance.now();
        this.gameLoop();
        this.log(`进入第 ${this.level} 层！`);
    }
    
    initLevel() {
        this.player = new Player(100, 300);
        this.platforms = this.generatePlatforms();
        this.collectibles = this.generateCollectibles();
        this.enemies = this.generateEnemies();
        this.particles = [];
        this.exit = { x: 3450, y: 220, width: 60, height: 60 };
        
        this.camera = { x: 0, y: 0 };
        this.levelStartTime = Date.now();
        this.levelStats = { energyCollected: 0, neuronsActivated: 0 };
        
        this.updateUI();
        this.updateNetworkVisualization();
    }
    
    generatePlatforms() {
        const platforms = [];
        
        // Ground
        platforms.push(new Platform(0, 500, 1000, 100));
        
        // Generate platforms based on level
        const levelConfigs = [
            { count: 12, minY: 250, maxY: 450 },
            { count: 15, minY: 200, maxY: 450 },
            { count: 18, minY: 180, maxY: 450 },
            { count: 22, minY: 150, maxY: 400 },
            { count: 25, minY: 120, maxY: 400 }
        ];
        
        const config = levelConfigs[this.level - 1] || levelConfigs[0];
        
        for (let i = 0; i < config.count; i++) {
            const x = 1200 + i * 200 + Math.random() * 100;
            const y = config.minY + Math.random() * (config.maxY - config.minY);
            const width = 80 + Math.random() * 120;
            platforms.push(new Platform(x, y, width, 20));
        }
        
        // Exit platform - wider to ensure player can reach exit
        platforms.push(new Platform(3350, 280, 300, 20));
        
        return platforms;
    }
    
    generateCollectibles() {
        const collectibles = [];
        
        // Energy orbs
        for (let i = 0; i < 10 + this.level * 3; i++) {
            const x = 500 + i * 300 + Math.random() * 150;
            const y = 150 + Math.random() * 250;
            collectibles.push(new Collectible(x, y, 'energy'));
        }
        
        // Neurons
        for (let i = 0; i < 5 + this.level; i++) {
            const x = 800 + i * 500 + Math.random() * 200;
            const y = 200 + Math.random() * 200;
            collectibles.push(new Collectible(x, y, 'neuron'));
        }
        
        return collectibles;
    }
    
    generateEnemies() {
        const enemies = [];
        
        const enemyCount = 2 + this.level;
        
        for (let i = 0; i < enemyCount; i++) {
            const x = 1500 + i * 400 + Math.random() * 200;
            const y = 300 + Math.random() * 100;
            const type = Math.random() < 0.7 ? 'overfit' : 'vanish';
            enemies.push(new Enemy(x, y, type));
        }
        
        return enemies;
    }
    
    togglePause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            document.getElementById('pauseScreen').classList.remove('hidden');
            this.log('游戏已暂停');
        } else if (this.state === 'paused') {
            this.state = 'playing';
            document.getElementById('pauseScreen').classList.add('hidden');
            this.lastTime = performance.now();
            this.gameLoop();
            this.log('游戏继续');
        }
    }

    resume() {
        if (this.state === 'paused') {
            this.state = 'playing';
            document.getElementById('pauseScreen').classList.add('hidden');
            this.lastTime = performance.now();
            this.gameLoop();
        }
    }

    showHelp() {
        document.getElementById('helpModal').classList.remove('hidden');
    }
    
    hideHelp() {
        document.getElementById('helpModal').classList.add('hidden');
    }
    
    gameLoop() {
        if (this.state !== 'playing') return;
        
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update player
        this.player.update(this.deltaTime, this.keys, this.platforms);

        // Update invulnerability
        if (this.player.invulnerable) {
            this.player.invulnerableTime -= this.deltaTime;
            if (this.player.invulnerableTime <= 0) {
                this.player.invulnerable = false;
            }
        }
        
        // Update camera
        this.camera.x = this.player.x - this.canvas.width / 2;
        this.camera.y = this.player.y - this.canvas.height / 2;
        
        // Clamp camera
        this.camera.x = Math.max(0, Math.min(this.camera.x, 4000 - this.canvas.width));
        this.camera.y = Math.max(-200, Math.min(this.camera.y, 600 - this.canvas.height));
        
        // Update enemies
        this.enemies.forEach(enemy => enemy.update(this.deltaTime, this.player));
        
        // Update particles
        this.particles = this.particles.filter(p => {
            p.update(this.deltaTime);
            return p.life > 0;
        });
        
        // Check collisions
        this.checkCollisions();
        
        // Update energy
        this.energy -= this.deltaTime * 1.5;
        if (this.energy <= 0) {
            this.gameOver();
        }
        
        // Update UI
        this.updateUI();
    }
    
    checkCollisions() {
        // Collectibles
        this.collectibles = this.collectibles.filter(c => {
            if (this.checkCollision(this.player, c)) {
                this.collect(c);
                return false;
            }
            return true;
        });
        
        // Enemies
        this.enemies.forEach(enemy => {
            if (this.checkCollision(this.player, enemy)) {
                if (!this.player.invulnerable) {
                    this.hitEnemy(enemy);
                }
            }
        });
        
        // Exit - only trigger once
        if (this.checkCollision(this.player, this.exit) && this.state === 'playing') {
            this.levelComplete();
        }
        
        // Fall off world
        if (this.player.y > 700) {
            this.energy -= 20;
            this.player.x = 100;
            this.player.y = 300;
            this.player.velocityX = 0;
            this.player.velocityY = 0;
            this.log('掉入局部最优陷阱！能量 -20');
            this.createParticles(this.player.x, this.player.y, 'damage');
        }
    }
    
    checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }
    
    collect(collectible) {
        if (collectible.type === 'energy') {
            this.energy = Math.min(this.energy + 15, this.maxEnergy);
            this.score += 10;
            this.levelStats.energyCollected++;
            this.log('收集能量球！能量 +15');
            this.createParticles(collectible.x, collectible.y, 'energy');
        } else if (collectible.type === 'neuron') {
            this.score += 50;
            this.levelStats.neuronsActivated++;
            this.log('激活神经元！得分 +50');
            this.createParticles(collectible.x, collectible.y, 'neuron');
            this.updateNetworkVisualization();
        }
    }
    
    hitEnemy(enemy) {
        if (enemy.type === 'overfit') {
            this.energy -= 10;
            this.log('遭遇过拟合怪！能量 -10');
        } else {
            this.energy -= 8;
            this.player.jumpPower = 10;
            setTimeout(() => this.player.jumpPower = 16, 3000);
            this.log('遭遇梯度消失！跳跃能力下降');
        }

        this.createParticles(this.player.x, this.player.y, 'damage');

        // Knockback - stronger to push player away from enemy
        const knockbackX = enemy.x > this.player.x ? -15 : 15;
        this.player.velocityX = knockbackX;
        this.player.velocityY = -8;

        // Push player out of collision
        if (enemy.x > this.player.x) {
            this.player.x = enemy.x - this.player.width - 5;
        } else {
            this.player.x = enemy.x + enemy.width + 5;
        }

        // Set invulnerability
        this.player.invulnerable = true;
        this.player.invulnerableTime = 1.5; // 1.5 seconds
    }
    
    createParticles(x, y, type) {
        const count = type === 'damage' ? 10 : 15;
        const colors = {
            energy: ['#00ff88', '#00f5ff', '#ffffff'],
            neuron: ['#ffea00', '#ff00e4', '#ffffff'],
            damage: ['#ff3366', '#ff0000', '#ffffff']
        };
        
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, colors[type]));
        }
    }
    
    levelComplete() {
        this.state = 'levelcomplete';

        const timeElapsed = Math.floor((Date.now() - this.levelStartTime) / 1000);

        document.getElementById('levelEnergy').textContent = this.levelStats.energyCollected;
        document.getElementById('levelNeurons').textContent = this.levelStats.neuronsActivated;
        document.getElementById('levelTime').textContent = timeElapsed + 's';
        document.getElementById('levelCompleteScreen').classList.remove('hidden');

        this.log(`第 ${this.level} 层完成！点击"下一层"继续。`);
        this.updateKnowledgeCard('level' + this.level);
    }
    
    gameOver() {
        this.clearAutoAdvance();
        this.state = 'gameover';
        
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
        document.getElementById('levelCompleteScreen').classList.add('hidden');
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverTitle').textContent = '游戏结束';
        document.getElementById('gameOverScreen').classList.remove('hidden');
        
        this.log('游戏结束！最终得分: ' + this.score);
    }
    
    gameWin() {
        this.clearAutoAdvance();
        this.state = 'gameover';
        
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
        document.getElementById('levelCompleteScreen').classList.add('hidden');
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverTitle').textContent = '🎉 恭喜通关！';
        document.getElementById('gameOverScreen').classList.remove('hidden');
        
        this.log('恭喜通关！你已完成神经网络的前向传播！');
    }
    
    updateUI() {
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('levelValue').textContent = `${this.level}/5`;
        
        const energyBar = document.getElementById('energyBar');
        energyBar.style.width = `${(this.energy / this.maxEnergy) * 100}%`;
        
        if (this.energy < 30) {
            energyBar.style.background = 'linear-gradient(90deg, #ff3366, #ffaa00)';
        } else {
            energyBar.style.background = 'linear-gradient(90deg, #00ff88, #00f5ff)';
        }
    }
    
    updateNetworkVisualization() {
        const layers = document.querySelectorAll('.net-layer');
        const neurons = this.levelStats.neuronsActivated;
        
        layers.forEach((layer, index) => {
            const layerNeurons = layer.querySelectorAll('.node');
            layerNeurons.forEach((neuron, nIndex) => {
                neuron.classList.remove('active');
                if (index === 0 || (index === 1 && nIndex < Math.min(neurons, 4))) {
                    neuron.classList.add('active');
                }
            });
        });
    }

    updateKnowledgeCard(type) {
        const cards = {
            start: {
                icon: '🧠',
                title: '神经网络基础',
                content: '神经网络由输入层、隐藏层和输出层组成。数据从输入层进入，经过各层处理，最终在输出层产生结果。'
            },
            level1: {
                icon: '⚡',
                title: '前向传播',
                content: '前向传播是数据从输入层流向输出层的过程。每一层的神经元接收上一层的输出，经过加权求和和激活函数处理后传递给下一层。'
            },
            level2: {
                icon: '🔧',
                title: '激活函数',
                content: '激活函数决定神经元是否被激活。ReLU函数在输入大于0时输出输入值，否则输出0。它帮助网络学习非线性关系。'
            },
            level3: {
                icon: '📉',
                title: '梯度下降',
                content: '梯度下降是优化神经网络参数的方法。通过计算损失函数对参数的梯度，沿着梯度反方向更新参数，使损失逐渐减小。'
            },
            level4: {
                icon: '⚠️',
                title: '过拟合',
                content: '过拟合是指模型在训练数据上表现太好，但在新数据上表现差。可以通过正则化、Dropout等方法防止过拟合。'
            },
            level5: {
                icon: '🎯',
                title: '输出层',
                content: '输出层产生最终的预测结果。对于分类任务，通常使用Softmax函数输出各类别的概率分布。'
            }
        };
        
        const card = cards[type];
        if (card) {
            const cardEl = document.getElementById('knowledgeCard');
            cardEl.innerHTML = `
                <div class="card-icon">${card.icon}</div>
                <h4>${card.title}</h4>
                <p>${card.content}</p>
            `;
            cardEl.classList.add('fade-in');
            setTimeout(() => cardEl.classList.remove('fade-in'), 500);
        }
    }
    
    log(message) {
        const logContent = document.getElementById('gameLog');
        const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span class="message">${message}</span>
        `;
        logContent.appendChild(entry);
        logContent.scrollTop = logContent.scrollHeight;
    }
    
    clearLog() {
        document.getElementById('gameLog').innerHTML = '';
    }
    
    render() {
        // Clear canvas with tech blue gradient background
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Base gradient
        const baseGradient = this.ctx.createLinearGradient(0, 0, width, height);
        baseGradient.addColorStop(0, '#0a1628');
        baseGradient.addColorStop(0.5, '#1a2a4a');
        baseGradient.addColorStop(1, '#0d1a2d');
        this.ctx.fillStyle = baseGradient;
        this.ctx.fillRect(0, 0, width, height);
        
        // Cyan glow - top left
        const cyanGlow = this.ctx.createRadialGradient(width * 0.15, height * 0.25, 0, width * 0.15, height * 0.25, width * 0.4);
        cyanGlow.addColorStop(0, 'rgba(0, 212, 255, 0.15)');
        cyanGlow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = cyanGlow;
        this.ctx.fillRect(0, 0, width, height);
        
        // Blue glow - top right
        const blueGlow = this.ctx.createRadialGradient(width * 0.85, height * 0.2, 0, width * 0.85, height * 0.2, width * 0.35);
        blueGlow.addColorStop(0, 'rgba(59, 130, 246, 0.12)');
        blueGlow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = blueGlow;
        this.ctx.fillRect(0, 0, width, height);
        
        // Purple glow - bottom right
        const purpleGlow = this.ctx.createRadialGradient(width * 0.8, height * 0.8, 0, width * 0.8, height * 0.8, width * 0.3);
        purpleGlow.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
        purpleGlow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = purpleGlow;
        this.ctx.fillRect(0, 0, width, height);
        
        // Teal glow - bottom left
        const tealGlow = this.ctx.createRadialGradient(width * 0.2, height * 0.85, 0, width * 0.2, height * 0.85, width * 0.28);
        tealGlow.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
        tealGlow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = tealGlow;
        this.ctx.fillRect(0, 0, width, height);
        
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Draw grid
        this.drawGrid();
        
        // Draw platforms
        this.platforms.forEach(p => p.render(this.ctx));
        
        // Draw exit
        this.drawExit();
        
        // Draw collectibles
        this.collectibles.forEach(c => c.render(this.ctx));
        
        // Draw enemies
        this.enemies.forEach(e => e.render(this.ctx));
        
        // Draw player with invulnerability flicker
        if (!this.player.invulnerable || Math.floor(Date.now() / 100) % 2 === 0) {
            this.player.render(this.ctx);
        }
        
        // Draw particles
        this.particles.forEach(p => p.render(this.ctx));
        
        this.ctx.restore();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 245, 255, 0.05)';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        const startX = Math.floor(this.camera.x / gridSize) * gridSize;
        const startY = Math.floor(this.camera.y / gridSize) * gridSize;
        
        for (let x = startX; x < this.camera.x + this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.camera.y);
            this.ctx.lineTo(x, this.camera.y + this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = startY; y < this.camera.y + this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.camera.x, y);
            this.ctx.lineTo(this.camera.x + this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawExit() {
        const { x, y, width, height } = this.exit;
        
        // Glow effect
        const gradient = this.ctx.createRadialGradient(
            x + width/2, y + height/2, 0,
            x + width/2, y + height/2, 100
        );
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x - 50, y - 50, width + 100, height + 100);
        
        // Portal
        this.ctx.fillStyle = '#00ff88';
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, width, height);
        
        // Label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Rajdhani';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('EXIT', x + width/2, y - 10);
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    window.game = new Game();
});
