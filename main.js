// Modern 3D Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initLoadingScreen();
  init3DBackground();
  initCustomCursor();
  initNavigation();
  initAnimations();
  init3DModels();
  initInteractions();
  initEasterEgg();
});

// Loading Screen
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingProgress = document.getElementById('loadingProgress');
  
  if (!loadingScreen || !loadingProgress) return;
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 500);
    }
    loadingProgress.style.width = progress + '%';
  }, 100);
}

// 3D Background with Three.js
function init3DBackground() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Create particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1000;
  const posArray = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: '#00d4ff',
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);
  
  camera.position.z = 2;
  
  // Mouse movement effect
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
  });
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.001;
    
    // Mouse interaction
    particlesMesh.rotation.x += mouseY * 0.001;
    particlesMesh.rotation.y += mouseX * 0.001;
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Custom 3D Cursor
function initCustomCursor() {
  const cursor = document.getElementById('custom3dCursor');
  const cursorDot = cursor?.querySelector('.cursor-dot');
  const cursorRing = cursor?.querySelector('.cursor-ring');
  const cursorTrail = cursor?.querySelector('.cursor-trail');
  
  if (!cursor || !cursorDot || !cursorRing || !cursorTrail) return;
  
  let mouseX = 0;
  let mouseY = 0;
  let trailX = 0;
  let trailY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function updateCursor() {
    // Smooth cursor movement
    const dotX = mouseX + (trailX - mouseX) * 0.1;
    const dotY = mouseY + (trailY - mouseY) * 0.1;
    
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    
    cursorRing.style.left = mouseX + 'px';
    cursorRing.style.top = mouseY + 'px';
    
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';
    
    trailX += (mouseX - trailX) * 0.05;
    trailY += (mouseY - trailY) * 0.05;
    
    requestAnimationFrame(updateCursor);
  }
  
  updateCursor();
  
  // Cursor interactions
  document.querySelectorAll('a, button, .portfolio-item, .about-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

// Navigation
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navHamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const muteToggle = document.getElementById('muteToggle');
  const threeDToggle = document.getElementById('3dToggle');
  
  // Mobile menu
  if (navHamburger && navLinks) {
    navHamburger.addEventListener('click', () => {
      navHamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }
  
  // Theme switcher
  if (themeToggle) {
    const themes = ['dark', 'light', 'neon'];
    let currentTheme = 0;
    
    themeToggle.addEventListener('click', () => {
      currentTheme = (currentTheme + 1) % themes.length;
      document.documentElement.setAttribute('data-theme', themes[currentTheme]);
      
      const themeIcon = themeToggle.querySelector('.theme-icon');
      if (themeIcon) {
        themeIcon.textContent = themes[currentTheme] === 'dark' ? '🌙' : 
                               themes[currentTheme] === 'light' ? '☀️' : '💡';
      }
    });
  }
  
  // Mute toggle
  if (muteToggle) {
    let isMuted = false;
    muteToggle.addEventListener('click', () => {
      isMuted = !isMuted;
      const muteIcon = muteToggle.querySelector('.mute-icon');
      if (muteIcon) {
        muteIcon.textContent = isMuted ? '🔇' : '🔊';
      }
    });
  }
  
  // 3D toggle
  if (threeDToggle) {
    let is3DEnabled = true;
    threeDToggle.addEventListener('click', () => {
      is3DEnabled = !is3DEnabled;
      const threeDIcon = threeDToggle.querySelector('.3d-icon');
      if (threeDIcon) {
        threeDIcon.textContent = is3DEnabled ? '🎮' : '🎯';
      }
      // Toggle 3D effects
      document.body.classList.toggle('3d-disabled', !is3DEnabled);
    });
  }
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Animations with GSAP
function initAnimations() {
  // Register ScrollTrigger plugin
  if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);
  }
  
  // Hero animations
  gsap.from('.hero-title .title-line', {
    duration: 1.2,
    y: 100,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
  });
  
  gsap.from('.hero-description', {
    duration: 1,
    y: 50,
    opacity: 0,
    delay: 0.6,
    ease: 'power3.out'
  });
  
  gsap.from('.hero-cta', {
    duration: 1,
    y: 50,
    opacity: 0,
    delay: 0.9,
    ease: 'power3.out'
  });
  
  // Scroll-triggered animations
  gsap.from('.about-card', {
    scrollTrigger: {
      trigger: '.about',
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    },
    duration: 0.8,
    y: 100,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
  });
  
  gsap.from('.portfolio-item', {
    scrollTrigger: {
      trigger: '.portfolio',
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    },
    duration: 0.8,
    y: 100,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
  });
  
  // Parallax effects
  gsap.utils.toArray('.parallax-section').forEach(section => {
    gsap.to(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: (i, target) => -target.offsetHeight * 0.1,
      ease: 'none'
    });
  });
}

// 3D Models
function init3DModels() {
  // Hero 3D Model
  const heroModel = document.getElementById('heroModel');
  if (heroModel && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(400, 400);
    renderer.setClearColor(0x000000, 0);
    heroModel.appendChild(renderer.domElement);
    
    // Create a geometric shape
    const geometry = new THREE.OctahedronGeometry(1, 0);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    camera.position.z = 3;
    
    // Animation
    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    
    animate();
  }
  
  // Portfolio 3D Previews
  ['preview1', 'preview2', 'preview3'].forEach((previewId, index) => {
    const preview = document.getElementById(previewId);
    if (preview && typeof THREE !== 'undefined') {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 350 / 250, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      
      renderer.setSize(350, 250);
      renderer.setClearColor(0x000000, 0);
      preview.appendChild(renderer.domElement);
      
      // Different geometries for each preview
      let geometry;
      switch (index) {
        case 0:
          geometry = new THREE.BoxGeometry(1, 1, 1);
          break;
        case 1:
          geometry = new THREE.SphereGeometry(1, 32, 32);
          break;
        case 2:
          geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
          break;
      }
      
      const material = new THREE.MeshPhongMaterial({
        color: [0x00d4ff, 0xff6b6b, 0x4ecdc4][index],
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(1, 1, 1);
      scene.add(light);
      
      camera.position.z = 3;
      
      function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.005;
        renderer.render(scene, camera);
      }
      
      animate();
    }
  });
}

// Interactions
function initInteractions() {
  // Tilt effect for cards
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
  
  // Form interactions
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
  });
  
  // Contact form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Add submission animation
      const submitBtn = contactForm.querySelector('.submit-btn');
      submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
      submitBtn.disabled = true;
      
      // Simulate form submission
      setTimeout(() => {
        submitBtn.innerHTML = '<span class="btn-text">Message Sent!</span>';
        setTimeout(() => {
          submitBtn.innerHTML = '<span class="btn-text">Send Message</span>';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 2000);
      }, 1500);
    });
  }
}

// Easter Egg
function initEasterEgg() {
  const eggModal = document.getElementById('easterEggModal');
  const eggClose = document.getElementById('easterEggClose');
  const eggCanvas = document.getElementById('easterEggCanvas');
  
  if (!eggModal || !eggClose || !eggCanvas) return;
  
  let eggCode = '';
  let isEggActive = false;
  
  // Konami code detection
  document.addEventListener('keydown', (e) => {
    if (isEggActive && e.key === 'Escape') {
      hideEgg();
      return;
    }
    
    eggCode += e.key.toLowerCase();
    if (eggCode.length > 10) {
      eggCode = eggCode.slice(-10);
    }
    
    if (eggCode.includes('3dvision')) {
      showEgg();
      eggCode = '';
    }
  });
  
  function showEgg() {
    eggModal.style.display = 'flex';
    gsap.fromTo(eggModal, 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
    isEggActive = true;
    initEggGame();
  }
  
  function hideEgg() {
    gsap.to(eggModal, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        eggModal.style.display = 'none';
        isEggActive = false;
      }
    });
  }
  
  eggClose.addEventListener('click', hideEgg);
  eggModal.addEventListener('click', (e) => {
    if (e.target === eggModal) hideEgg();
  });
  
  function initEggGame() {
    const ctx = eggCanvas.getContext('2d');
    const canvas = eggCanvas;
    
    let particles = [];
    const colors = ['#00d4ff', '#ff6b6b', '#4ecdc4', '#ffd93d', '#ffffff'];
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.size = Math.random() * 4 + 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }
    
    function animate() {
      if (!isEggActive) return;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    // Click to add particles
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      for (let i = 0; i < 5; i++) {
        const particle = new Particle();
        particle.x = x;
        particle.y = y;
        particles.push(particle);
      }
    });
  }
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
  // Reinitialize any components that need resize handling
}, 250)); 