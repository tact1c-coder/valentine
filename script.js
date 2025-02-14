document.addEventListener("DOMContentLoaded", () => {
  const state = {
    stage: "home", // stages: home, proposal, celebration, final
  };

  const container = document.getElementById("container");
  const messageContainer = document.getElementById("message-container");
  const mainMessage = document.getElementById("main-message");
  const subMessage = document.getElementById("sub-message");
  const loveLetterContainer = document.getElementById("love-letter-container");
  const bigHeart = document.getElementById("big-heart");
  const bgMusic = document.getElementById("bg-music");
  const fireworkSound = document.getElementById("firework-sound");
  const canvas = document.getElementById("animationCanvas");
  const ctx = canvas.getContext("2d");

  // Preload heart image for final firework particles
  const heartImage = new Image();
  heartImage.src = "heart.png";

  // Set canvas dimensions
  let canvasWidth = (canvas.width = window.innerWidth);
  let canvasHeight = (canvas.height = window.innerHeight);
  window.addEventListener("resize", () => {
    canvasWidth = canvas.width = window.innerWidth;
    canvasHeight = canvas.height = window.innerHeight;
  });

  // Custom Cursor & Parallax Effect
  const customCursor = document.getElementById("custom-cursor");
  document.addEventListener("mousemove", (e) => {
    customCursor.style.left = e.clientX + "px";
    customCursor.style.top = e.clientY + "px";
    container.style.backgroundPosition = `${e.clientX / 100}px ${
      e.clientY / 100
    }px`;
  });

  // Create falling hearts for the background effect
  function createFallingHearts(num) {
    for (let i = 0; i < num; i++) {
      const heart = document.createElement("div");
      heart.classList.add("falling-heart");
      heart.textContent = "❤️";
      heart.style.left = Math.random() * 100 + "vw";
      const duration = 5 + Math.random() * 5;
      const delay = Math.random() * 5;
      heart.style.animationDuration = duration + "s";
      heart.style.animationDelay = delay + "s";
      container.appendChild(heart);
    }
  }
  createFallingHearts(30);

  // Fireworks particles
  let particles = [];

  // Utility: create a new audio clone to stack sounds
  function playFireworkSound() {
    const soundClone = fireworkSound.cloneNode(true); // deep clone copies the <source>
    soundClone.play().catch((err) => console.error("Audio play failed:", err));
  }

  function createFirework(x, y, colors) {
    playFireworkSound();

    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: x,
        y: y,
        radius: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 6 + 3,
        alpha: 1,
        decay: 0.01 + Math.random() * 0.02,
      });
    }
  }

  // Update and draw particles
  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      if (p.useImage) {
        ctx.drawImage(
          heartImage,
          p.x - p.radius,
          p.y - p.radius,
          p.radius * 2,
          p.radius * 2
        );
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      ctx.restore();
    });
  }

  function animateParticles() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Remove falling hearts from the DOM
  function removeFallingHearts() {
    const hearts = document.querySelectorAll(".falling-heart");
    hearts.forEach((heart) => heart.remove());
  }

  // Trigger fireworks animation
  function triggerFireworks() {
    const colors = [
      "#ff5c8d",
      "#FF0000",
      "#FF9900",
      "#FFFF00",
      "#00FF00",
      "#00FFFF",
      "#0000FF",
      "#FF00FF",
    ];

    const interval = setInterval(() => {
      const x = Math.random() * canvasWidth;
      const y = Math.random() * (canvasHeight / 2);
      createFirework(x, y, colors);
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      triggerHeartFirework();
    }, 5000);
  }

  // Grand heart firework effect (heart-shaped burst)
  function triggerHeartFirework() {
    particles = [];
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const colors = ["#ff5c8d", "#ff8fa3", "#FF0000"];

    const particleCount = 300;
    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 2;
      const xOffset = 16 * Math.pow(Math.sin(t), 3);
      const yOffset = -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      );
      particles.push({
        x: centerX,
        y: centerY,
        radius: 12 + Math.random() * 12,
        useImage: true,
        angle: Math.atan2(yOffset, xOffset),
        speed: Math.random() * 4 + 2,
        alpha: 1,
        decay: 0.005,
      });
    }
    playFireworkSound();

    setTimeout(() => {
      showBigHeart();
    }, 2000);
  }

  // Reveal the love letter with enhanced styling and restart falling hearts
  function showBigHeart() {
    canvas.style.opacity = 0;
    messageContainer.style.opacity = 0;

    loveLetterContainer.style.display = "flex";
    setTimeout(() => {
      loveLetterContainer.style.opacity = 1;
      bigHeart.style.opacity = 1;
      // Restart falling hearts on the final page
      createFallingHearts(30);
    }, 100);

    state.stage = "final";
  }

  // Click events for stage transitions
  messageContainer.addEventListener("click", () => {
    if (state.stage === "home") {
      bgMusic.play().catch(() => {});
      state.stage = "proposal";
      messageContainer.style.opacity = 0;
      setTimeout(() => {
        mainMessage.textContent = "Will you be my Valentine?";
        subMessage.textContent = "Click for yes.";
        messageContainer.style.opacity = 1;
      }, 1000);
    } else if (state.stage === "proposal") {
      state.stage = "celebration";
      removeFallingHearts();
      messageContainer.style.opacity = 0;
      triggerFireworks();
    }
  });

  // Secret surprise: clicking the tiny heart reveals a personal message
  const secretHeart = document.getElementById("secret-heart");
  secretHeart.addEventListener("click", (e) => {
    e.stopPropagation();
    alert(
      "Surprise! Btw, ur still def still smaller, my 'small', cute princess ;) "
    );
  });
});
