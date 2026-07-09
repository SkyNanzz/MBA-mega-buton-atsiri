/* ============================================
   MBA Mega Buton Atsiri - Company Profile
   script.js - Animations & Interactions
   ============================================ */

'use strict';

// ============================================
// NAVBAR - Scroll Behavior
// ============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  // Add/remove scrolled class
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScroll = currentScroll;

  // Update active nav link based on scroll position
  updateActiveNavLink();
});

// ============================================
// NAVBAR - Update Active Link on Scroll
// ============================================
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.pageYOffset + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// ============================================
// MOBILE MENU
// ============================================
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  document.body.classList.toggle('menu-open');
});

// Close menu when clicking a nav link
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
});

// ============================================
// PARTICLES CANVAS
// ============================================
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId = null;
let canvasWidth = 0;
let canvasHeight = 0;

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around edges
    if (this.x < -10) this.x = canvasWidth + 10;
    if (this.x > canvasWidth + 10) this.x = -10;
    if (this.y < -10) this.y = canvasHeight + 10;
    if (this.y > canvasHeight + 10) this.y = -10;

    // Pulse opacity
    this.pulsePhase += this.pulseSpeed;
  }

  draw() {
    const pulseOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulsePhase));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(89, 195, 125, ${pulseOpacity})`;
    ctx.fill();

    // Glow effect
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size * 3
    );
    gradient.addColorStop(0, `rgba(89, 195, 125, ${pulseOpacity * 0.3})`);
    gradient.addColorStop(1, 'rgba(89, 195, 125, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

function initParticles() {
  const particleCount = Math.min(
    Math.floor((canvasWidth * canvasHeight) / 12000),
    80
  );
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  // Draw connections between nearby particles
  drawConnections();

  animationId = requestAnimationFrame(animateParticles);
}

function drawConnections() {
  const connectionDistance = 120;
  const maxOpacity = 0.12;

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        const opacity = maxOpacity * (1 - distance / connectionDistance);
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(89, 195, 125, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function resizeCanvas() {
  const hero = canvas.parentElement;
  canvasWidth = hero.offsetWidth;
  canvasHeight = hero.offsetHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  initParticles();
}

// Initialize canvas on load
window.addEventListener('load', () => {
  resizeCanvas();
  animateParticles();
});

// Handle resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeCanvas();
  }, 200);
});

// ============================================
// INTERSECTION OBSERVER - Scroll Animations
// ============================================
const animateElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -100px 0px',
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optionally unobserve after animation
      // observer.unobserve(entry.target);
    }
  });
}, observerOptions);

animateElements.forEach((el) => {
  observer.observe(el);
});

// ============================================
// SMOOTH SCROLLING (Enhanced)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = targetElement.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  });
});

// ============================================
// PARALLAX EFFECT ON HERO (Light)
// ============================================
const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');
const leaves = document.querySelectorAll('.leaf');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  const heroHeight = heroSection.offsetHeight;

  if (scrollY <= heroHeight) {
    const progress = scrollY / heroHeight;

    // Parallax for hero content
    if (heroContent) {
      heroContent.style.transform = `translateY(${progress * 40}px)`;
      heroContent.style.opacity = 1 - progress * 0.5;
    }

    // Parallax for leaves - only opacity (transform is handled by CSS animation)
    leaves.forEach((leaf) => {
      leaf.style.opacity = Math.max(0, 1 - progress * 0.8);
    });
  }
});

// ============================================
// PREVENT SCROLL ON HERO WHEN ANIMATING
// ============================================
// (No action needed, just cleanup)

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Pause canvas animation when tab is not visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  } else {
    if (!animationId && canvas.width > 0) {
      animateParticles();
    }
  }
});

// ============================================
// INITIAL ACTIVE LINK
// ============================================
updateActiveNavLink();

console.log('%c MBA Mega Buton Atsiri ', 'background: #123524; color: #59C37D; font-size: 16px; font-weight: bold; padding: 10px 20px; border-radius: 4px;');
console.log('%c Company Profile Website ', 'color: #59C37D; font-size: 12px;');
