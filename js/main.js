// Main entry point - Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize gradient chart
    const gradientChart = new GradientChart(document.getElementById('gradientChart'));
    
    // Simulate gradient data
    setInterval(() => {
        if (window.game && window.game.state === 'playing') {
            const value = Math.random() * 0.5 + 0.1;
            gradientChart.addValue(value);
        }
    }, 200);

    // Add keyboard shortcut hints
    document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyH' && e.ctrlKey) {
            e.preventDefault();
            if (window.game) {
                window.game.showHelp();
            }
        }
    });

    // Log initialization
    console.log('%c🎮 神经网络大冒险', 'font-size: 24px; font-weight: bold; color: #00f5ff;');
    console.log('%cNeural Network Adventure', 'font-size: 14px; color: #ff00e4;');
    console.log('%c按 "开始冒险" 按钮开始游戏！', 'font-size: 12px; color: #888;');
});

// Prevent context menu on canvas
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'CANVAS') {
        e.preventDefault();
    }
});

// Handle visibility change (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.game && window.game.state === 'playing') {
        window.game.togglePause();
    }
});

// Prevent scrolling with arrow keys and space
document.addEventListener('keydown', (e) => {
    const keysToPrevent = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
    if (keysToPrevent.includes(e.code)) {
        e.preventDefault();
    }
});
