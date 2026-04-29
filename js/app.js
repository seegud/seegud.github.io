/**
 * Custom cursor + scroll reveals + parallax + GSAP ScrollTrigger
 */

const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let trailX = 0, trailY = 0;

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

/* ---------- Custom Cursor ---------- */
if (!isTouchDevice && cursor && cursorTrail) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;

    cursor.style.transform = `translate(${cursorX - 6}px, ${cursorY - 6}px)`;
    cursorTrail.style.transform = `translate(${trailX - 20}px, ${trailY - 20}px)`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('[data-cursor="hover"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorTrail.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorTrail.classList.remove('hover');
    });
  });
}

/* ---------- Scroll Reveals (text lines) ---------- */
const revealElements = document.querySelectorAll('.reveal-line, .reveal-fade');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const parent = entry.target.parentElement;
      const siblings = parent ? parent.querySelectorAll('.reveal-line') : [];
      const i = Array.from(siblings).indexOf(entry.target);
      entry.target.style.setProperty('--i', i >= 0 ? i : 0);
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ---------- Parallax for hero bg text ---------- */
const heroBgTexts = document.querySelectorAll('.hero-bg-text, .hero-bg-text-outline');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  heroBgTexts.forEach((el, i) => {
    const speed = i === 0 ? 0.08 : 0.05;
    el.style.transform = `translate(-50%, calc(-50% + ${scrollY * speed}px))`;
  });
}, { passive: true });

/* ---------- Project number parallax ---------- */
const projectNumbers = document.querySelectorAll('.project-number-bg');
let visibleProjectCount = 0;

const numberObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      visibleProjectCount++;
      if (visibleProjectCount === 1) {
        window.addEventListener('scroll', handleNumberParallax);
      }
    } else {
      visibleProjectCount--;
      if (visibleProjectCount === 0) {
        window.removeEventListener('scroll', handleNumberParallax);
      }
    }
  });
}, { threshold: 0 });

function handleNumberParallax() {
  projectNumbers.forEach(num => {
    const rect = num.parentElement.getBoundingClientRect();
    const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.03;
    num.style.transform = `translate(-50%, calc(-50% + ${centerOffset}px))`;
  });
}

projectNumbers.forEach(n => numberObserver.observe(n.parentElement));

/* ---------- Smooth anchor scroll offset ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
      requestAnimationFrame(() => {
        window.scrollTo({ top, behavior: 'smooth' });
      });
    }
  });
});

/* ============================================
   GSAP ScrollTrigger — slide-in animations
   ============================================ */
gsap.registerPlugin(ScrollTrigger);

// Project cards: alternate slide from left / right
gsap.utils.toArray('.project').forEach((project) => {
  const isLeft = project.classList.contains('project-left');
  gsap.from(project, {
    scrollTrigger: {
      trigger: project,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    x: isLeft ? -100 : 100,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
  });
});

// About visual slides in from left
gsap.from('.about-visual', {
  scrollTrigger: {
    trigger: '.about',
    start: "top 75%"
  },
  x: -80,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

// About stats stagger up
gsap.from('.about-stats .stat', {
  scrollTrigger: {
    trigger: '.about-stats',
    start: "top 85%"
  },
  y: 30,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: "power3.out"
});

// Footer
gsap.from('.footer-cta', {
  scrollTrigger: {
    trigger: '.site-footer',
    start: "top 85%"
  },
  y: 60,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

gsap.from('.footer-bottom', {
  scrollTrigger: {
    trigger: '.site-footer',
    start: "top 80%"
  },
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
  delay: 0.2
});
