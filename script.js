// Fireworks setup
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = ["#FF5733", "#33FF57", "#3357FF", "#F4FF33", "#FF33F6"];
const fireworks = [];
let animationFrame;
let fireworkInterval;
let fireworkSpawnRate = 500; // Spawn every 0.5 seconds

// Utility functions
const random = (min, max) => Math.random() * (max - min) + min;

// Particle class
class Particle {
  constructor(x, y, color, shape) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = random(0, Math.PI * 2); // Random angle
    this.speed = random(2, 6);
    this.radius = random(1, 3);
    this.shape = shape; // Shape for the particle (star, heart, etc.)
    this.life = 100;
  }

  update() {
    this.life--;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.speed *= 0.98; // Friction
  }

  draw() {
    if (this.life > 0) {
      ctx.beginPath();
      if (this.shape === "star") {
        ctx.moveTo(this.x, this.y);
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(
            this.x + this.radius * Math.cos(this.angle + (i * Math.PI) / 2.5),
            this.y + this.radius * Math.sin(this.angle + (i * Math.PI) / 2.5)
          );
        }
      } else if (this.shape === "heart") {
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      } else if (this.shape === "circle") {
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Circle shape for "vũ trụ"
      }
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

// Firework class
class Firework {
  constructor() {
    // Random spawn position, but within the canvas area
    this.x = random(100, canvas.width - 100); // Ensure it stays inside the canvas horizontally
    this.y = random(100, canvas.height - 100); // Ensure it stays inside the canvas vertically
    this.particles = [];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.shape = ["star", "heart", "circle"][Math.floor(Math.random() * 3)]; // Random shapes
    this.launchParticles();
  }

  launchParticles() {
    const particleCount = 100; // Number of particles per firework
    const spreadAngle = Math.PI * 2; // Full circle spread

    for (let i = 0; i < particleCount; i++) {
      const angle = random(0, spreadAngle); // Random angle within full circle
      this.particles.push(
        new Particle(this.x, this.y, this.color, this.shape, angle)
      );
    }
  }

  update() {
    this.particles.forEach((particle) => particle.update());
  }

  draw() {
    this.particles.forEach((particle) => particle.draw());
  }
}

// Spawn fireworks
function spawnFirework() {
  fireworks.push(new Firework());
}

// Update and render loop
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw();
    if (firework.particles.every((p) => p.life <= 0)) {
      fireworks.splice(index, 1);
    }
  });

  animationFrame = requestAnimationFrame(loop);
}

// Start fireworks display
function startFireworks() {
  animationFrame = requestAnimationFrame(loop);

  fireworkInterval = setInterval(spawnFirework, fireworkSpawnRate);

  // Show "Chúc mừng năm mới 2025!" message after 2 seconds
  setTimeout(() => {
    showMessage();
  }, 2000); // Delay the message for 2 seconds after fireworks start
}

// Show "Chúc mừng năm mới 2025!" message
function showMessage() {
  const message = document.getElementById("message");
  message.classList.remove("hidden");
  message.classList.add("visible");

  // Fade out the message after 5 seconds
  setTimeout(() => {
    message.classList.add("fade-out");
  }, 5000); // Message stays for 5 seconds before fading out
}

// Initialize fireworks display
startFireworks();
