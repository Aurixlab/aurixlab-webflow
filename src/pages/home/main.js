import Swiper from 'swiper/bundle'
import Lenis from '@studio-freight/lenis'

const gsap = window.gsap
const ScrollTrigger = window.ScrollTrigger

gsap.registerPlugin(ScrollTrigger)



// ===================================
// FORCE SCROLL TO TOP ON EVERY PAGE LOAD/REFRESH
// ===================================
(function() {
  // Immediately scroll to top before anything else
  window.scrollTo(0, 0);
  
  // Disable browser scroll restoration
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  // Force scroll to top on various events
  window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
  });
  
  window.addEventListener('unload', function() {
    window.scrollTo(0, 0);
  });
  
  // Handle page show (including back/forward navigation)
  window.addEventListener('pageshow', function(event) {
    // event.persisted is true if page is loaded from cache (back/forward)
    if (event.persisted) {
      window.scrollTo(0, 0);
      // Reload the page to reset all animations
      window.location.reload();
    }
  });
  
  // Also scroll to top when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
  
  // And when window fully loads
  window.addEventListener('load', function() {
    setTimeout(function() {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
  });
  
  console.log('🔝 Scroll-to-top protection initialized');
})();


// ===================================
// INITIALIZE LENIS SMOOTH SCROLLING
// ===================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});


// ===================================
// MASTER GSAP ANIMATION CONTROLLER
// ===================================
document.addEventListener('DOMContentLoaded', function() {
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Connect Lenis with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  
  gsap.ticker.lagSmoothing(0);
  
// ===================================
// 1. PRELOADER TO HERO TRANSITION
// ===================================

(function() {
  console.log('🎬 Preloader script loaded');
  
  // ===================================
  // DISABLE SCROLL INITIALLY
  // ===================================
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  
  // Stop Lenis smooth scrolling during preloader
  if (typeof lenis !== 'undefined') {
    lenis.stop();
    console.log('🔒 Scroll disabled - Lenis stopped');
  }
  
  // Get the preloader wrapper and video (desktop only)
  const preloaderWrapper = document.querySelector('.preloader-wrapper');
  const preloaderVideoDesktop = document.querySelector('.preloader-video-desktop video');
  
  // Get hero section video (desktop only)
  const heroVideoDesktop = document.querySelector('.hero-bg-video-desktop video');
  
  console.log('📹 Elements found:', {
    preloaderWrapper: !!preloaderWrapper,
    preloaderVideoDesktop: !!preloaderVideoDesktop,
    heroVideoDesktop: !!heroVideoDesktop
  });
  
  // Track if hero video has already been played
  let heroVideoPlayed = false;
  
  // Pause hero video initially and remove autoplay
  if (heroVideoDesktop) {
    heroVideoDesktop.pause();
    heroVideoDesktop.removeAttribute('autoplay');
    heroVideoDesktop.loop = true;
    heroVideoDesktop.currentTime = 0;
    console.log('⏸️ Hero desktop video paused and autoplay removed (loop enabled)');
  }
  
  // Get hero content and navbar elements
  const heroIconBtn = document.querySelector('.hero-content-wrapper .icon-btn-wrapper');
  const navbar = document.querySelector('.navbar-wrapper');
  
  console.log('🎯 UI Elements found:', {
    heroIconBtn: !!heroIconBtn,
    navbar: !!navbar
  });
  
  // Set initial hidden state for hero button and navbar
  if (heroIconBtn) {
    heroIconBtn.style.opacity = '0';
    heroIconBtn.style.visibility = 'hidden';
    heroIconBtn.style.transition = 'opacity 0.8s ease-out, visibility 0.8s';
    console.log('🎨 Hero button hidden initially');
  }
  
  if (navbar) {
    navbar.style.opacity = '0';
    navbar.style.visibility = 'hidden';
    navbar.style.transition = 'opacity 0.8s ease-out, visibility 0.8s';
    console.log('🎨 Navbar hidden initially');
  }
  
  // ===================================
  // FUNCTION TO ENABLE SCROLLING
  // ===================================
  function enableScrolling() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    // Start Lenis smooth scrolling
    if (typeof lenis !== 'undefined') {
      lenis.start();
      console.log('🔓 Scroll enabled - Lenis started');
    }
    
    // Refresh ScrollTrigger after enabling scroll
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
      console.log('🔄 ScrollTrigger refreshed');
    }
  }
  
  // Function to hide preloader and play hero video
  function transitionToHero() {
    console.log('✨ Transitioning to hero section');
    
    if (!preloaderWrapper) {
      console.error('❌ Preloader wrapper not found');
      enableScrolling(); // Enable scroll even if preloader not found
      return;
    }
    
    // Hide preloader with fade
    preloaderWrapper.style.transition = 'opacity 0.5s ease-out';
    preloaderWrapper.style.opacity = '0';
    
    setTimeout(() => {
      preloaderWrapper.style.display = 'none';
      console.log('✅ Preloader hidden');
      
      console.log('🎥 Playing hero video');
      
      if (heroVideoDesktop && !heroVideoPlayed) {
        heroVideoPlayed = true;
        heroVideoDesktop.currentTime = 0;
        heroVideoDesktop.play().then(() => {
          console.log('▶️ Hero video playing successfully');
        }).catch(err => {
          console.error('❌ Hero video play error:', err);
        });
      } else if (heroVideoPlayed) {
        console.log('⚠️ Hero video already played, skipping');
      }
      
      // Fade in hero button and navbar after preloader is fully hidden
      setTimeout(() => {
        if (heroIconBtn) {
          heroIconBtn.style.visibility = 'visible';
          heroIconBtn.style.opacity = '1';
          console.log('✨ Hero button faded in');
        }
        
        if (navbar) {
          navbar.style.visibility = 'visible';
          navbar.style.opacity = '1';
          console.log('✨ Navbar faded in');
        }
        
        // ===================================
        // ENABLE SCROLLING AFTER TRANSITION COMPLETE
        // ===================================
        setTimeout(() => {
          enableScrolling();
          console.log('✅ Preloader transition complete - scrolling enabled');
        }, 300); // Small delay after UI elements fade in
        
      }, 100);
      
    }, 500);
  }
  
  // Add event listeners to desktop preloader video
  if (preloaderVideoDesktop) {
    console.log('👂 Adding listeners to desktop preloader video');
    
    preloaderVideoDesktop.addEventListener('loadedmetadata', function() {
      console.log('📊 Desktop video metadata loaded, duration:', this.duration);
    });
    
    preloaderVideoDesktop.addEventListener('playing', function() {
      console.log('▶️ Desktop preloader video is PLAYING');
    });
    
    preloaderVideoDesktop.addEventListener('ended', function() {
      console.log('🏁 Desktop preloader video ENDED');
      transitionToHero();
    });
    
    preloaderVideoDesktop.addEventListener('error', function(e) {
      console.error('❌ Desktop video error:', e);
      // Enable scrolling on error so user isn't stuck
      enableScrolling();
    });
  } else {
    // No preloader video found - enable scrolling immediately
    console.log('⚠️ No preloader video found - enabling scroll');
    setTimeout(() => {
      enableScrolling();
    }, 1000);
  }
  
  // Check video attributes
  setTimeout(() => {
    if (preloaderVideoDesktop) {
      console.log('🔍 Desktop video attributes:', {
        autoplay: preloaderVideoDesktop.autoplay,
        loop: preloaderVideoDesktop.loop,
        muted: preloaderVideoDesktop.muted,
        paused: preloaderVideoDesktop.paused,
        ended: preloaderVideoDesktop.ended,
        currentTime: preloaderVideoDesktop.currentTime,
        duration: preloaderVideoDesktop.duration
      });
    }
  }, 1000);
  
  // Ultimate fallback - 15 seconds (also enables scrolling)
  console.log('⏰ Setting 15 second fallback timeout');
  setTimeout(() => {
    console.log('⏰ Fallback timeout triggered');
    transitionToHero();
  }, 15000);
  
})();

console.log('✅ Preloader script initialization complete');


// ===================================
// 2. NEW DIVISION CARDS SECTION
// ===================================
const divisionSection = document.querySelector('.abt-card-wrapper.is-home');
if (divisionSection) {
  const headingBox = divisionSection.querySelector('.abt-card-heading-box');
  const cardItems = gsap.utils.toArray('.abt-card-item-box');
  
  // Set initial states
  if (headingBox) {
    const headingElements = headingBox.querySelectorAll('.division-sub, .division-title, .divi-des, .icon-btn-wrapper');
    gsap.set(headingElements, { opacity: 0, y: 50 });
  }
  
  gsap.set(cardItems, { opacity: 0, y: 80, scale: 0.9 });
  
  // Create animation timeline
  const divisionTl = gsap.timeline({
    scrollTrigger: {
      trigger: divisionSection,
      start: 'top 70%',
      end: 'bottom 80%',
      scrub: 1,
      markers: false
    }
  });
  
  // Animate heading elements
  if (headingBox) {
    const headingElements = headingBox.querySelectorAll('.division-sub, .division-title, .divi-des');
    divisionTl.to(headingElements, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    }, 0);
    
    const buttons = headingBox.querySelectorAll('.icon-btn-wrapper');
    divisionTl.to(buttons, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    }, 0.4);
  }
  
  // Animate cards
  divisionTl.to(cardItems, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.2,
    stagger: 0.2,
    ease: 'power2.out'
  }, 0.6);
  
  console.log('✅ Division cards section initialized!');
}


// ===================================
// 2. PARTICLE SECTION with Scale Animation & Star Background
// FIXED: Proper scroll-up animation when returning from below
// ===================================
const section = document.querySelector('.particle-section');
const title = document.querySelector('.text-box-title');
const slider = document.querySelector('.spline-slider-wrapper');
const button = document.querySelector('.partilce-btn-box');
const navbarLogo = document.querySelector('.navbar31_logo-link');
const scrollIndicator = document.querySelector('.scroll-indicator');
const starBgBox = document.querySelector('.star-bg-box');

if (section && title && slider) {
  const totalSlides = 4;
  let swiperInstance;
  let currentSlideIndex = 0;
  let sliderFullyVisible = false;
  let fallingStarsInstance = null;

  // ===================================
  // INITIALIZE STAR BACKGROUND
  // ===================================
  function initializeStarBackground() {
    const canvas = document.getElementById('starsCanvas');
    const container = document.getElementById('starsContainer');
    
    if (!canvas || !container) {
      console.warn('Star canvas or container not found');
      return;
    }

    class FallingStars {
      constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.color = options.color || '#FFF';
        this.count = options.count || 200;
        this.stars = [];
        this.perspective = 0;
        this.animationFrame = null;
        this.isAnimating = false;
        
        this.init();
      }

      init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        if (this.canvas.width > 0 && this.canvas.height > 0) {
          this.initStars();
        }
      }

      initStars() {
        this.perspective = this.canvas.width / 2;
        this.stars = [];
        
        for (let i = 0; i < this.count; i++) {
          this.stars.push({
            x: (Math.random() - 0.5) * 2 * this.canvas.width,
            y: (Math.random() - 0.5) * 2 * this.canvas.height,
            z: Math.random() * this.canvas.width,
            speed: Math.random() * 5 + 2
          });
        }
      }

      resizeCanvas() {
        const container = this.canvas.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        if (width > 0 && height > 0) {
          this.canvas.width = width;
          this.canvas.height = height;
          this.canvas.style.width = width + 'px';
          this.canvas.style.height = height + 'px';
          this.perspective = this.canvas.width / 2;
          
          if (this.stars.length === 0) {
            this.initStars();
          }
        }
      }

      hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        
        if (hex.length === 3) {
          hex = hex.split('').map(char => char + char).join('');
        }
        
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        
        return { r, g, b };
      }

      drawStar(star) {
        const scale = this.perspective / (this.perspective + star.z);
        const x2d = this.canvas.width / 2 + star.x * scale;
        const y2d = this.canvas.height / 2 + star.y * scale;
        const size = Math.max(scale * 3, 0.5);

        const prevScale = this.perspective / (this.perspective + star.z + star.speed * 15);
        const xPrev = this.canvas.width / 2 + star.x * prevScale;
        const yPrev = this.canvas.height / 2 + star.y * prevScale;

        const rgb = this.hexToRgb(this.color);

        this.ctx.save();
        this.ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
        this.ctx.lineWidth = size * 2.5;
        this.ctx.shadowBlur = 35;
        this.ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
        this.ctx.beginPath();
        this.ctx.moveTo(x2d, y2d);
        this.ctx.lineTo(xPrev, yPrev);
        this.ctx.stroke();
        this.ctx.restore();

        this.ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`;
        this.ctx.lineWidth = size;
        this.ctx.beginPath();
        this.ctx.moveTo(x2d, y2d);
        this.ctx.lineTo(xPrev, yPrev);
        this.ctx.stroke();

        this.ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
        this.ctx.beginPath();
        this.ctx.arc(x2d, y2d, size / 4, 0, Math.PI * 2);
        this.ctx.fill();
      }

      animate() {
        if (!this.isAnimating) return;
        if (this.canvas.width === 0 || this.canvas.height === 0) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.stars.forEach(star => {
          this.drawStar(star);
          star.z -= star.speed;

          if (star.z <= 0) {
            star.z = this.canvas.width;
            star.x = (Math.random() - 0.5) * 2 * this.canvas.width;
            star.y = (Math.random() - 0.5) * 2 * this.canvas.height;
          }
        });

        this.animationFrame = requestAnimationFrame(() => this.animate());
      }

      start() {
        if (!this.isAnimating) {
          this.isAnimating = true;
          this.resizeCanvas();
          if (this.stars.length === 0) {
            this.initStars();
          }
          this.animate();
          console.log('⭐ Stars animation started');
        }
      }

      stop() {
        this.isAnimating = false;
        if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame);
          this.animationFrame = null;
        }
        console.log('⭐ Stars animation stopped');
      }

      setColor(color) {
        this.color = color;
      }
    }

    fallingStarsInstance = new FallingStars(canvas, {
      color: '#FFF',
      count: 200
    });

    console.log('⭐ Star background initialized');
  }

  // Initialize star background
  initializeStarBackground();

  // ===================================
  // INITIAL SETUP
  // ===================================
  gsap.set(section, { clearProps: 'all' });
  gsap.set(slider, { 
    opacity: 0, 
    visibility: 'hidden'
  });
  gsap.set(button, { 
    opacity: 1, 
    y: 0, 
    visibility: 'visible'
  });
  
  if (navbarLogo) {
    gsap.set(navbarLogo, { 
      opacity: 0,
      visibility: 'hidden'
    });
  }

  if (scrollIndicator) {
    gsap.set(scrollIndicator, {
      opacity: 0,
      y: 50,
      visibility: 'hidden'
    });
  }

  // Star background - hidden by default
  if (starBgBox) {
    gsap.set(starBgBox, {
      opacity: 0,
      visibility: 'hidden'
    });
  }

  // ===================================
  // PREPARE TITLE WORDS
  // ===================================
  const originalText = title.textContent.trim();
  const words = originalText.split(' ');
  title.innerHTML = words.map(word => 
    `<span class="word" style="display:inline-block; margin-right:0em;">${word}</span>`
  ).join('');
  
  const wordElements = Array.from(title.querySelectorAll('.word'));
  const lastWord = wordElements[wordElements.length - 1];
  const otherWords = wordElements.slice(0, -1);

  gsap.set(wordElements, { y: 0, opacity: 1, scale: 1 });
  gsap.set(lastWord, { transformOrigin: 'center center', zIndex: 10 });

  // ===================================
  // SLIDE ELEMENTS HELPER
  // ===================================
  function getSlideElements(slideIndex) {
    const slide = document.querySelectorAll('.spline-slider-wrapper .swiper-slide')[slideIndex];
    if (!slide) return null;
    
    const scene = slide.querySelector('.grid-wrapper');
    return {
      slide: slide,
      centerBox: scene?.querySelector('.center-box'),
      sidebars: scene?.querySelectorAll('.sidebar-left, .sidebar-right'),
      boxes: scene?.querySelectorAll('.top-box, .bottom-box'),
      headings: slide.querySelectorAll('.spline-slide-heading, .spline-slide-heading.right'),
      desc: slide.querySelector('.slide-des'),
      btn: slide.querySelector('.spline-slide-btn-wrapper')
    };
  }

  // ===================================
  // SET INITIAL HIDDEN STATES FOR ALL SLIDES
  // ===================================
  for (let i = 0; i < 4; i++) {
    const slideElements = getSlideElements(i);
    if (slideElements) {
      gsap.set(slideElements.slide, { visibility: 'visible', opacity: 1 });
      
      // ALL SLIDES: Start with scale 0 for centerBox and sidebars
      gsap.set(slideElements.centerBox, { opacity: 0, scale: 0 });
      gsap.set(slideElements.sidebars, { opacity: 0, scale: 0 });
      gsap.set(slideElements.boxes, { opacity: 0, y: 50 });
      
      gsap.set(slideElements.headings, { opacity: 0, x: 100 });
      gsap.set(slideElements.desc, { opacity: 0, y: 50 });
      gsap.set(slideElements.btn, { opacity: 0, y: 50 });
    }
  }

  // ===================================
  // INITIALIZE SWIPER
  // ===================================
  if (typeof Swiper !== 'undefined') {
    swiperInstance = new Swiper('.spline-slider-wrapper .swiper', {
      speed: 300,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      allowTouchMove: false,
      simulateTouch: false,
      on: {
        slideChange: function () {
          currentSlideIndex = this.activeIndex;
          updateProgressBar();
        }
      }
    });
    updateProgressBar();
  }

  function updateProgressBar() {
    if (!swiperInstance) return;
    const progress = ((swiperInstance.activeIndex + 1) / totalSlides) * 100;
    gsap.to('#progressBar', {
      width: progress + '%',
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  // ===================================
  // SCROLL TRIGGER FOR SLIDE SWITCHING WITH PAUSES
  // ===================================
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=500%',
    onUpdate: (self) => {
      if (!swiperInstance) return;
      
      const progress = self.progress;
      let targetSlide = 0;
      
      if (progress < 0.42) {
        targetSlide = 0;
      } else if (progress < 0.66) {
        targetSlide = 1;
      } else if (progress < 0.90) {
        targetSlide = 2;
      } else {
        targetSlide = 3;
      }
      
      if (targetSlide !== swiperInstance.activeIndex) {
        console.log(`🔄 Switching to slide ${targetSlide + 1} at progress ${progress.toFixed(3)}`);
        swiperInstance.slideTo(targetSlide);
      }
    }
  });

  // ===================================
  // MAIN TIMELINE - FIXED FOR SCROLL-UP
  // ===================================
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=500%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // FIX: Add callbacks to handle scroll direction changes
      onLeave: () => {
        console.log('📍 Left particle section (scrolling down)');
      },
      onEnterBack: () => {
        console.log('📍 Re-entered particle section (scrolling up)');
        // Ensure slider is visible when coming back
        gsap.set(slider, { visibility: 'visible', opacity: 1 });
      },
      onLeaveBack: () => {
        console.log('📍 Left particle section (scrolling up to hero)');
      }
    }
  });

  const slide1 = getSlideElements(0);
  const slide2 = getSlideElements(1);
  const slide3 = getSlideElements(2);
  const slide4 = getSlideElements(3);

  // ===================================
  // RESPONSIVE SCALE CALCULATION
  // ===================================
  const isMobileDevice = window.innerWidth < 768;
  const isTabletDevice = window.innerWidth >= 768 && window.innerWidth < 1024;
  
  let initialScale, finalScale;
  
  if (isMobileDevice) {
    initialScale = 1.3;
    finalScale = 8;
  } else if (isTabletDevice) {
    initialScale = 1.5;
    finalScale = 12;
  } else {
    initialScale = 2;
    finalScale = 12;
  }

  // ===================================
  // INTRO ANIMATION WITH STAR BACKGROUND (0.00 - 0.27)
  // FIXED: Proper reverse behavior
  // ===================================
  mainTl
    // Fade out button and other words
    .to(button, { 
      opacity: 0, 
      y: 30, 
      duration: 0.08, 
      ease: 'power2.inOut' 
    }, 0)
    
    .to(otherWords, { 
      opacity: 0, 
      duration: 0.08, 
      ease: 'none' 
    }, 0)
    
    // Show star-bg-box
    .set(starBgBox, {
      visibility: 'visible'
    }, 0)
    
    // Smooth fade in for star background
    .to(starBgBox, {
      opacity: 1,
      duration: 0.15,
      ease: 'power2.inOut',
      onStart: () => {
        if (fallingStarsInstance) fallingStarsInstance.start();
      },
      onReverseComplete: () => {
        if (fallingStarsInstance) fallingStarsInstance.stop();
      }
    }, 0)
    
    // Move lastWord to center AND scale up
    .to(lastWord, {
      x: () => {
        gsap.set(lastWord, { clearProps: 'x,y,scale' });
        const rect = lastWord.getBoundingClientRect();
        return (window.innerWidth / 2) - (rect.left + rect.width / 2);
      },
      y: () => {
        const rect = lastWord.getBoundingClientRect();
        return (window.innerHeight / 2) - (rect.top + rect.height / 2);
      },
      scale: initialScale,
      duration: 0.12, 
      ease: 'power2.inOut'
    }, 0)
    
    // Continue scaling lastWord + fade out
    .to(lastWord, { 
      scale: finalScale, 
      opacity: 0, 
      duration: 0.15, 
      ease: 'power3.inOut',
      // FIX: Add onReverseComplete to ensure proper reset
      onReverseComplete: () => {
        console.log('🔄 LastWord animation reversed - resetting to initial state');
      }
    }, 0.12)
    
    // Fade out star background
    .to(starBgBox, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.inOut',
      onComplete: () => {
        if (fallingStarsInstance) fallingStarsInstance.stop();
      },
      onReverseComplete: () => {
        if (fallingStarsInstance) fallingStarsInstance.start();
      }
    }, 0.12)
    
    .set(starBgBox, {
      visibility: 'hidden'
    }, 0.27)
    
    // Show slider
    .set(slider, {
      opacity: 1, 
      visibility: 'visible',
      onStart: () => { 
        sliderFullyVisible = true;
        if (swiperInstance) swiperInstance.slideTo(0, 0);
      },
      // FIX: Add onReverseComplete to properly hide slider
      onReverseComplete: () => {
        sliderFullyVisible = false;
        console.log('🔄 Slider hidden on reverse');
      }
    }, 0.12);

  // ===================================
  // SLIDE 1 ANIMATIONS (0.18 - 0.36) + PAUSE (0.36 - 0.42)
  // ===================================
  mainTl
    .to(slide1.centerBox, { 
      scale: 1, 
      opacity: 1, 
      duration: 0.06, 
      ease: 'power2.out' 
    }, 0.18)
    
    .to(slide1.sidebars, { 
      scale: 1, 
      opacity: 1, 
      duration: 0.06, 
      stagger: 0.015, 
      ease: 'power2.out' 
    }, 0.21)
    
    .to(slide1.boxes, { 
      y: 0, 
      opacity: 1, 
      duration: 0.06, 
      stagger: 0.01, 
      ease: 'power2.out' 
    }, 0.24)
    
    .to(slide1.headings, { 
      opacity: 1, 
      x: 0, 
      duration: 0.06, 
      stagger: 0.015, 
      ease: 'power2.out' 
    }, 0.27)
    
    .to(slide1.desc, { 
      opacity: 1, 
      y: 0, 
      duration: 0.06, 
      ease: 'power2.out' 
    }, 0.30)
    
    .to(slide1.btn, { 
      opacity: 1, 
      y: 0, 
      duration: 0.06, 
      ease: 'power2.out' 
    }, 0.33)
    
    .to(navbarLogo, { 
      opacity: 1, 
      visibility: 'visible', 
      duration: 0.10, 
      ease: 'power2.inOut' 
    }, 0.20)
    
    .to(scrollIndicator, { 
      opacity: 1, 
      y: 0, 
      visibility: 'visible', 
      duration: 0.06, 
      ease: 'power2.out' 
    }, 0.30)
    
    // PAUSE after slide 1
    .to({}, { duration: 0.06 }, 0.36);

  // ===================================
  // SLIDE 2 ANIMATIONS (0.42 - 0.60) + PAUSE (0.60 - 0.66)
  // ===================================
  mainTl
    .to(slide2.centerBox, { 
      scale: 1, 
      opacity: 1, 
      duration: 0.06, 
      ease: 'power2.out' 
    }, 0.42)
    
    .to(slide2.sidebars, { 
      scale: 1, 
      opacity: 1, 
      duration: 0.06, 
      stagger: 0.015, 
      ease: 'power2.out' 
    }, 0.45)
    
    .to(slide2.boxes, { 
      y: 0, 
      opacity: 1, 
      duration: 0.06, 
      stagger: 0.01, 
      ease: 'power2.out' 
    }, 0.48)
    
    .to(slide2.headings, { 
      opacity: 1, 
      x: 0, 
      duration: 0.06, 
      stagger: 0.015, 
      ease: 'power2.out' 
    }, 0.51)
    
    .to(slide2.desc, { 
      opacity: 1, 
      y: 0, 
      duration: 0.06, 
      ease: 'power2.out' 
    }, 0.54)
    
    .to(slide2.btn, { 
      opacity: 1, 
      y: 0, 
      duration: 0.06, 
      ease: 'power2.out' 
    }, 0.57)
    
    // PAUSE after slide 2
    .to({}, { duration: 0.06 }, 0.60);

  // ===================================
  // SLIDE 3 ANIMATIONS (0.66 - 0.84) + PAUSE (0.84 - 0.90)
  // ===================================
  mainTl
    .to(slide3.centerBox, { 
      scale: 1, 
      opacity: 1, 
      duration: 0.06, 
      ease: 'power2.out' 
    }, 0.66)
    
    .to(slide3.sidebars, { 
      scale: 1, 
      opacity: 1, 
      duration: 0.06, 
      stagger: 0.015, 
      ease: 'power2.out' 
    }, 0.69)
    
    .to(slide3.boxes, { 
      y: 0, 
      opacity: 1, 
      duration: 0.06, 
      stagger: 0.01, 
      ease: 'power2.out' 
    }, 0.72)
    
    .to(slide3.headings, { 
      opacity: 1, 
      x: 0, 
      duration: 0.06, 
      stagger: 0.015, 
      ease: 'power2.out' 
    }, 0.75)
    
    .to(slide3.desc, { 
      opacity: 1, 
      y: 0, 
      duration: 0.06, 
      ease: 'power2.out' 
    }, 0.78)
    
    .to(slide3.btn, { 
      opacity: 1, 
      y: 0, 
      duration: 0.06, 
      ease: 'power2.out' 
    }, 0.81)
    
    // PAUSE after slide 3
    .to({}, { duration: 0.06 }, 0.84);

  // ===================================
  // SLIDE 4 ANIMATIONS (0.90 - 1.00)
  // ===================================
  mainTl
    .to(slide4.centerBox, { 
      scale: 1, 
      opacity: 1, 
      duration: 0.06, 
      ease: 'power2.out' 
    }, 0.90)
    
    .to(slide4.sidebars, { 
      scale: 1, 
      opacity: 1, 
      duration: 0.06, 
      stagger: 0.015, 
      ease: 'power2.out' 
    }, 0.93)
    
    .to(slide4.boxes, { 
      y: 0, 
      opacity: 1, 
      duration: 0.06, 
      stagger: 0.01, 
      ease: 'power2.out' 
    }, 0.96)
    
    .to(slide4.headings, { 
      opacity: 1, 
      x: 0, 
      duration: 0.06, 
      stagger: 0.015, 
      ease: 'power2.out' 
    }, 0.91)
    
    .to(slide4.desc, { 
      opacity: 1, 
      y: 0, 
      duration: 0.05, 
      ease: 'power2.out' 
    }, 0.95)
    
    .to(slide4.btn, { 
      opacity: 1, 
      y: 0, 
      duration: 0.05, 
      ease: 'power2.out' 
    }, 0.97);

  console.log('✅ Particle section initialized with proper scroll-up handling!');
}

  // ===================================
  // 3. HOME VIDEO SECTION
  // ===================================
  const homeVideoItems = gsap.utils.toArray('.home-bg-video-wrapper');
  if (homeVideoItems.length > 0) {
    gsap.set(homeVideoItems, { opacity: 0, scale: 0 });
    gsap.to(homeVideoItems, {
      scale: 1,
      opacity: 1,
      duration: 3.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.home-video-section',
        start: "top center",
        end: "bottom center",
        scrub: 1
      }
    });
  }



// ===================================
// 4 & 5. WORK GRID + MEET SECTION - FIXED
// ===================================
const workMeetContainer = document.querySelector('.work-meet-combined-section');
const workGridSection = document.querySelector('.work-grid-section');
const meetSection = document.querySelector('.meet-aur-section');
const workGridItems = gsap.utils.toArray('.work-grid-item');

if (workMeetContainer && workGridSection && meetSection && workGridItems.length > 0) {
  gsap.set(workGridItems, { y: 40, opacity: 0 });
  gsap.set(workGridSection, { x: "0%" });
  
  const meetVideoWrapper = document.querySelector('.meet-bg-video-wrapper');
  const meetMaskBox = document.querySelector('.meet-mask-box');
  const meetSvg = meetMaskBox?.querySelector('svg');
  
  if (meetVideoWrapper && meetMaskBox && meetSvg) {
    // Initial setup
    gsap.set(meetVideoWrapper, { x: "100%", visibility: "visible" });
    
    gsap.set(meetMaskBox, { 
      x: "100%", 
      visibility: "visible",
      opacity: 1
    });
    
    // Responsive device detection
    const isMobileDevice = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    let maskScaleValue;
    
    // Set transform origin and scale values based on device
    if (isMobileDevice) {
      // MOBILE: < 768px - Transform origin at 90% center
      maskScaleValue = 18;
      meetSvg.style.transformOrigin = "90% center";
      meetSvg.style.webkitTransformOrigin = "90% center";
      gsap.set(meetSvg, {
        scale: 1,
        transformOrigin: "90% center"
      });
      console.log('📱 MOBILE DETECTED - Transform origin: 90% center');
    } else if (isTablet) {
      // TABLET: 768px - 1024px - Transform origin at 80% center
      maskScaleValue = 20;
      meetSvg.style.transformOrigin = "80% center";
      meetSvg.style.webkitTransformOrigin = "80% center";
      gsap.set(meetSvg, {
        scale: 1,
        transformOrigin: "80% center"
      });
      console.log('💻 TABLET - Transform origin: 80% center');
    } else {
      // DESKTOP: > 1024px - Transform origin at 80% center
      maskScaleValue = 25;
      meetSvg.style.transformOrigin = "80% center";
      meetSvg.style.webkitTransformOrigin = "80% center";
      gsap.set(meetSvg, {
        scale: 1,
        transformOrigin: "80% center"
      });
      console.log('🖥️ DESKTOP - Transform origin: 80% center');
    }
    
    console.log('🔢 Scale value:', maskScaleValue);
    
    // IMPORTANT: Phase 3 duration - MUCH SLOWER on mobile
    const phase3Duration = isMobileDevice ? 15.0 : 3.5;
    console.log('⏱️ Phase 3 Duration:', phase3Duration, '(Mobile is 15.0, Desktop is 3.5)');
    
    // Function to calculate how far left the mask needs to move
    const calculateMaskStopPosition = () => {
      const svgRect = meetSvg.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      const svgWidth = svgRect.width;
      const svgLeft = svgRect.left;
      const svgRight = svgLeft + svgWidth;
      
      // Target position calculation
      let targetPosition = viewportWidth;
      
      // Mobile: Go 100px beyond right edge
      if (window.innerWidth < 768) {
        targetPosition = viewportWidth + 100;
      }
      
      const moveDistance = targetPosition - svgRight;
      
      console.log('📊 Mask Movement:', {
        device: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
        viewportWidth,
        svgRight,
        targetPosition,
        moveDistance: moveDistance + 'px'
      });
      
      return moveDistance;
    };
    
    const combinedTl = gsap.timeline({
      scrollTrigger: {
        trigger: workMeetContainer,
        start: 'top top',
        end: '+=600%',
        pin: true,
        scrub: 2,
        anticipatePin: 1,
        markers: false,
        id: 'work-meet-combined',
        invalidateOnRefresh: true
      }
    });
    
    // Phase 1: Work Grid Items appear (0 - 15%)
    combinedTl.to(workGridItems, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      stagger: 0.15,
      ease: 'power2.out'
    }, 0);
    
    // Phase 2: Work Grid slides out & Meet section slides in (15% - 50%)
    combinedTl.to(workGridSection, {
      x: "-100%",
      duration: 3.5,
      ease: "power2.inOut"
    }, 1.5);
    
    combinedTl.to([meetVideoWrapper, meetMaskBox], {
      x: "0%",
      duration: 3.5,
      ease: "power2.inOut"
    }, 1.5);
    
    // Phase 3: Mask continues moving LEFT (50% - 75%)
    // MOBILE: 10.0 duration (VERY SLOW - shows ~2 letters per scroll)
    // DESKTOP: 3.5 duration (normal speed)
    combinedTl.to(meetMaskBox, {
      x: () => calculateMaskStopPosition(),
      duration: phase3Duration,
      ease: "none",
      onStart: () => {
        console.log('🎬 Phase 3 START: Mask moving (Duration: ' + phase3Duration + ')');
      },
      onComplete: () => {
        console.log('✅ Phase 3 COMPLETE: MEETUS in position');
      }
    }, 5.0);
    
    // Phase 4: Scale SVG from transform origin (75% - 100%)
    // Start time adjusts based on Phase 3 duration
    const phase4StartTime = 5.0 + phase3Duration;
    console.log('🎯 Phase 4 will start at:', phase4StartTime);
    
    combinedTl.to(meetSvg, {
      scale: maskScaleValue,
      duration: 3.5,
      ease: "power2.inOut",
      immediateRender: false,
      onStart: () => {
        const origin = isMobileDevice ? '90% center' : '80% center';
        console.log(`🎬 Phase 4 START: Scaling from ${origin}`);
        if (meetMaskBox) {
          meetMaskBox.style.visibility = "visible";
        }
      },
      onComplete: () => {
        if (meetMaskBox) {
          gsap.set(meetMaskBox, { visibility: "hidden" });
        }
        console.log('✅ Phase 4 COMPLETE: Scale done');
      },
      onUpdate: function() {
        if (meetMaskBox && meetMaskBox.style.visibility === "hidden") {
          meetMaskBox.style.visibility = "visible";
        }
      },
      onReverseComplete: () => {
        if (meetMaskBox) {
          gsap.set(meetMaskBox, { 
            visibility: "visible",
            opacity: 1
          });
        }
        if (meetSvg) {
          gsap.set(meetSvg, {
            scale: 1
          });
        }
        console.log('🔄 Phase 4 REVERSED');
      }
    }, phase4StartTime);
    
    console.log('✅ Work Grid + Meet Section initialized!');
    console.log('📱 Mobile Phase 3 Duration:', isMobileDevice ? '15.0 (SLOW)' : '3.5 (Normal)');
  } else {
    console.error('❌ Required elements not found');
  }
}


// ===================================
  // 6. COUNTER SECTION
  // ===================================
  const counterSection = document.querySelector('.counter-section');
  if (counterSection) {
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === counterSection) trigger.kill();
    });
    
    const countBtn = document.querySelector('.count-btn');
    const numberBoxes = gsap.utils.toArray('.number-item-box');
    const waitlistTitle = document.querySelector('.waitlist-title');
    
    // Set initial states
    if (countBtn) {
      gsap.set(countBtn, { opacity: 0, y: 30 });
    }
    
    gsap.set(numberBoxes, { opacity: 0, y: 50 });
    
    numberBoxes.forEach(box => {
      const innerElements = box.querySelectorAll('.number-title, .number-sec');
      gsap.set(innerElements, { opacity: 0, y: 30 });
    });
    
    if (waitlistTitle) {
      gsap.set(waitlistTitle, { opacity: 0, y: 30 });
    }
    
    const counterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".counter-section",
        start: "top 60%",
        end: "bottom 95%",
        scrub: 1,
        id: "counter-section"
      }
    });

    // Animate each number-item-box one by one with faster delays
    numberBoxes.forEach((box, index) => {
      const baseDelay = index * 0.8; // Much faster - reduced from 1.5 to 0.8
      
      // Fade in the box container
      counterTimeline.to(box, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, baseDelay);
      
      // Get inner elements for this specific box
      const numberTitle = box.querySelector('.number-title');
      const numberSec = box.querySelector('.number-sec');
      
      // Animate number title
      if (numberTitle) {
        counterTimeline.to(numberTitle, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }, baseDelay + 0.2);
      }
      
// Animate number with counting effect
const numberElement = box.querySelector('.tips, .years, .country');
if (numberElement) {
  const targetValue = parseFloat(numberElement.textContent); // Changed from parseInt to parseFloat
  counterTimeline.from(numberElement, {
    innerText: 0,
    duration: 0.7,
    snap: { innerText: targetValue % 1 === 0 ? 1 : 0.1 }, // Snap to 0.1 for decimals, 1 for integers
    ease: "power1.out",
    onUpdate: function() {
      const currentValue = this.targets()[0].innerText;
      // Format based on whether it's a decimal or integer
      if (targetValue % 1 === 0) {
        numberElement.textContent = Math.ceil(currentValue);
      } else {
        numberElement.textContent = currentValue.toFixed(1);
      }
    }
  }, baseDelay + 0.3);
}
      
      // Animate number description
      if (numberSec) {
        counterTimeline.to(numberSec, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }, baseDelay + 0.5);
      }
    });

    // Animate waitlist title - starts when second box starts (0.8)
    if (waitlistTitle) {
      counterTimeline.to(waitlistTitle, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0.8);
    }

    // Animate button - starts slightly after waitlist title
    if (countBtn) {
      counterTimeline.to(countBtn, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 1.0);
    }
  }


  // ===================================
  // 7. CONTACT SECTION
  // ===================================
  function initSignaturePaths() {
    const letters = ["w", "r", "i", "z1", "a", "n", "b"];
    letters.forEach(letter => {
      const maskPath = document.querySelector(`#mask_${letter} path`);
      if (maskPath) {
        const length = maskPath.getTotalLength();
        maskPath.style.strokeDasharray = length;
        maskPath.style.strokeDashoffset = length;
        maskPath.style.animation = 'none';
        console.log(`Mask ${letter} initialized, length: ${length}`);
      } else {
        console.log(`Mask ${letter} NOT FOUND`);
      }
    });
  }

  const contactSection = document.querySelector('.contact-section');
  const contentBox = document.querySelector('.cnt-content-box');
  const bottomSvg = document.querySelector('.cnt-svg-box');
  const signWrapper = document.querySelector('.sign-wrapper');
  
  if (contactSection && contentBox) {
    initSignaturePaths();
    
    if (signWrapper) {
      gsap.set(signWrapper, { visibility: 'visible', opacity: 1 });
      console.log('Sign wrapper set to visible');
    }
    
    const contentElements = [
      '.max-width-xsmall',
      'h2.medium',
      '.icon-btn-wrapper',
      '.contact-info-wrapper'
    ];
    
    // Set initial states
    contentElements.forEach(selector => {
      const element = contentBox.querySelector(selector);
      if (element) {
        gsap.set(element, { opacity: 0, y: 50 });
      }
    });
    
    if (bottomSvg) {
      gsap.set(bottomSvg, { opacity: 0, y: 30 });
    }
    
    // Create timeline that plays once when triggered
    const masterTL = gsap.timeline({
      paused: true,
      onComplete: () => console.log('Contact animation complete')
    });
    
    // Animate content elements in sequence
    contentElements.forEach((selector, index) => {
      const element = contentBox.querySelector(selector);
      if (element) {
        masterTL.to(element,
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            ease: "power2.out" 
          },
          index * 0.15
        );
      }
    });
    
    // Animate signature letters
    const letters = ["w", "r", "i", "z1", "a", "n", "b"];
    
    letters.forEach((letter, index) => {
      const maskPath = document.querySelector(`#mask_${letter} path`);
      if (maskPath) {
        masterTL.to(maskPath,
          { 
            strokeDashoffset: 0, 
            duration: 0.4, 
            ease: "power1.inOut",
            onStart: () => console.log(`Drawing letter ${letter}`),
            onComplete: () => console.log(`Letter ${letter} complete`)
          },
          0.8 + (index * 0.1)
        );
      }
    });
    
    // Animate bottom SVG
    if (bottomSvg) {
      masterTL.to(bottomSvg,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        },
        1.5
      );
    }
    
    // Trigger the timeline when section enters viewport
    ScrollTrigger.create({
      trigger: contactSection,
      start: "top 70%",
      once: true,
      markers: false,
      onEnter: () => {
        console.log('Contact section entered - playing animation');
        masterTL.play();
      }
    });
    
  } else {
    console.log('Contact section or content box not found');
  }

  // ===================================
  // FINAL: Refresh ScrollTriggers
  // ===================================
  ScrollTrigger.refresh();
  console.log('All GSAP animations initialized successfully');
});

// ===================================
// TINYFLOW SLIDER (jQuery)
// ===================================
$(document).ready(function () {
  function getTranslateMultiplier() {
    const width = window.innerWidth;
    if (width <= 360) return 50;
    if (width <= 480) return 60;
    if (width <= 768) return 70;
    if (width <= 1024) return 75;
    return 75;
  }
  
  function isMobileDevice() {
    return window.innerWidth < 768;
  }

  const tinyflowMainSlider = new Swiper(".tinyflow-slider--main", {
    slidesPerView: "auto",
    centeredSlides: true,
    grabCursor: true,
    watchSlidesProgress: true,
    loop: true,
    speed: 500,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      waitForTransition: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    breakpoints: {
      320: {
        spaceBetween: 10,
        speed: 400,
      },
      480: {
        spaceBetween: 15,
        speed: 450,
      },
      768: {
        spaceBetween: 20,
        speed: 500,
      },
      1024: {
        spaceBetween: 30,
        speed: 500,
      }
    },
    on: {
      beforeInit: function (swiper) {
        swiper.el.style.setProperty(
          "--animation-duration",
          swiper.params.autoplay.delay
        );
      },
      init: function(swiper) {
        const navButtons = swiper.el.querySelectorAll('.swiper-button-next::after, .swiper-button-prev::after');
        navButtons.forEach(btn => {
          if (btn) btn.style.display = 'none';
        });
      },
      progress(swiper) {
        const isMobile = isMobileDevice();
        const translateMultiplier = getTranslateMultiplier();
        
        swiper.slides.forEach(eachSlideElement => {
          const currentSlideProgress = eachSlideElement.progress;
          const absProgress = Math.abs(currentSlideProgress);
          
          if (isMobile) {
            // Mobile: Show only active slide, hide others completely
            if (absProgress < 0.1) {
              // Active slide
              eachSlideElement.style.transform = 'translateX(0%) scale(1)';
              eachSlideElement.style.opacity = 1;
              eachSlideElement.style.zIndex = 100;
              eachSlideElement.style.visibility = 'visible';
              
              const contentNodes = eachSlideElement.querySelectorAll(".card-content");
              contentNodes.forEach(node => {
                node.style.opacity = 1;
              });
            } else {
              // Hide all non-active slides
              eachSlideElement.style.opacity = 0;
              eachSlideElement.style.visibility = 'hidden';
              eachSlideElement.style.zIndex = 1;
              
              const contentNodes = eachSlideElement.querySelectorAll(".card-content");
              contentNodes.forEach(node => {
                node.style.opacity = 0;
              });
            }
          } else {
            // Desktop: Original carousel effect
            let fixedProgress = 1;
            if (absProgress > 1) {
              fixedProgress = (absProgress - 1) * 0.3 + 1;
            }
            
            const translate = `${currentSlideProgress * fixedProgress * translateMultiplier}%`;
            const scale = 1;
            
            eachSlideElement.style.transform = `translateX(${translate}) scale(${scale})`;
            eachSlideElement.style.zIndex = swiper.slides.length - Math.abs(Math.round(currentSlideProgress));
            eachSlideElement.style.visibility = 'visible';
            
            if (absProgress > 2) {
              eachSlideElement.style.opacity = 0;
            } else if (absProgress > 1.5) {
              eachSlideElement.style.opacity = 1 - (absProgress - 1.5) * 2;
            } else {
              eachSlideElement.style.opacity = 1;
            }
            
            const contentNodes = eachSlideElement.querySelectorAll(".card-content");
            contentNodes.forEach(node => {
              node.style.opacity = Math.max(0, 1 - absProgress * 0.8);
            });
          }
        });
      },
      setTransition(swiper, duration) {
        swiper.slides.forEach(eachSlideElement => {
          eachSlideElement.style.transitionDuration = `${duration}ms`;
          const contentNodes = eachSlideElement.querySelectorAll(".card-content");
          contentNodes.forEach(node => {
            node.style.transitionDuration = `${duration}ms`;
          });
        });
      },
      resize(swiper) {
        swiper.update();
      }
    },
  });
  
  let resizeTimer;
  $(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (tinyflowMainSlider) {
        tinyflowMainSlider.update();
      }
    }, 250);
  });
});
