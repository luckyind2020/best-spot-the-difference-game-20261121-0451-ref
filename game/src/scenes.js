// Milo's Garden — three original scenes, drawn procedurally on canvas.
// Every scene paints a 600x600 picture at (ox, oy). The left panel is the
// base picture; the right panel is the same picture with every planted
// difference applied. Differences are data: a spot plus a small painter that
// changes exactly that spot, so the two pictures match everywhere else.

function el(g, x, y, rx, ry, color) {
  g.fillStyle = color;
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  g.fill();
}

function circ(g, x, y, r, color) {
  el(g, x, y, r, r, color);
}

function rect(g, x, y, w, h, color) {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
}

function rr(g, x, y, w, h, r, color) {
  g.fillStyle = color;
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}

function tri(g, x1, y1, x2, y2, x3, y3, color) {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  g.lineTo(x3, y3);
  g.closePath();
  g.fill();
}

function stroke(g, x1, y1, x2, y2, color, w) {
  g.strokeStyle = color;
  g.lineWidth = w;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  g.stroke();
}

function cloud(g, x, y, s) {
  el(g, x, y, 42 * s, 20 * s, '#ffffff');
  el(g, x - 26 * s, y + 6 * s, 26 * s, 15 * s, '#ffffff');
  el(g, x + 28 * s, y + 7 * s, 28 * s, 14 * s, '#ffffff');
}

function tulip(g, x, y, petal) {
  stroke(g, x, y, x, y - 34, '#2f7d32', 5);
  el(g, x - 12, y - 8, 12, 7, '#2f7d32');
  circ(g, x - 9, y - 40, 11, petal);
  circ(g, x + 9, y - 40, 11, petal);
  circ(g, x, y - 48, 12, petal);
}

// ---------------------------------------------------------------- garden
function paintGarden(g, ox, oy, rng, altered) {
  const sky = g.createLinearGradient(0, oy, 0, oy + 380);
  sky.addColorStop(0, '#a8d8f0');
  sky.addColorStop(1, '#eaf9ff');
  g.fillStyle = sky;
  g.fillRect(ox, oy, 600, 380);
  // sun with rays
  g.save();
  g.translate(ox + 95, oy + 85);
  for (let i = 0; i < 8; i++) {
    g.rotate(Math.PI / 4);
    stroke(g, 0, -56, 0, -70, '#ffcf3d', 5);
  }
  g.restore();
  circ(g, ox + 95, oy + 85, 42, '#ffd93b');
  cloud(g, ox + 300, oy + 70, 1);
  cloud(g, ox + 480, oy + 50, 0.8);
  // bird
  stroke(g, ox + 238, oy + 92, ox + 250, oy + 84, '#33475b', 4);
  stroke(g, ox + 250, oy + 84, ox + 262, oy + 92, '#33475b', 4);
  // hills
  el(g, ox + 150, oy + 470, 320, 130, '#7ec850');
  el(g, ox + 480, oy + 480, 300, 140, '#6ab84a');
  rect(g, ox, oy + 380, 600, 220, '#7ec850');
  // fence
  rect(g, ox + 10, oy + 398, 580, 10, '#a9713f');
  for (let x = 30; x <= 570; x += 55) rect(g, ox + x, oy + 378, 14, 46, '#b9834e');
  // tree
  rect(g, ox + 505, oy + 230, 26, 190, '#7a5230');
  circ(g, ox + 518, oy + 200, 70, '#3f9e4d');
  circ(g, ox + 470, oy + 235, 48, '#4caf50');
  circ(g, ox + 565, oy + 240, 46, '#57b25e');
  // mushroom near the tree
  rect(g, ox + 514, oy + 462, 12, 22, '#fff3e0');
  el(g, ox + 520, oy + 460, 22, 14, '#e23b3b');
  circ(g, ox + 512, oy + 456, 3, '#ffffff');
  circ(g, ox + 526, oy + 462, 3, '#ffffff');
  // flower bed
  const petals = ['#e23b3b', '#ff7eb6', '#ffd93b', '#9b59d0', '#ff8c42', '#ffffff'];
  const fx = [60, 140, 220, 300, 380, 460];
  fx.forEach((x, i) => tulip(g, ox + x, oy + 552, petals[i]));
  // grass blades (seeded, same on both panels)
  g.strokeStyle = '#5da53f';
  g.lineWidth = 3;
  for (let i = 0; i < 26; i++) {
    const x = ox + 20 + rng() * 560;
    const y = oy + 500 + rng() * 80;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + 4, y - 12);
    g.stroke();
  }
  // Milo the cat, sitting, tail up
  el(g, ox + 330, oy + 420, 46, 40, '#f5a142');
  circ(g, ox + 330, oy + 368, 32, '#f5a142');
  tri(g, ox + 306, oy + 348, ox + 314, oy + 322, ox + 326, oy + 348, '#f5a142');
  tri(g, ox + 334, oy + 348, ox + 346, oy + 322, ox + 354, oy + 348, '#f5a142');
  tri(g, ox + 311, oy + 344, ox + 315, oy + 330, ox + 321, oy + 344, '#ff9db1');
  tri(g, ox + 339, oy + 344, ox + 345, oy + 330, ox + 349, oy + 344, '#ff9db1');
  circ(g, ox + 319, oy + 366, 4, '#2b2b2b');
  circ(g, ox + 341, oy + 366, 4, '#2b2b2b');
  tri(g, ox + 326, oy + 376, ox + 334, oy + 376, ox + 330, oy + 382, '#e07840');
  g.strokeStyle = '#f5a142';
  g.lineWidth = 9;
  g.beginPath();
  g.moveTo(ox + 372, oy + 430);
  g.quadraticCurveTo(ox + 398, oy + 400, ox + 388, oy + 360);
  g.stroke();
  // butterfly
  el(g, ox + 408, oy + 134, 12, 16, '#ff8c42');
  el(g, ox + 432, oy + 134, 12, 16, '#ff8c42');
  el(g, ox + 420, oy + 140, 16, 6, '#ff8c42');
  circ(g, ox + 420, oy + 140, 4, '#5b3a1a');

  if (!altered) return;
  // 1. the sun turns orange
  circ(g, ox + 95, oy + 85, 42, '#ff9f1c');
  // 2. the third tulip turns blue
  circ(g, ox + 211, oy + 512, 11, '#3d7bfd');
  circ(g, ox + 229, oy + 512, 11, '#3d7bfd');
  circ(g, ox + 220, oy + 504, 12, '#3d7bfd');
  // 3. the butterfly is gone (erase with the sky tone at this height)
  el(g, ox + 420, oy + 138, 30, 24, '#c0e4f5');
  // 4. Milo's tail curls down along the ground instead of up
  stroke(g, ox + 372, oy + 430, ox + 392, oy + 428, '#7ec850', 12);
  g.strokeStyle = '#f5a142';
  g.lineWidth = 9;
  g.beginPath();
  g.moveTo(ox + 372, oy + 436);
  g.quadraticCurveTo(ox + 396, oy + 452, ox + 404, oy + 438);
  g.stroke();
  // 5. the mushroom is gone
  el(g, ox + 520, oy + 468, 28, 26, '#7ec850');
  // 6. the bird is gone (erase with the sky tone at this height)
  rect(g, ox + 232, oy + 78, 36, 20, '#b7e0f3');
  // 7. one fence picket is missing
  rect(g, ox + 430, oy + 378, 14, 46, '#7ec850');
}

const gardenDiffs = [
  { x: 95, y: 85, r: 40, name: 'sun colour' },
  { x: 220, y: 512, r: 30, name: 'tulip colour' },
  { x: 420, y: 138, r: 30, name: 'butterfly' },
  { x: 385, y: 415, r: 34, name: 'cat tail' },
  { x: 520, y: 470, r: 30, name: 'mushroom' },
  { x: 250, y: 88, r: 28, name: 'bird' },
  { x: 437, y: 401, r: 30, name: 'fence picket' },
];

// ---------------------------------------------------------------- beach
function paintBeach(g, ox, oy, rng, altered) {
  const sky = g.createLinearGradient(0, oy, 0, oy + 240);
  sky.addColorStop(0, '#ff9a5c');
  sky.addColorStop(1, '#ffd166');
  g.fillStyle = sky;
  g.fillRect(ox, oy, 600, 240);
  // sun low over the sea
  circ(g, ox + 300, oy + 130, 55, '#fff3b0');
  el(g, ox + 300, oy + 130, 78, 78, 'rgba(255,243,176,0.35)');
  cloud(g, ox + 110, oy + 60, 0.9);
  cloud(g, ox + 480, oy + 80, 0.7);
  // sea
  rect(g, ox, oy + 240, 600, 120, '#2e86ab');
  g.strokeStyle = 'rgba(255,255,255,0.55)';
  g.lineWidth = 4;
  for (let i = 0; i < 5; i++) {
    const y = oy + 262 + i * 20;
    g.beginPath();
    g.moveTo(ox + 20 + i * 30, y);
    g.quadraticCurveTo(ox + 150 + i * 40, y - 8, ox + 320 + i * 30, y);
    g.stroke();
  }
  // sand
  rect(g, ox, oy + 360, 600, 240, '#f2d492');
  el(g, ox + 300, oy + 600, 340, 60, '#e8c87e');
  // palm tree
  g.strokeStyle = '#7a5230';
  g.lineWidth = 16;
  g.beginPath();
  g.moveTo(ox + 80, oy + 560);
  g.quadraticCurveTo(ox + 95, oy + 360, ox + 130, oy + 190);
  g.stroke();
  g.strokeStyle = '#3f9e4d';
  g.lineWidth = 10;
  for (let a = 0; a < 5; a++) {
    const ang = (-0.4 - a * 0.45) * Math.PI;
    g.beginPath();
    g.moveTo(ox + 130, oy + 190);
    g.quadraticCurveTo(ox + 130 + Math.cos(ang) * 70, oy + 190 + Math.sin(ang) * 55, ox + 130 + Math.cos(ang) * 120, oy + 190 + Math.sin(ang) * 90);
    g.stroke();
  }
  circ(g, ox + 112, oy + 196, 12, '#6b4a2b');
  circ(g, ox + 134, oy + 188, 12, '#6b4a2b');
  circ(g, ox + 122, oy + 208, 12, '#6b4a2b');
  // beach ball
  circ(g, ox + 90, oy + 300, 34, '#ffffff');
  g.save();
  g.beginPath();
  g.arc(ox + 90, oy + 300, 34, 0, Math.PI * 2);
  g.clip();
  tri(g, ox + 90, oy + 300, ox + 56, oy + 300, ox + 90, oy + 266, '#e23b3b');
  tri(g, ox + 90, oy + 300, ox + 124, oy + 300, ox + 90, oy + 334, '#3d7bfd');
  g.restore();
  circ(g, ox + 90, oy + 300, 34, 'rgba(0,0,0,0)');
  g.strokeStyle = '#d8b25e';
  g.lineWidth = 3;
  g.beginPath();
  g.arc(ox + 90, oy + 300, 34, 0, Math.PI * 2);
  g.stroke();
  // umbrella
  stroke(g, ox + 480, oy + 210, ox + 480, oy + 380, '#8a6d3b', 7);
  g.save();
  g.beginPath();
  g.arc(ox + 480, oy + 210, 92, Math.PI, 0);
  g.closePath();
  g.clip();
  for (let i = 0; i < 6; i++) rect(g, ox + 388 + i * 31, oy + 118, 31, 92, i % 2 ? '#ffffff' : '#e23b3b');
  g.restore();
  // starfish
  g.fillStyle = '#ff8c42';
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? 9 : 24;
    const px = ox + 150 + Math.cos(ang) * r;
    const py = oy + 500 + Math.sin(ang) * r;
    if (i === 0) g.moveTo(px, py);
    else g.lineTo(px, py);
  }
  g.closePath();
  g.fill();
  // crab
  el(g, ox + 250, oy + 520, 34, 22, '#e23b3b');
  circ(g, ox + 238, oy + 500, 5, '#ffffff');
  circ(g, ox + 262, oy + 500, 5, '#ffffff');
  circ(g, ox + 238, oy + 500, 2.5, '#2b2b2b');
  circ(g, ox + 262, oy + 500, 2.5, '#2b2b2b');
  circ(g, ox + 216, oy + 506, 10, '#e23b3b');
  circ(g, ox + 284, oy + 506, 10, '#e23b3b');
  g.strokeStyle = '#e23b3b';
  g.lineWidth = 5;
  for (const dx of [-26, -12, 12, 26]) {
    g.beginPath();
    g.moveTo(ox + 250 + dx, oy + 536);
    g.lineTo(ox + 250 + dx + (dx < 0 ? -8 : 8), oy + 552);
    g.stroke();
  }
  // bucket and spade
  g.fillStyle = '#3d7bfd';
  g.beginPath();
  g.moveTo(ox + 400, oy + 478);
  g.lineTo(ox + 440, oy + 478);
  g.lineTo(ox + 434, oy + 528);
  g.lineTo(ox + 406, oy + 528);
  g.closePath();
  g.fill();
  rect(g, ox + 398, oy + 470, 44, 10, '#2f5fc4');
  stroke(g, ox + 448, oy + 500, ox + 470, oy + 462, '#f5a142', 6);
  tri(g, ox + 470, oy + 462, ox + 478, oy + 448, ox + 482, oy + 466, '#f5a142');
  // shells (seeded)
  for (let i = 0; i < 8; i++) {
    const x = ox + 40 + rng() * 520;
    const y = oy + 560 + rng() * 30;
    el(g, x, y, 7, 4, i % 2 ? '#ffffff' : '#ffd166');
  }

  if (!altered) return;
  // 1. a cloud drifts in front of the sun
  el(g, ox + 268, oy + 118, 46, 22, '#ffd166');
  el(g, ox + 300, oy + 110, 40, 20, '#ffd166');
  // 2. the starfish is gone
  el(g, ox + 150, oy + 500, 30, 28, '#f2d492');
  // 3. the bucket turns red
  g.fillStyle = '#e23b3b';
  g.beginPath();
  g.moveTo(ox + 400, oy + 478);
  g.lineTo(ox + 440, oy + 478);
  g.lineTo(ox + 434, oy + 528);
  g.lineTo(ox + 406, oy + 528);
  g.closePath();
  g.fill();
  // 4. one umbrella stripe turns yellow
  rect(g, ox + 450, oy + 118, 31, 92, '#ffd93b');
  // 5. the crab loses its right claw
  circ(g, ox + 284, oy + 506, 12, '#f2d492');
  // 6. the beach ball loses its red wedge
  g.save();
  g.beginPath();
  g.arc(ox + 90, oy + 300, 34, 0, Math.PI * 2);
  g.clip();
  tri(g, ox + 90, oy + 300, ox + 56, oy + 300, ox + 90, oy + 266, '#ffffff');
  g.restore();
  // 7. one coconut is gone
  circ(g, ox + 134, oy + 188, 13, '#3f9e4d');
}

const beachDiffs = [
  { x: 300, y: 130, r: 42, name: 'sun cloud' },
  { x: 150, y: 500, r: 30, name: 'starfish' },
  { x: 420, y: 503, r: 32, name: 'bucket colour' },
  { x: 465, y: 160, r: 34, name: 'umbrella stripe' },
  { x: 284, y: 506, r: 26, name: 'crab claw' },
  { x: 90, y: 300, r: 34, name: 'beach ball' },
  { x: 134, y: 188, r: 26, name: 'coconut' },
];

// ---------------------------------------------------------------- kitchen
function paintKitchen(g, ox, oy, rng, altered) {
  rect(g, ox, oy, 600, 470, '#f7e8c9');
  rect(g, ox, oy + 470, 600, 130, '#c89b6d');
  for (let x = 0; x < 600; x += 90) rect(g, ox + x, oy + 470, 3, 130, '#b98a5e');
  // window with night sky, moon and curtains
  rect(g, ox + 420, oy + 50, 150, 180, '#7a5230');
  rect(g, ox + 430, oy + 60, 130, 160, '#1d2f52');
  circ(g, ox + 530, oy + 100, 22, '#fff3b0');
  for (let i = 0; i < 8; i++) {
    const sx = ox + 440 + rng() * 100;
    const sy = oy + 70 + rng() * 120;
    circ(g, sx, sy, 2.5, '#ffffff');
  }
  rect(g, ox + 414, oy + 44, 26, 192, '#e23b3b');
  rect(g, ox + 550, oy + 44, 26, 192, '#e23b3b');
  // clock
  circ(g, ox + 300, oy + 90, 42, '#ffffff');
  g.strokeStyle = '#33475b';
  g.lineWidth = 4;
  g.beginPath();
  g.arc(ox + 300, oy + 90, 42, 0, Math.PI * 2);
  g.stroke();
  stroke(g, ox + 300, oy + 90, ox + 300, oy + 62, '#33475b', 5);
  stroke(g, ox + 300, oy + 90, ox + 326, oy + 90, '#33475b', 5);
  circ(g, ox + 300, oy + 90, 4, '#e23b3b');
  // picture frame with a sun
  rect(g, ox + 60, oy + 140, 100, 100, '#7a5230');
  rect(g, ox + 68, oy + 148, 84, 84, '#a8d8f0');
  circ(g, ox + 110, oy + 180, 20, '#ffd93b');
  el(g, ox + 110, oy + 222, 40, 8, '#7ec850');
  // rug
  el(g, ox + 300, oy + 560, 170, 30, '#c94f4f');
  el(g, ox + 300, oy + 560, 120, 20, '#e8b04b');
  // table
  rect(g, ox + 120, oy + 430, 360, 16, '#8a6d3b');
  rect(g, ox + 140, oy + 446, 14, 120, '#7a5230');
  rect(g, ox + 446, oy + 446, 14, 120, '#7a5230');
  // teapot with steam
  el(g, ox + 250, oy + 400, 34, 26, '#5b8dd9');
  rect(g, ox + 244, oy + 368, 12, 10, '#5b8dd9');
  tri(g, ox + 282, oy + 392, ox + 300, oy + 382, ox + 282, oy + 404, '#5b8dd9');
  g.strokeStyle = 'rgba(120,120,120,0.7)';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(ox + 250, oy + 360);
  g.quadraticCurveTo(ox + 238, oy + 340, ox + 250, oy + 322);
  g.stroke();
  g.beginPath();
  g.moveTo(ox + 262, oy + 358);
  g.quadraticCurveTo(ox + 274, oy + 338, ox + 262, oy + 320);
  g.stroke();
  // mugs
  rr(g, ox + 176, oy + 402, 34, 30, 5, '#3d7bfd');
  stroke(g, ox + 210, oy + 410, ox + 220, oy + 410, '#3d7bfd', 5);
  rr(g, ox + 316, oy + 402, 34, 30, 5, '#4caf50');
  stroke(g, ox + 350, oy + 410, ox + 360, oy + 410, '#4caf50', 5);
  // fruit bowl
  el(g, ox + 300, oy + 452, 52, 16, '#e8b04b');
  circ(g, ox + 276, oy + 436, 13, '#e23b3b');
  circ(g, ox + 300, oy + 430, 13, '#e23b3b');
  circ(g, ox + 324, oy + 436, 13, '#e23b3b');
  circ(g, ox + 288, oy + 448, 11, '#ff8c42');
  circ(g, ox + 312, oy + 448, 11, '#ff8c42');
  // chair with the cat
  rect(g, ox + 440, oy + 380, 90, 14, '#8a6d3b');
  rect(g, ox + 446, oy + 394, 10, 60, '#7a5230');
  rect(g, ox + 514, oy + 394, 10, 60, '#7a5230');
  rect(g, ox + 520, oy + 330, 10, 64, '#7a5230');
  el(g, ox + 480, oy + 368, 30, 24, '#f5a142');
  circ(g, ox + 480, oy + 340, 20, '#f5a142');
  tri(g, ox + 466, oy + 328, ox + 470, oy + 310, ox + 478, oy + 328, '#f5a142');
  tri(g, ox + 482, oy + 328, ox + 490, oy + 310, ox + 494, oy + 328, '#f5a142');
  circ(g, ox + 473, oy + 338, 3, '#2b2b2b');
  circ(g, ox + 487, oy + 338, 3, '#2b2b2b');

  if (!altered) return;
  // 1. the clock now says half past five
  circ(g, ox + 300, oy + 90, 38, '#ffffff');
  stroke(g, ox + 300, oy + 90, ox + 310, oy + 62, '#33475b', 5);
  stroke(g, ox + 300, oy + 90, ox + 300, oy + 118, '#33475b', 5);
  circ(g, ox + 300, oy + 90, 4, '#e23b3b');
  // 2. the blue mug turns purple
  rr(g, ox + 176, oy + 402, 34, 30, 5, '#9b59d0');
  // 3. the cat has jumped off the chair
  el(g, ox + 480, oy + 352, 34, 28, '#f7e8c9');
  // 4. one apple is gone from the bowl
  circ(g, ox + 324, oy + 436, 14, '#e8b04b');
  // 5. the teapot steam is gone
  rect(g, ox + 232, oy + 314, 48, 50, '#f7e8c9');
  // 6. the picture now shows a moon
  rect(g, ox + 68, oy + 148, 84, 84, '#1d2f52');
  circ(g, ox + 110, oy + 178, 18, '#fff3b0');
  circ(g, ox + 100, oy + 172, 4, '#d8c98a');
  circ(g, ox + 118, oy + 186, 3, '#d8c98a');
  // 7. the right curtain is gone
  rect(g, ox + 550, oy + 44, 26, 192, '#f7e8c9');
}

const kitchenDiffs = [
  { x: 300, y: 90, r: 40, name: 'clock time' },
  { x: 193, y: 417, r: 28, name: 'mug colour' },
  { x: 480, y: 352, r: 34, name: 'cat' },
  { x: 324, y: 436, r: 26, name: 'apple' },
  { x: 256, y: 338, r: 30, name: 'steam' },
  { x: 110, y: 190, r: 36, name: 'picture' },
  { x: 563, y: 140, r: 30, name: 'curtain' },
];

export const SCENES = [
  { id: 'garden', name: 'Garden Morning', blurb: 'Milo the cat is out in the garden. Seven little things changed — can you spot them all?', diffs: gardenDiffs, paint: paintGarden },
  { id: 'beach', name: 'Beach Sunset', blurb: 'Golden hour at the beach. Seven little things changed — can you spot them all?', diffs: beachDiffs, paint: paintBeach },
  { id: 'kitchen', name: 'Cozy Kitchen', blurb: 'Tea is brewing and the cat is on the chair. Seven little things changed — can you spot them all?', diffs: kitchenDiffs, paint: paintKitchen },
];
