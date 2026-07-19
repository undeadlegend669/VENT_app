/*
  VENT behaviour script
  This file powers the mobile navigation, dark mode, notifications,
  chatbot responses, advertisement rotation, loading screen, and small UI interactions.
*/

// Show a short loading screen when the page opens.
function showLoadingScreen() {
  const loader = document.createElement('div');
  loader.className = 'loading-screen';
  loader.innerHTML = '<div class="loader"></div>';
  document.body.appendChild(loader);

  window.setTimeout(() => {
    loader.classList.add('hidden');
    window.setTimeout(() => loader.remove(), 500);
  }, 1200);
}

// Apply the saved theme from localStorage or use the system preference.
function applyTheme() {
  const savedTheme = localStorage.getItem('vent-theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
}

// Toggle the visual theme and save it.
function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', currentTheme);
  localStorage.setItem('vent-theme', currentTheme);
  showToast(`Theme switched to ${currentTheme} mode.`);
}

// Create and show a toast notification.
function showToast(message) {
  const stack = document.getElementById('toastStack') || createToastStack();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  stack.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2400);
}

function createToastStack() {
  const stack = document.createElement('div');
  stack.id = 'toastStack';
  stack.className = 'toast-stack';
  document.body.appendChild(stack);
  return stack;
}

// Toggle the mobile menu.
function toggleMobileNav() {
  const panel = document.querySelector('.mobile-nav');
  panel?.classList.toggle('open');
}

// Toggle notification dropdown.
function toggleNotifications() {
  const panel = document.querySelector('.notification-panel');
  panel?.classList.toggle('open');
}

// Add a small ripple effect to buttons.
function attachRippleEffect() {
  document.querySelectorAll('.btn, .icon-btn, .action-btn, .chatbot-toggle').forEach((button) => {
    button.addEventListener('click', function (event) {
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      ripple.className = 'ripple';
      button.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 500);
    });
  });
}

// Make action buttons feel interactive.
function attachActionButtons() {
  document.querySelectorAll('.action-btn').forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');
      const label = button.dataset.label || 'Action';
      showToast(`${label} updated.`);
    });
  });
}

// Rotate the advertisement cards on the homepage.
function startAdRotation() {
  const rotator = document.querySelector('.ad-rotator');
  if (!rotator) return;

  const slides = Array.from(rotator.querySelectorAll('.ad-slide'));
  if (!slides.length) return;

  let currentIndex = 0;

  setInterval(() => {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex);
    });
    currentIndex = (currentIndex + 1) % slides.length;
  }, 5000);
}

// Chatbot responses for common questions.
const chatbotResponses = {
  'register': 'You can register by choosing Individual or Company, then selecting Farmer or Buyer on the sign up page.',
  'post': 'Farmers can create posts from the dashboard and attach images, videos, or audio clips to promote products.',
  'premium': 'Premium unlocks ad-free browsing, higher visibility, featured placement, and priority support.',
  'contact': 'Use the contact buttons on farmer or company profiles to start a conversation directly.',
  'ranking': 'Ranking prioritizes premium members first, then uses average rating, verified reviews, and recent activity.',
  'warehouses': 'Visit the warehouses page to find storage partners, capacity, pricing, and contact details.',
  'logistics': 'Open the logistics page to browse transport partners, vehicle types, prices, and contact options.'
};

function attachChatbot() {
  const toggle = document.querySelector('.chatbot-toggle');
  const windowEl = document.querySelector('.chatbot-window');
  const input = document.querySelector('.chat-input');
  const form = document.querySelector('.chat-form');

  if (!toggle || !windowEl || !input || !form) return;

  toggle.addEventListener('click', () => {
    windowEl.classList.toggle('open');
  });

  document.querySelectorAll('.suggestion-btn').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.dataset.prompt || button.textContent;
      form.requestSubmit();
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const userInput = input.value.trim().toLowerCase();
    const response = getChatbotResponse(userInput);

    const body = document.querySelector('.chatbot-body');
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = input.value.trim();

    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble';
    botBubble.textContent = response;

    body.appendChild(userBubble);
    body.appendChild(botBubble);
    input.value = '';
    body.scrollTop = body.scrollHeight;
  });
}

function getChatbotResponse(message) {
  if (!message) return 'Hello! Ask me about registration, posting, premium, or finding partners.';

  if (message.includes('register')) return chatbotResponses.register;
  if (message.includes('post') || message.includes('product')) return chatbotResponses.post;
  if (message.includes('premium')) return chatbotResponses.premium;
  if (message.includes('contact')) return chatbotResponses.contact;
  if (message.includes('rank') || message.includes('review')) return chatbotResponses.ranking;
  if (message.includes('warehouse')) return chatbotResponses.warehouses;
  if (message.includes('logistics') || message.includes('transport')) return chatbotResponses.logistics;
  return 'I can help with registration, posting products, premium plans, contacting buyers, and finding warehouses or logistics partners.';
}

// Keep the current page link active in the navigation.
function activateNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.includes(currentPath) || (currentPath === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Run everything when the page has finished loading.
window.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  showLoadingScreen();
  activateNavLink();
  attachRippleEffect();
  attachActionButtons();
  startAdRotation();
  attachChatbot();

  document.querySelector('.hamburger')?.addEventListener('click', toggleMobileNav);
  document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);
  document.querySelector('.notification-toggle')?.addEventListener('click', toggleNotifications);

  const now = new Date();
  const year = now.getFullYear();
  const yearTarget = document.querySelector('[data-year]');
  if (yearTarget) yearTarget.textContent = year;
});
