# 🧠 神经网络大冒险 (Neural Network Adventure)

一个基于HTML5 Canvas的2D平台跳跃游戏，将神经网络概念融入游戏玩法中。

## 🎮 游戏特色

- **神经网络主题**：收集能量球、激活神经元，学习AI知识
- **流畅的动画**：60fps游戏循环，流畅的角色移动和跳跃
- **双段跳**：支持二段跳，增加游戏策略性
- **敌人系统**：
  - 过拟合怪 (Overfit Monster) - 会追赶玩家
  - 梯度消失 (Vanishing Gradient) - 降低玩家跳跃能力
- **5个关卡**：难度递增，平台布局变化
- **科技感UI**：现代化渐变背景、毛玻璃效果

## 🎯 游戏玩法

### 控制方式
- **← → / A D**：左右移动
- **SPACE / ↑ / W**：跳跃（可二段跳）
- **P**：暂停游戏

### 游戏目标
1. 控制角色穿越平台
2. 收集能量球 (+10分)
3. 激活神经元 (+50分)
4. 避开敌人
5. 到达绿色出口进入下一关

### 游戏机制
- **能量系统**：能量会随时间消耗，碰到敌人或掉下平台会损失能量
- **无敌时间**：撞到敌人后有1.5秒无敌时间，角色会闪烁
- **击退效果**：撞到敌人会被弹开

## 🛠️ 技术栈

- **HTML5 Canvas**：游戏渲染
- **原生JavaScript**：游戏逻辑
- **CSS3**：现代化UI样式
- **Git**：版本控制

## 📁 项目结构

```
homework3/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── game.js         # 游戏主逻辑
│   ├── entities.js     # 游戏实体（玩家、敌人等）
│   └── renderer.js     # 渲染器
└── README.md           # 项目说明
```

## 🚀 运行方式

1. 克隆仓库
```bash
git clone https://github.com/yourusername/neural_network_adventure.git
```

2. 进入项目目录
```bash
cd neural_network_adventure
```

3. 用浏览器打开 `index.html` 文件

或者直接使用本地服务器：
```bash
python -m http.server 8000
```
然后在浏览器访问 `http://localhost:8000`

## � 开发日志

### 已实现功能
- [x] 基础平台跳跃物理系统
- [x] 双段跳机制
- [x] 敌人AI（巡逻、追击）
- [x] 碰撞检测系统
- [x] 粒子效果
- [x] 5个关卡设计
- [x] 现代化UI界面
- [x] 暂停/继续功能
- [x] 游戏状态管理

### 待优化
- [ ] 添加音效
- [ ] 更多敌人类型
- [ ] 关卡编辑器
- [ ] 本地存储最高分

## 🎓 学习价值

本项目将人工智能概念游戏化：
- **神经网络结构**：通过游戏界面展示输入层、隐藏层、输出层
- **激活函数**：游戏中可切换不同激活函数
- **过拟合/梯度消失**：以敌人形式呈现这些概念

## � 许可证

MIT License

## 👨‍💻 作者

23089098王亦菲<br>
trae-Doubao-Seed-2.0-Code<br>
trae-Kimi-K2.5<br>
VS Code-Github Copilot Chat-Rapter mini (Preview)
