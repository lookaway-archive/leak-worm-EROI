/**
 * ============================================
 * SPECIMEN: LEAK-WORM-EROI
 * ORGAN: ORGANISM CONSTANTS ARCHIVE
 * RETRIEVAL: February 2026, Tlönian Research Facility
 * ============================================
 * 
 * STATUS: Operational
 * FUNCTION: Central nervous system constants
 * DEPENDENCIES: None (primary organ)
 * 
 * SURGICAL NOTES:
 * Identical metabolic timing to LEAK-WORM-847T.
 * 32-second lifecycle from birth to natural death.
 * Same decay stages: healthy → panic → decay → death.
 * Pirate mode transitions to ocean consciousness.
 * ============================================
 */

const CONFIG = {
  
  // ==========================================
  // LIFECYCLE DNA — Metabolic timing sequences
  // ==========================================
  
  timings: {
    standard: {
      healthy: 24000,  // 24s - Stable phosphorescence
      panic: 3000,     // 3s - Crisis response  
      decay: 3000,     // 3s - Cellular breakdown
      death: 2000,     // 2s - Final discharge
      total: 32000,    // 32s - Complete lifecycle
      opacityMultiplier: 1.0
    },
    
    pirate: {
      fadeOutDuration: 3000,
      colorShiftDuration: 7000,
      fadeInDuration: 2000,
      opacityMultiplier: 1.2
    }
  },
  
  // ==========================================
  // CHROMATIC GENETICS — Phosphor emission spectra
  // ==========================================
  
  colors: {
    healthy: {
      core: { r: 122, g: 31, b: 8 },
      glow: { r: 255, g: 107, b: 43 },
      text: { r: 255, g: 120, b: 70 },
      textOpacity: 1.0
    },
    
    panic: {
      core: { r: 138, g: 10, b: 2 },
      glow: { r: 255, g: 60, b: 30 },
      text: { r: 255, g: 90, b: 50 },
      textOpacity: 1.0
    },
    
    decay: {
      core: { r: 74, g: 58, b: 26 },
      glow: { r: 100, g: 100, b: 80 },
      text: { r: 120, g: 105, b: 80 },
      textOpacity: 0.7
    },
    
    death: {
      core: { r: 40, g: 40, b: 35 },
      glow: { r: 60, g: 60, b: 55 },
      text: { r: 80, g: 80, b: 75 },
      textOpacity: 0.0
    },
    
    pirate: {
      core: { r: 0, g: 20, b: 40 },
      glow: { r: 0, g: 200, b: 255 },
      text: { r: 220, g: 240, b: 255 },
      textOpacity: 0.0
    }
  },
  
  // ==========================================
  // RESPIRATORY RHYTHM — Opacity pulsation
  // ==========================================
  
  breathing: {
    healthy: { speed: 6, opacityMin: 0.7, opacityMax: 0.85 },
    panic: { speed: 3, opacityMin: 0.5, opacityMax: 0.95 },
    decay: { speed: 12, opacityMin: 0.3, opacityMax: 0.5 },
    death: { speed: 0, opacityMin: 0.2, opacityMax: 0.2 },
    pirate: { speed: 8, opacityMin: 0.7, opacityMax: 0.9 }
  },
  
  // ==========================================
  // PERIPHERAL VISION DECAY — Vignette
  // ==========================================
  
  vignette: {
    healthy: { radius: 85, opacity: 0.02 },
    panic: { radius: 65, opacity: 0.15 },
    decay: { radius: 50, opacity: 0.4 },
    death: { radius: 40, opacity: 0.6 },
    pirate: { radius: 75, opacity: 0.35 }
  },
  
  // ==========================================
  // SCAN LINES — CRT refresh rate
  // ==========================================
  
  scanlines: {
    healthy: { opacity: 0.1, speed: 2.5 },
    panic: { opacity: 0.45, speed: 1.5 },
    decay: { opacity: 0.20, speed: 5 },
    death: { opacity: 0.2, speed: 12 },
    pirate: { opacity: 0.25, speed: 3 }
  },
  
  // ==========================================
  // OPTICAL DETERIORATION — Focus blur
  // ==========================================
  
  blur: {
    healthy: { title: 0.3, text: 0.2, pirate: 0.2 },
    panic: { title: 0.5, text: 0.4, pirate: 0.15 },
    decay: { title: 2.5, text: 2.2, pirate: 1.2 },
    death: { title: 8.0, text: 8.0, pirate: 8.0 },
    pirate: { title: 8.0, text: 8.0, pirate: 8.0 }
  },
  
  // ==========================================
  // PHOSPHOR GLOW — Text shadow emission
  // ==========================================
  
  textShadow: {
    healthy: { spread: 40, intensity: 0.3 },
    panic: { spread: 60, intensity: 0.6 },
    decay: { spread: 10, intensity: 0.1 },
    death: { spread: 5, intensity: 0.05 },
    pirate: { spread: 50, intensity: 0.5 }
  },
  
  // ==========================================
  // POWER FLUCTUATION — Voltage instability
  // ==========================================
  
  flicker: {
    healthy: { speed: 0.3, brightness: 1.0 },
    panic: { speed: 0.15, brightness: 0.95 },
    decay: { speed: 0.08, brightness: 0.85 },
    death: { speed: 0.04, brightness: 0.7 },
    pirate: { speed: 0.05, brightness: 0.75 }
  },
  
  // ==========================================
  // SENSORY RESPONSE — User interaction
  // ==========================================
  
  interaction: {
    resetEvents: ['scroll', 'mousemove', 'click', 'touchstart', 'keydown'],
    throttleMs: 100
  }
};

// HELPER FUNCTIONS
CONFIG.getCurrentTimings = function() {
  return this.timings.standard;
};

CONFIG.getTotalLifespan = function() {
  return this.timings.standard.total;
};
