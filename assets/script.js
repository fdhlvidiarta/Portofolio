gsap.registerPlugin(ScrollTrigger);

window.addEventListener("DOMContentLoaded", () => {
  // --- 0. CUSTOM CURSOR ANIMATION ---
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");

  if (window.matchMedia("(pointer: fine)").matches) {
    let xToDot = gsap.quickTo(cursorDot, "x", {
      duration: 0.05,
      ease: "power3",
    });
    let yToDot = gsap.quickTo(cursorDot, "y", {
      duration: 0.05,
      ease: "power3",
    });
    let xToRing = gsap.quickTo(cursorRing, "x", {
      duration: 0.3,
      ease: "power3",
    });
    let yToRing = gsap.quickTo(cursorRing, "y", {
      duration: 0.3,
      ease: "power3",
    });

    window.addEventListener("mousemove", (e) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    });

    const interactables = document.querySelectorAll(
      "a, button, .nav-toggle, .project-card, .stat-card, .edu-card",
    );

    interactables.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        gsap.to(cursorRing, {
          scale: 1.5,
          borderColor: "var(--accent-cyan)",
          backgroundColor: "rgba(6, 182, 212, 0.1)",
          duration: 0.3,
        });
        gsap.to(cursorDot, { scale: 0, duration: 0.3 });
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(cursorRing, {
          scale: 1,
          borderColor: "var(--accent-purple)",
          backgroundColor: "transparent",
          duration: 0.3,
        });
        gsap.to(cursorDot, { scale: 1, duration: 0.3 });
      });
    });
  }

  // --- 1. MOBILE HAMBURGER MENU LOGIC ---
  const navToggle = document.getElementById("navToggle");
  const navLinksContainer = document.querySelector(".nav-links");
  const navIcon = navToggle.querySelector("i");

  navToggle.addEventListener("click", () => {
    navLinksContainer.classList.toggle("nav-active");
    if (navLinksContainer.classList.contains("nav-active")) {
      navIcon.classList.replace("fa-bars", "fa-xmark");
    } else {
      navIcon.classList.replace("fa-xmark", "fa-bars");
    }
  });

  const navItems = navLinksContainer.querySelectorAll("a");
  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      navLinksContainer.classList.remove("nav-active");
      navIcon.classList.replace("fa-xmark", "fa-bars");
    });
  });

  // --- 2. BILINGUAL SWITCH LOGIC ---
  const langToggleBtn = document.getElementById("langToggle");
  const flagIcon = langToggleBtn.querySelector(".flag-icon");

  const savedLang = localStorage.getItem("language");
  if (savedLang === "en") {
    document.body.classList.replace("lang-id", "lang-en");
    flagIcon.textContent = "ING";
  }

  langToggleBtn.addEventListener("click", () => {
    if (document.body.classList.contains("lang-id")) {
      document.body.classList.replace("lang-id", "lang-en");
      flagIcon.textContent = "ING";
      localStorage.setItem("language", "en");
    } else {
      document.body.classList.replace("lang-en", "lang-id");
      flagIcon.textContent = "ID";
      localStorage.setItem("language", "id");
    }
    ScrollTrigger.refresh();
  });

  // --- 3. THEME TOGGLER (DARK / LIGHT MODE) ---
  const themeToggleBtn = document.getElementById("themeToggle");
  const themeIcon = themeToggleBtn.querySelector("i");

  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "light") {
    document.body.classList.add("light-theme");
    themeIcon.classList.replace("fa-sun", "fa-moon");
  }

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    let theme = "dark";
    if (document.body.classList.contains("light-theme")) {
      theme = "light";
      themeIcon.classList.replace("fa-sun", "fa-moon");
    } else {
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }
    localStorage.setItem("theme", theme);
  });

  // --- 4. ORB ANIMATIONS ---
  gsap.to(".orb-purple", {
    x: "random(-100, 100)",
    y: "random(-50, 120)",
    duration: 12,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(".orb-blue", {
    x: "random(-80, 120)",
    y: "random(-100, 80)",
    duration: 15,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(".orb-cyan", {
    x: "random(-120, 80)",
    y: "random(-60, 100)",
    duration: 14,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // --- 5. ADAPTIVE PARTICLE CANVAS ---
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  const connectionDistance = 150;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 1;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw(isLight) {
      ctx.save();
      ctx.fillStyle = isLight ? "#5a3edb" : "#ffffff";
      ctx.globalAlpha = isLight ? 0.3 : 0.6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function drawConnections(isLight) {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          let baseOpacity = isLight ? 0.25 : 0.15;
          let opacity = baseOpacity * (1 - distance / connectionDistance);

          ctx.save();
          ctx.strokeStyle = isLight ? "#5a3edb" : "#ffffff";
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = document.body.classList.contains("light-theme");

    particles.forEach((p) => {
      p.update();
      p.draw(isLight);
    });
    drawConnections(isLight);

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // --- 6. FIX SCROLL ACTIVE NAVBAR (BULLETPROOF LOGIC) ---
  const sections = document.querySelectorAll(".section-target");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      // Aktifkan tab jika layar mengenai 150px dari bagian atas target section
      if (scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // --- 7. FIX: TIMELINE & REVEAL ANIMATION (NO MORE MISSING/DIM CARDS) ---
  const introTimeline = gsap.timeline();
  introTimeline
    .from("nav", { y: -30, opacity: 0, duration: 1, ease: "power4.out" })
    .from(
      ".hero-eyebrow",
      { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" },
      "-=0.6",
    )
    .from(
      ".hero-name",
      { y: 30, opacity: 0, duration: 0.9, ease: "power4.out" },
      "-=0.6",
    )
    .from(
      ".hero-role",
      { y: 15, opacity: 0, duration: 0.7, ease: "power3.out" },
      "-=0.7",
    )
    .from(
      ".hero-image-wrapper",
      { scale: 0.8, x: 30, opacity: 0, duration: 1.2, ease: "power4.out" },
      "-=0.9",
    )
    .from(
      ".image-inner-border",
      { scale: 1.1, opacity: 0, duration: 1.5, ease: "expo.out" },
      "-=0.8",
    )
    .from(
      ".hero-cta .btn",
      { y: 15, opacity: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
      "-=1",
    )
    .from(".hero-scroll-hint", { opacity: 0, duration: 0.5 }, "-=0.4");

  // Animasi Judul
  const labelsAndTitles = document.querySelectorAll(
    ".section-label, .section-title, .summary-text",
  );
  labelsAndTitles.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 30, opacity: 0 },
      {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
      },
    );
  });

  // Animasi Kartu Individual
  const allCards = document.querySelectorAll(
    ".stat-card, .edu-card, .project-card, .skill-group, .timeline-item",
  );
  allCards.forEach((card) => {
    gsap.fromTo(
      card,
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "all", // PENTING: Membersihkan inline styles setelah animasi
      },
    );
  });
});

// --- BACK TO TOP LOGIC ---
const backToTopBtn = document.getElementById("backToTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
