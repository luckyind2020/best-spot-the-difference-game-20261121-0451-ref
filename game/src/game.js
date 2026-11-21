// Milo's Garden — game engine: states, timer, scoring, input and the
// two-panel renderer. The left picture is the scene as painted; the right
// picture is the same scene with its differences applied. A click on either
// panel near an unfound difference rings it on both panels.
import { SCENES } from './scenes.js';
import { mulberry32 } from './rng.js';
import { SoundKit } from './audio.js';

const PANEL = 600;
const GAP = 20;
const MARGIN = 10;
const ROUND_SECONDS = 90;
const DIFFS_PER_ROUND = 7;

export class SpotGame {
  constructor(canvas, hud) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hud = hud;
    this.sound = new SoundKit();
    this.state = 'title';
    this.round = 0;
    this.score = 0;
    this.found = new Set();
    this.hintsLeft = 3;
    this.timeLeft = ROUND_SECONDS;
    this.lastTick = 0;
    this.hintPulse = null;
    this.wrongFlash = null;
    this.seed = 1;
    this.shot = null;
    this.roundBonus = 0;
    this.bindInput();
  }

  scene() {
    return SCENES[this.round];
  }

  startRound(i) {
    this.round = i;
    this.found = new Set();
    this.hintsLeft = 3;
    this.timeLeft = ROUND_SECONDS;
    this.hintPulse = null;
    this.wrongFlash = null;
    this.state = 'intro';
    this.introUntil = performance.now() + 1700;
    this.refreshHud();
    this.showOverlay(
      `Round ${i + 1} — ${this.scene().name}`,
      this.scene().blurb,
      '',
      false,
    );
  }

  beginPlay() {
    this.state = 'play';
    this.hideOverlay();
    this.lastTick = performance.now();
  }

  // -- input ---------------------------------------------------------------
  bindInput() {
    this.canvas.addEventListener('click', (ev) => this.onCanvasClick(ev));
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') this.onPrimary();
      else if (ev.key === 'h' || ev.key === 'H') this.useHint();
      else if (ev.key === 'm' || ev.key === 'M') this.toggleSound();
      else if (ev.key === 'r' || ev.key === 'R') this.restartRound();
      else if (ev.key === 'p' || ev.key === 'P' || ev.key === 'Escape') this.togglePause();
    });
    this.hud.hintBtn.addEventListener('click', () => this.useHint());
    this.hud.soundBtn.addEventListener('click', () => this.toggleSound());
    this.hud.restartBtn.addEventListener('click', () => this.restartRound());
    this.hud.actionBtn.addEventListener('click', () => this.onPrimary());
  }

  onPrimary() {
    this.sound.unlock();
    if (this.state === 'title') this.startRound(0);
    else if (this.state === 'roundclear') this.startRound(this.round + 1);
    else if (this.state === 'victory' || this.state === 'gameover') this.resetAll();
  }

  resetAll() {
    this.score = 0;
    this.startRound(0);
  }

  restartRound() {
    if (this.state === 'play' || this.state === 'paused') this.startRound(this.round);
  }

  toggleSound() {
    const muted = this.sound.toggleMute();
    this.hud.soundBtn.textContent = muted ? '🔇 Sound off' : '🔊 Sound on';
  }

  togglePause() {
    if (this.state === 'play') {
      this.state = 'paused';
      this.showOverlay('Paused', 'Take a breath. The garden will wait.', 'Resume', true);
    } else if (this.state === 'paused') {
      this.state = 'play';
      this.hideOverlay();
      this.lastTick = performance.now();
    }
  }

  useHint() {
    if (this.state !== 'play' || this.hintsLeft <= 0) return;
    const remaining = this.scene().diffs.filter((_, i) => !this.found.has(i));
    if (!remaining.length) return;
    this.hintsLeft -= 1;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintPulse = { diff: pick, until: performance.now() + 2600 };
    this.sound.hint();
    this.refreshHud();
  }

  onCanvasClick(ev) {
    this.sound.unlock();
    if (this.state !== 'play') return;
    const box = this.canvas.getBoundingClientRect();
    const sx = (this.canvas.width / box.width) * (ev.clientX - box.left);
    const sy = (this.canvas.height / box.height) * (ev.clientY - box.top);
    const local = this.toPanel(sx, sy);
    if (!local) return;
    const hit = this.scene().diffs.findIndex((d, i) => {
      if (this.found.has(i)) return false;
      const dx = local.x - d.x;
      const dy = local.y - d.y;
      return dx * dx + dy * dy <= (d.r + 12) * (d.r + 12);
    });
    if (hit >= 0) {
      this.found.add(hit);
      this.score += 100;
      this.sound.found();
      this.refreshHud();
      if (this.found.size === DIFFS_PER_ROUND) this.clearRound();
    } else {
      this.score = Math.max(0, this.score - 20);
      this.wrongFlash = { x: sx, y: sy, until: performance.now() + 500 };
      this.sound.wrong();
      this.refreshHud();
    }
  }

  toPanel(sx, sy) {
    if (sy < 0 || sy > PANEL) return null;
    if (sx >= MARGIN && sx < MARGIN + PANEL) return { x: sx - MARGIN, y: sy };
    if (sx >= MARGIN + PANEL + GAP && sx < MARGIN + PANEL + GAP + PANEL) {
      return { x: sx - (MARGIN + PANEL + GAP), y: sy };
    }
    return null;
  }

  clearRound() {
    this.roundBonus = Math.ceil(this.timeLeft) * 5;
    this.score += this.roundBonus;
    this.sound.clear();
    if (this.round + 1 >= SCENES.length) {
      this.state = 'victory';
      this.sound.victory();
      this.showOverlay(
        'You found them all!',
        `Every difference in all ${SCENES.length} rounds — Milo is impressed.`,
        'Play again',
        true,
      );
    } else {
      this.state = 'roundclear';
      this.showOverlay(
        `Round ${this.round + 1} clear!`,
        `All ${DIFFS_PER_ROUND} differences found · time bonus +${this.roundBonus}`,
        'Next round',
        true,
      );
    }
    this.refreshHud();
  }

  gameOver() {
    this.state = 'gameover';
    this.showOverlay(
      "Time's up!",
      `You found ${this.found.size} of ${DIFFS_PER_ROUND} differences in ${this.scene().name}.`,
      'Try again',
      true,
    );
  }

  // -- HUD + overlays ------------------------------------------------------
  refreshHud() {
    this.hud.roundLabel.textContent = `Round ${this.round + 1} / ${SCENES.length} · ${this.scene().name}`;
    this.hud.scoreText.textContent = `Score ${this.score}`;
    this.hud.foundText.textContent = `Found ${this.found.size} / ${DIFFS_PER_ROUND}`;
    this.hud.hintBtn.textContent = `💡 Hint (${this.hintsLeft})`;
    this.hud.hintBtn.disabled = this.state !== 'play' || this.hintsLeft <= 0;
    const t = Math.max(0, Math.ceil(this.timeLeft));
    this.hud.timerText.textContent = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
    this.hud.timerBar.style.width = `${(this.timeLeft / ROUND_SECONDS) * 100}%`;
    this.hud.timerBar.classList.toggle('low', this.timeLeft <= 10);
  }

  showOverlay(title, body, action, showButton) {
    this.hud.overlayTitle.textContent = title;
    this.hud.overlayBody.textContent = body;
    this.hud.actionBtn.textContent = action;
    this.hud.actionBtn.style.display = showButton ? '' : 'none';
    this.hud.overlay.classList.remove('hidden');
  }

  hideOverlay() {
    this.hud.overlay.classList.add('hidden');
  }

  // -- shot mode (deterministic states for screenshots) --------------------
  applyShot(shot, seed) {
    this.seed = seed;
    this.shot = shot;
    if (shot === 'start') {
      this.state = 'title';
      this.round = 0;
      this.score = 0;
      this.found = new Set();
      this.timeLeft = ROUND_SECONDS;
      this.showOverlay(
        "Milo's Garden",
        'Spot the Difference · 3 rounds · 7 differences each · 90 seconds a round. Click a difference on either picture to ring it.',
        '▶ Start playing',
        true,
      );
    } else if (shot === 'play') {
      this.state = 'play';
      this.round = 0;
      this.found = new Set([0, 1, 2]);
      this.score = 300;
      this.timeLeft = 47;
      this.hintsLeft = 2;
      this.hideOverlay();
    } else if (shot === 'end') {
      this.state = 'roundclear';
      this.round = 0;
      this.found = new Set([0, 1, 2, 3, 4, 5, 6]);
      this.score = 815;
      this.roundBonus = 115;
      this.timeLeft = 23;
      this.showOverlay(
        'Round 1 clear!',
        `All 7 differences found · time bonus +115`,
        'Next round',
        true,
      );
    }
    this.refreshHud();
  }

  // -- render ---------------------------------------------------------------
  drawPanelFrame(x, label) {
    this.ctx.strokeStyle = '#5b3a1a';
    this.ctx.lineWidth = 6;
    this.ctx.strokeRect(x, 0, PANEL, PANEL);
    this.ctx.fillStyle = '#5b3a1a';
    this.ctx.beginPath();
    this.ctx.arc(x + 26, 26, 20, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 24px system-ui, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(label, x + 26, 27);
  }

  drawMarkers(originX) {
    const now = performance.now();
    this.scene().diffs.forEach((d, i) => {
      if (!this.found.has(i)) return;
      this.ctx.strokeStyle = '#2ecc40';
      this.ctx.lineWidth = 5;
      this.ctx.beginPath();
      this.ctx.arc(originX + d.x, d.y, d.r, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.strokeStyle = '#2ecc40';
      this.ctx.lineWidth = 5;
      this.ctx.beginPath();
      this.ctx.moveTo(originX + d.x - 10, d.y);
      this.ctx.lineTo(originX + d.x - 3, d.y + 8);
      this.ctx.lineTo(originX + d.x + 12, d.y - 9);
      this.ctx.stroke();
    });
    if (this.hintPulse && now < this.hintPulse.until) {
      const pulse = 1 + 0.12 * Math.sin(now / 130);
      this.ctx.strokeStyle = '#ffd93b';
      this.ctx.lineWidth = 6;
      this.ctx.beginPath();
      this.ctx.arc(originX + this.hintPulse.diff.x, this.hintPulse.diff.y, this.hintPulse.diff.r * pulse, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  render() {
    const g = this.ctx;
    g.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const scene = this.scene();
    const leftX = MARGIN;
    const rightX = MARGIN + PANEL + GAP;
    scene.paint(g, leftX, 0, mulberry32(this.seed * 1000 + this.round), false);
    scene.paint(g, rightX, 0, mulberry32(this.seed * 1000 + this.round), true);
    this.drawPanelFrame(leftX, 'A');
    this.drawPanelFrame(rightX, 'B');
    this.drawMarkers(leftX);
    this.drawMarkers(rightX);
    if (this.wrongFlash && performance.now() < this.wrongFlash.until) {
      g.strokeStyle = '#e23b3b';
      g.lineWidth = 5;
      const { x, y } = this.wrongFlash;
      g.beginPath();
      g.moveTo(x - 12, y - 12);
      g.lineTo(x + 12, y + 12);
      g.moveTo(x + 12, y - 12);
      g.lineTo(x - 12, y + 12);
      g.stroke();
    }
  }

  tick(now) {
    if (this.state === 'intro' && now >= this.introUntil) this.beginPlay();
    if (this.state === 'play' && !this.shot) {
      const dt = (now - this.lastTick) / 1000;
      this.lastTick = now;
      const before = Math.ceil(this.timeLeft);
      this.timeLeft = Math.max(0, this.timeLeft - dt);
      if (Math.ceil(this.timeLeft) !== before) {
        if (this.timeLeft <= 10 && this.timeLeft > 0) this.sound.tick();
        this.refreshHud();
      }
      if (this.timeLeft <= 0) this.gameOver();
    }
    if (this.hintPulse && now >= this.hintPulse.until) this.hintPulse = null;
    if (this.wrongFlash && now >= this.wrongFlash.until) this.wrongFlash = null;
    this.render();
  }

  run() {
    const loop = (now) => {
      this.tick(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
