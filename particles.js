/**
 * ============================================
 * SPECIMEN: LEAK-WORM-EROI
 * ORGAN: ATMOSPHERIC DRIFT MECHANISM
 * RETRIEVAL: February 2026, Tlönian Research Facility
 * ============================================
 * 
 * STATUS: Operational - v2.5
 * FUNCTION: Environmental particle system
 * DEPENDENCIES: decay-core.js, beam.js
 * ============================================
 */

class ParticleDrift {
  constructor() {
    this.root = document.documentElement;
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const particleMultiplier = this.isMobile ? 0.6 : 1.0;
    
    this.layers = {
      far: { 
        count: Math.floor(25 * particleMultiplier),
        sizeRange: [1.5, 3],
        blurRange: [3, 5],
        speed: 60,
        field: null
      },
      mid: { 
        count: Math.floor(18 * particleMultiplier),
        sizeRange: [2, 4],
        blurRange: [1, 2],
        speed: 35,
        field: null
      },
      near: { 
        count: Math.floor(7 * particleMultiplier),
        sizeRange: [3, 5],
        blurRange: [0, 0.5],
        speed: 15,
        field: null
      }
    };
    
    this.decayState = 'healthy';
  }
  
  init() {
    this.createParticleFields();
    this.createAllParticles();
    
    if (window.decay) {
      window.decay.subscribe((stage, progress) => {
        this.syncToDecay(stage, progress);
      });
    }
    
    if (window.beam) {
      this.integrateWithBeam();
    }
  }
  
  createParticleFields() {
    const container = document.createElement('div');
    container.className = 'particle-container';
    container.innerHTML = `
      <div class="particle-field" id="particles-far"></div>
      <div class="particle-field" id="particles-mid"></div>
      <div class="particle-field" id="particles-near"></div>
    `;
    document.body.appendChild(container);
    
    this.layers.far.field = document.getElementById('particles-far');
    this.layers.mid.field = document.getElementById('particles-mid');
    this.layers.near.field = document.getElementById('particles-near');
  }
  
  createAllParticles() {
    Object.entries(this.layers).forEach(([name, layer]) => {
      this.createLayerParticles(name, layer);
    });
  }
  
  createLayerParticles(name, layer) {
    layer.field.innerHTML = '';
    
    for (let i = 0; i < layer.count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.dataset.layer = name;
      
      const x = this.gaussianRandom(50, 20);
      particle.style.left = Math.max(5, Math.min(95, x)) + '%';
      
      const size = layer.sizeRange[0] + 
                   Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]);
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      const blur = layer.blurRange[0] + 
                  Math.random() * (layer.blurRange[1] - layer.blurRange[0]);
      particle.style.filter = `blur(${blur}px)`;
      particle.dataset.baseBlur = blur;
      
      const delay = -Math.random() * layer.speed;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${layer.speed}s`;
      
      layer.field.appendChild(particle);
    }
  }
  
  gaussianRandom(mean, stdDev) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z0 * stdDev;
  }
  
  syncToDecay(stage, progress) {
    this.decayState = stage;
    
    const opacityMultipliers = {
      healthy: 1.0,
      panic: 0.8,
      decay: 0.5,
      death: 0.2
    };
    
    const multiplier = opacityMultipliers[stage] || 1.0;
    this.root.style.setProperty('--particle-decay-multiplier', multiplier);
    
    if (stage === 'decay') {
      this.fadeOutRandomParticles(0.4);
    } else if (stage === 'death') {
      this.fadeOutRandomParticles(0);
    }
  }
  
  fadeOutRandomParticles(targetRatio) {
    Object.values(this.layers).forEach(layer => {
      const particles = layer.field.querySelectorAll('.particle');
      const targetCount = Math.floor(particles.length * targetRatio);
      
      particles.forEach((p, i) => {
        if (i >= targetCount) {
          p.style.transition = 'opacity 2s ease-out';
          p.style.opacity = '0';
        }
      });
    });
  }
  
  integrateWithBeam() {
    if (!window.beam || !window.beam.body) return;
    
    setInterval(() => {
      const beamBody = window.beam.body;
      if (!beamBody) return;
      
      const beamRect = beamBody.getBoundingClientRect();
      const beamY = beamRect.top + beamRect.height / 2;
      
      document.querySelectorAll('.particle').forEach(particle => {
        const rect = particle.getBoundingClientRect();
        const particleY = rect.top + rect.height / 2;
        const distance = Math.abs(beamY - particleY);
        
        const layer = particle.dataset.layer;
        const range = layer === 'far' ? 120 : 
                     layer === 'mid' ? 90 : 60;
        
        if (distance < range) {
          const intensity = 1 - (distance / range);
          particle.classList.add('beam-revealed');
          
          const baseBlur = parseFloat(particle.dataset.baseBlur) || 0;
          const brightness = 1 + (intensity * 0.8);
          particle.style.filter = `blur(${baseBlur}px) brightness(${brightness})`;
          
        } else {
          particle.classList.remove('beam-revealed');
          const baseBlur = parseFloat(particle.dataset.baseBlur) || 0;
          particle.style.filter = `blur(${baseBlur}px)`;
        }
      });
    }, 40);
  }
  
  destroy() {
    const container = document.querySelector('.particle-container');
    if (container) container.remove();
  }
}

if (typeof CONFIG === 'undefined') {
  console.error('❌ particles.js requires config.js');
}
if (typeof decay === 'undefined') {
  console.error('❌ particles.js requires decay-core.js');
}
