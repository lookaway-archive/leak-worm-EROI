/**
 * ============================================
 * SPECIMEN: LEAK-WORM-EROI
 * ORGAN: LIFECYCLE CONTROLLER
 * RETRIEVAL: February 2026, Tlönian Research Facility
 * ============================================
 * 
 * STATUS: Operational - v3.6
 * FUNCTION: Organism heartbeat - regulates metabolic phases
 * DEPENDENCIES: config.js
 * ============================================
 */

const decay = {
  
  stage: 'healthy',
  progress: 0,
  lastInteraction: null,
  timer: null,
  listeners: [],
  isDead: false,
  isTransitioning: false,
  transitionStartTime: null,
  transitionDuration: null,
  transitionCallback: null,
  transitionToStage: null,
  previousStage: null,
  
  start() {
    this.isDead = false;
    this.isTransitioning = false;
    this.lastInteraction = Date.now();
    this.timer = setInterval(() => this.update(), 100);
    this.notify();
  },
  
  reset() {
    if (this.isDead || this.isTransitioning) return;
    this.lastInteraction = Date.now();
  },
  
  update() {
    if (this.isTransitioning) {
      this.updateTransition();
      return;
    }
    
    if (this.isDead) return;
    
    const elapsed = Date.now() - this.lastInteraction;
    const timing = CONFIG.timings.standard;
    const oldStage = this.stage;
    
    if (elapsed < timing.healthy) {
      this.stage = 'healthy';
      this.progress = elapsed / timing.healthy;
      
    } else if (elapsed < timing.healthy + timing.panic) {
      this.stage = 'panic';
      const timeInPanic = elapsed - timing.healthy;
      this.progress = timeInPanic / timing.panic;
      
    } else if (elapsed < timing.healthy + timing.panic + timing.decay) {
      this.stage = 'decay';
      const timeInDecay = elapsed - timing.healthy - timing.panic;
      this.progress = timeInDecay / timing.decay;
      
    } else if (elapsed < timing.healthy + timing.panic + timing.decay + timing.death) {
      this.stage = 'death';
      const timeInDeath = elapsed - timing.healthy - timing.panic - timing.decay;
      this.progress = timeInDeath / timing.death;
      
      if (this.progress >= 1.0) {
        this.beginDeath();
        return;
      }
      
    } else {
      this.beginDeath();
      return;
    }
    
    this.notify();
  },
  
  startTransition(toStage, duration, onComplete) {
    this.previousStage = this.stage;
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    this.isTransitioning = true;
    this.transitionStartTime = Date.now();
    this.transitionDuration = duration;
    this.transitionToStage = toStage;
    this.transitionCallback = onComplete;
    
    this.timer = setInterval(() => this.updateTransition(), 100);
  },
  
  updateTransition() {
    const elapsed = Date.now() - this.transitionStartTime;
    this.progress = Math.min(elapsed / this.transitionDuration, 1.0);
    this.stage = this.transitionToStage;
    
    this.notify();
    
    if (this.progress >= 1.0) {
      clearInterval(this.timer);
      this.timer = null;
      this.isTransitioning = false;
      
      const callback = this.transitionCallback;
      this.transitionCallback = null;
      
      if (callback) {
        callback();
      }
    }
  },
  
  beginDeath() {
    if (this.isDead) return;
    
    const timing = CONFIG.timings.standard;
    const deathDuration = timing.death || 2000;
    
    setTimeout(() => {
      const pageContainer = document.getElementById('pageContainer');
      if (pageContainer) {
        pageContainer.style.display = 'none';
      }
      
      if (window.prepareDeathScreen) {
        window.prepareDeathScreen();
      }
    }, deathDuration * 0.75);
    
    this.startTransition('death', deathDuration, () => {
      this.isDead = true;
    });
  },
  
  enterPirateMode(onFadeComplete) {
    const fadeOutDuration = CONFIG.timings.pirate.fadeOutDuration || 3000;
    const fullDuration = CONFIG.timings.pirate.colorShiftDuration || 7000;
    
    this.startTransition('pirate', fullDuration, () => {
      this.isDead = true;
      
      const pageContainer = document.getElementById('pageContainer');
      if (pageContainer) {
        pageContainer.style.display = 'none';
      }
    });
    
    setTimeout(() => {
      if (onFadeComplete) {
        onFadeComplete();
      }
    }, fadeOutDuration);
  },
  
  subscribe(callback) {
    if (typeof callback !== 'function') return;
    this.listeners.push(callback);
  },
  
  notify() {
    this.listeners.forEach(callback => {
      try {
        callback(this.stage, this.progress);
      } catch (error) {}
    });
  },
  
  setStage(stage, progress = 0) {
    this.stage = stage;
    this.progress = progress;
    this.notify();
  },
  
  pause() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  
  resume() {
    if (!this.timer && !this.isDead && !this.isTransitioning) {
      this.timer = setInterval(() => this.update(), 100);
    }
  },
  
  destroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.listeners = [];
    this.isDead = false;
    this.isTransitioning = false;
  }
};

if (typeof CONFIG === 'undefined') {
  console.error('❌ decay-core.js requires config.js');
}
