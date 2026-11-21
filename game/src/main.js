// Boot for Milo's Garden. Wires the canvas and HUD controls to the engine,
// then either drops into a deterministic screenshot state (?shot=...) or
// shows the title screen for a human player.
import { SpotGame } from './game.js';

const canvas = document.getElementById('stage');
const hud = {
  roundLabel: document.getElementById('roundLabel'),
  timerBar: document.getElementById('timerBar'),
  timerText: document.getElementById('timerText'),
  scoreText: document.getElementById('scoreText'),
  foundText: document.getElementById('foundText'),
  hintBtn: document.getElementById('hintBtn'),
  soundBtn: document.getElementById('soundBtn'),
  restartBtn: document.getElementById('restartBtn'),
  overlay: document.getElementById('overlay'),
  overlayTitle: document.getElementById('overlayTitle'),
  overlayBody: document.getElementById('overlayBody'),
  actionBtn: document.getElementById('actionBtn'),
};

const game = new SpotGame(canvas, hud);
window.__game = game;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seed = Number(params.get('seed') || '1') || 1;

if (shot === 'start' || shot === 'play' || shot === 'end') {
  game.applyShot(shot, seed);
} else {
  game.showOverlay(
    "Milo's Garden",
    'Spot the Difference · 3 rounds · 7 differences each · 90 seconds a round. Click a difference on either picture to ring it.',
    '▶ Start playing',
    true,
  );
  game.refreshHud();
}

game.run();
