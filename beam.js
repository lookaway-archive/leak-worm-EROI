/**
 * ============================================
 * SPECIMEN: LEAK-WORM-EROI
 * ORGAN: ELECTRON SENSORY SYSTEM
 * RETRIEVAL: February 2026, Tlönian Research Facility
 * ============================================
 * 
 * STATUS: Operational - v2.9
 * FUNCTION: Primary vision apparatus - electron beam scanning
 * DEPENDENCIES: decay-core.js, config.js
 * ============================================
 */

class BeamModule {
  constructor() {
    this.system = null;
    this.body = null;
    this.glow = null;
    this.hotspot = null;
    this.root = document.documentElement;
    this.isPaused = false;
    this.collisionCheckInterval = null;
    this.currentSpeed = 8;
  }
  
  init() {
    this.createBeamElements();
    this.setRandomStart();
    this.startCollisionDetection();
    
    if (window.decay) {
      window.decay.subscribe((stage, progress) => {
        this.syncToDecay(stage, progress);
      });
    }
  }
  
  createBeamElements() {
    const container = document.createElement('div');
    container.className = 'beam-system';
    container.id = 'beamSystem';
    container.innerHTML = `
      <div class="beam-glow" id="beamGlow"></div>
      <div class="beam-body" id="beamBody"></div>
      <div class="beam-hotspot" id="beamHotspot"></div>
    `;
    
    document.body.appendChild(container);
    
    this.system = document.getElementById('beamSystem');
    this.body = document.getElementById('beamBody');
    this.glow = document.getElementById('beamGlow');
    this.hotspot = document.getElementById('beamHotspot');
  }
  
  setRandomStart() {
    const startPercent = Math.random() * 0.5;
    this.root.style.setProperty('--beam-start-position', `-${startPercent * 100}%`);
    
    const delay = Math.random() * -this.currentSpeed;
    [this.body, this.glow, this.hotspot].forEach(el => {
      el.style.animationDelay = `${delay}s`;
    });
  }
  
  syncToDecay(stage, progress) {
    const speeds = {
      healthy: 8,
      panic: 5,
      decay: 15,
      death: 0,
      pirate: 8
    };
    
    const newSpeed = speeds[stage] || 8;
    
    if (newSpeed !== this.currentSpeed) {
      this.currentSpeed = newSpeed;
      this.root.style.setProperty('--beam-speed', newSpeed + 's');
      
      if (stage === 'death') {
        this.pause();
      }
    }
  }
  
  startCollisionDetection() {
    const isMobile = window.innerWidth < 768;
    const checkInterval = isMobile ? 50 : 25;
    
    this.collisionCheckInterval = setInterval(() => {
      if (this.isPaused || !this.body) return;
      
      const beamRect = this.body.getBoundingClientRect();
      const beamY = beamRect.top + beamRect.height / 2;
      
      const buffer = isMobile ? 100 : 200;
      const viewportTop = window.scrollY - buffer;
      const viewportBottom = window.scrollY + window.innerHeight + buffer;
      
      // Updated selectors for EROI content
      const targets = document.querySelectorAll(
        '.section-title, .section-subtitle, ' +
        '.header-facility, .header-reference, .header-title, .header-format, .header-meta, .header-pattern, ' +
        '.pattern-term, .pattern-list p, ' +
        '.sub-subtitle, .emphasis, .emphasis-block, ' +
        '.reward-header, .reward-title, .reward-subtitle, ' +
        '.footer-tag, .footer-credit, .reward-dot, .blink-dot'
      );
      
      let hitSomething = false;
      
      targets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        
        if (elementTop < viewportTop || elementTop > viewportBottom) {
          return;
        }
        
        const targetY = rect.top + rect.height / 2;
        const minHeight = 20;
        const effectiveHeight = Math.max(rect.height, minHeight);
        const padding = (effectiveHeight - rect.height) / 2;
        
        const topBound = rect.top - padding;
        const bottomBound = rect.bottom + padding;
        const isInBounds = beamY >= topBound && beamY <= bottomBound;
        const distance = Math.abs(beamY - targetY);
        
        if (isInBounds && distance < 40) {
          this.glow.classList.add('approaching');
          target.classList.add('beam-approaching');
          
          if (distance < Math.max(10, rect.height / 2)) {
            target.classList.add('beam-contact');
            this.hotspot.classList.add('active');
            hitSomething = true;
          } else {
            target.classList.remove('beam-contact');
          }
        } else {
          target.classList.remove('beam-contact', 'beam-approaching');
        }
      });
      
      if (!hitSomething) {
        this.hotspot.classList.remove('active');
        this.glow.classList.remove('approaching');
      }
    }, checkInterval);
  }
  
  pause() {
    this.isPaused = true;
    [this.body, this.glow, this.hotspot].forEach(el => {
      if (el) el.style.animationPlayState = 'paused';
    });
  }
  
  resume() {
    this.isPaused = false;
    [this.body, this.glow, this.hotspot].forEach(el => {
      if (el) el.style.animationPlayState = 'running';
    });
  }
  
  destroy() {
    if (this.collisionCheckInterval) {
      clearInterval(this.collisionCheckInterval);
    }
    if (this.system) {
      this.system.remove();
    }
  }
}

if (typeof CONFIG === 'undefined') {
  console.error('❌ beam.js requires config.js');
}
if (typeof decay === 'undefined') {
  console.error('❌ beam.js requires decay-core.js');
}
