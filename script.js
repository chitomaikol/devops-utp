const canvas = document.getElementById('pixelClock');
const ctx = canvas.getContext('2d');
const digitalTime = document.getElementById('digitalTime');
const dateText = document.getElementById('dateText');

const SIZE = 320;
const PIXEL = 8;
const CENTER = SIZE / 2;

function drawPixelRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
}

function drawTick(angle, length, width, color) {
  const outerX = CENTER + Math.cos(angle) * 112;
  const outerY = CENTER + Math.sin(angle) * 112;
  const innerX = CENTER + Math.cos(angle) * (112 - length);
  const innerY = CENTER + Math.sin(angle) * (112 - length);

  const dx = outerX - innerX;
  const dy = outerY - innerY;
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / PIXEL));

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = innerX + dx * t;
    const y = innerY + dy * t;
    drawPixelRect(x - width / 2, y - width / 2, width, width, color);
  }
}

function drawHand(angle, length, width, color) {
  const x = CENTER + Math.cos(angle) * length;
  const y = CENTER + Math.sin(angle) * length;

  const dx = x - CENTER;
  const dy = y - CENTER;
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / PIXEL));

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const px = CENTER + dx * t;
    const py = CENTER + dy * t;
    drawPixelRect(px - width / 2, py - width / 2, width, width, color);
  }
}

function drawFace() {
  ctx.clearRect(0, 0, SIZE, SIZE);

  drawPixelRect(0, 0, SIZE, SIZE, '#0b1020');
  drawPixelRect(16, 16, SIZE - 32, SIZE - 32, '#101a2c');
  drawPixelRect(24, 24, SIZE - 48, SIZE - 48, '#18263d');

  for (let i = 0; i < 60; i += 1) {
    const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const tickLength = i % 5 === 0 ? 16 : 10;
    const tickWidth = i % 5 === 0 ? 6 : 4;
    drawTick(angle, tickLength, tickWidth, '#dbeafe');
  }

  drawPixelRect(CENTER - 12, CENTER - 12, 24, 24, '#7dd3fc');

  const numberPositions = [
    { value: 12, angle: -Math.PI / 2, r: 80 },
    { value: 3, angle: 0, r: 80 },
    { value: 6, angle: Math.PI / 2, r: 80 },
    { value: 9, angle: Math.PI, r: 80 }
  ];

  numberPositions.forEach(({ value, angle, r }) => {
    const x = CENTER + Math.cos(angle) * r;
    const y = CENTER + Math.sin(angle) * r;
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 18px Segoe UI';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(value), x, y);
  });
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  drawFace();

  const hourAngle = ((hours + minutes / 60 + seconds / 3600) * Math.PI) / 6 - Math.PI / 2;
  const minuteAngle = ((minutes + seconds / 60) * Math.PI) / 30 - Math.PI / 2;
  const secondAngle = (seconds * Math.PI) / 30 - Math.PI / 2;

  drawHand(hourAngle, 66, 12, '#fbbf24');
  drawHand(minuteAngle, 92, 8, '#7dd3fc');
  drawHand(secondAngle, 110, 4, '#f472b6');

  drawPixelRect(CENTER - 10, CENTER - 10, 20, 20, '#f8fafc');

  const timeString = [
    now.getHours().toString().padStart(2, '0'),
    now.getMinutes().toString().padStart(2, '0'),
    now.getSeconds().toString().padStart(2, '0')
  ].join(':');

  digitalTime.textContent = timeString;

  const dateFormatter = new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  dateText.textContent = dateFormatter.format(now).replace('.', '');
}

setInterval(updateClock, 1000);
updateClock();
