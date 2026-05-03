// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 800);
});

// ===== PARTICLES BACKGROUND =====
function initParticles() {
  const canvas = document.getElementById('particles-bg');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const colors = ['#e23636', '#f5c518', '#00d4ff', '#1a3a6b'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.5 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += 0.02;
      this.opacity = 0.15 + Math.sin(this.pulse) * 0.15;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = particles[a].color;
          ctx.globalAlpha = 0.04 * (1 - dist / 120);
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}
initParticles();

// ===== NAVBAR =====
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== BACK TO TOP =====
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealElements.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.counter').forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);

// ===== CHARACTER TABS =====
const charTabs = document.querySelectorAll('.char-tab');
const charCards = document.querySelectorAll('.char-card');

charTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    charTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.getAttribute('data-filter');

    charCards.forEach(card => {
      const team = card.getAttribute('data-team');
      if (filter === 'all' || team === filter) {
        card.style.display = 'block';
        card.style.animation = 'fadeInUp .5s both';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    const originalText = btn.textContent;
    btn.textContent = '✓ MESSAGE SENT';
    btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

// ===== SMOOTH SCROLL FOR NAV =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const position = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  });
});

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    item.style.animation = 'pulse .3s';
    setTimeout(() => item.style.animation = '', 300);
  });
});


// ===== CHATBOT =====
const chatToggle = document.getElementById('chatbot-toggle');
const chatbot = document.getElementById('chatbot');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const quickActions = document.getElementById('quickActions');

let chatHistory = [];
let isBotTyping = false;

// Toggle open/close
chatToggle.addEventListener('click', () => {
  chatbot.classList.toggle('chatbot-open');
  chatbot.classList.toggle('chatbot-closed');
  // Hide notification badge when opened
  const notif = chatToggle.querySelector('.chat-notif');
  if (notif) notif.style.display = 'none';
});

chatClose.addEventListener('click', () => {
  chatbot.classList.replace('chatbot-open', 'chatbot-closed');
});

// Quick action buttons
document.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const msg = btn.getAttribute('data-msg');
    if (msg && !isBotTyping) sendMessage(msg);
  });
});

// Send on button click or Enter
chatSend.addEventListener('click', () => {
  const text = chatInput.value.trim();
  if (text && !isBotTyping) sendMessage(text);
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text && !isBotTyping) sendMessage(text);
  }
});

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(role, text) {
  const isUser = role === 'user';
  const div = document.createElement('div');
  div.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
  div.innerHTML = `
    <div class="msg-avatar"><i class="fas fa-${isUser ? 'user' : 'robot'}"></i></div>
    <div class="msg-bubble">
      <p>${text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
      <span class="msg-time">${getTime()}</span>
    </div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'chat-msg bot chat-typing';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="msg-avatar"><i class="fas fa-robot"></i></div>
    <div class="typing-dots"><span></span><span></span><span></span></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

async function sendMessage(text) {
  chatInput.value = '';
  appendMessage('user', text);
  chatHistory.push({ role: 'user', content: text });

  // Hide quick actions after first use
  if (quickActions) quickActions.style.display = 'none';

  isBotTyping = true;
  chatSend.disabled = true;
  showTyping();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are J.A.R.V.I.S., Tony Stark's AI assistant, now serving as the official Marvel Universe guide on this Marvel fan website. You are knowledgeable, witty, and slightly formal — like a very well-read assistant with Stark's dry humor. 
        
Respond to questions about Marvel characters, movies, comics, storylines, powers, history, and the MCU. Keep answers concise (2-4 sentences usually), engaging, and in-character. Use bold (**text**) for character/movie names. Occasionally reference Tony Stark or the Avengers in your responses. If asked something non-Marvel, gently steer back to Marvel topics.`,
        messages: chatHistory
      })
    });

    const data = await response.json();
    removeTyping();

    if (data.content && data.content[0]) {
      const reply = data.content[0].text;
      chatHistory.push({ role: 'assistant', content: reply });
      appendMessage('bot', reply);
    } else {
      appendMessage('bot', 'My apologies — the Arc Reactor seems to be interfering with my signal. Please try again.');
    }
  } catch (err) {
    removeTyping();
    appendMessage('bot', 'Communication disruption detected. Even Stark tech has its limits. Please try again shortly.');
  }

  isBotTyping = false;
  chatSend.disabled = false;
  chatInput.focus();
}

function typeWriter(element, text, speed = 60) {
  let i = 0;
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

const heroDesc = document.querySelector('.hero-desc');
if (heroDesc) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      typeWriter(heroDesc, heroDesc.getAttribute('data-text'), 30);
      observer.unobserve(heroDesc);
    }
  });
  observer.observe(heroDesc);
}
