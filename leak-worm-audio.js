/**
 * ============================================
 * LEAK-WORM-EROI AUDIO MODULE v1.1
 * Adapted from: LEAK-WORM-847T
 * ============================================
 */

class LeakWormAudio {
    constructor() {
        this.volumeLevel = 1;
        this.context = null;
        this.nodes = {};
        this.ready = false;
        this.baseVolume = 0.04;
        this.currentStage = 'healthy';
        this.isDeathSequence = false;
        this.isPirateMode = false;
        this.baseBeamGain = 0.015;
    }
    
    async init() {
        if (this.context) {
            if (this.context.state === 'suspended') {
                await this.context.resume();
            }
            return true;
        }
        
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.nodes.masterGain = this.context.createGain();
            this.nodes.masterGain.connect(this.context.destination);
            this.ready = true;
            return true;
        } catch (error) {
            return false;
        }
    }
    
    setupCRTHum() {
        this.cleanupCRTHum();
        if (this.isDeathSequence || this.isPirateMode) return;
        
        this.nodes.hum = this.context.createOscillator();
        this.nodes.humGain = this.context.createGain();
        this.nodes.hum.type = 'sine';
        this.nodes.hum.frequency.value = 60;
        
        this.nodes.harmonic2 = this.context.createOscillator();
        this.nodes.harmonic2Gain = this.context.createGain();
        this.nodes.harmonic2.type = 'sine';
        this.nodes.harmonic2.frequency.value = 120;
        
        this.nodes.harmonic3 = this.context.createOscillator();
        this.nodes.harmonic3Gain = this.context.createGain();
        this.nodes.harmonic3.type = 'sine';
        this.nodes.harmonic3.frequency.value = 180;
        
        const volumeMultipliers = [0, 0.3, 0.6, 1.0];
        const baseLevel = this.baseVolume * volumeMultipliers[this.volumeLevel];
        
        this.nodes.humGain.gain.value = baseLevel;
        this.nodes.harmonic2Gain.gain.value = baseLevel * 0.3;
        this.nodes.harmonic3Gain.gain.value = baseLevel * 0.15;
        
        this.nodes.hum.connect(this.nodes.humGain);
        this.nodes.humGain.connect(this.nodes.masterGain);
        this.nodes.harmonic2.connect(this.nodes.harmonic2Gain);
        this.nodes.harmonic2Gain.connect(this.nodes.masterGain);
        this.nodes.harmonic3.connect(this.nodes.harmonic3Gain);
        this.nodes.harmonic3Gain.connect(this.nodes.masterGain);
        
        this.nodes.hum.start();
        this.nodes.harmonic2.start();
        this.nodes.harmonic3.start();
    }
    
    cleanupCRTHum() {
        ['hum', 'harmonic2', 'harmonic3'].forEach(name => {
            if (this.nodes[name]) {
                try { this.nodes[name].stop(); this.nodes[name].disconnect(); } catch (e) {}
                this.nodes[name] = null;
            }
        });
        ['humGain', 'harmonic2Gain', 'harmonic3Gain'].forEach(name => {
            if (this.nodes[name]) {
                try { this.nodes[name].disconnect(); } catch (e) {}
                this.nodes[name] = null;
            }
        });
    }
    
    setupSchumannHum() {
        this.cleanupSchumannHum();
        
        this.nodes.schumannCarrier = this.context.createOscillator();
        this.nodes.schumannGain = this.context.createGain();
        this.nodes.schumannCarrier.type = 'sine';
        this.nodes.schumannCarrier.frequency.value = 62.64;
        
        this.nodes.schumannLFO = this.context.createOscillator();
        this.nodes.schumannLFOGain = this.context.createGain();
        this.nodes.schumannLFO.type = 'sine';
        this.nodes.schumannLFO.frequency.value = 7.83;
        this.nodes.schumannLFOGain.gain.value = 3;
        
        this.nodes.schumannLFO.connect(this.nodes.schumannLFOGain);
        this.nodes.schumannLFOGain.connect(this.nodes.schumannCarrier.frequency);
        
        const volumeMultipliers = [0, 0.3, 0.6, 1.0];
        const baseLevel = this.baseVolume * volumeMultipliers[this.volumeLevel];
        this.nodes.schumannGain.gain.value = baseLevel * 1.8;
        
        this.nodes.schumannHarmonic = this.context.createOscillator();
        this.nodes.schumannHarmonicGain = this.context.createGain();
        this.nodes.schumannHarmonic.type = 'sine';
        this.nodes.schumannHarmonic.frequency.value = 125.28;
        this.nodes.schumannHarmonicGain.gain.value = baseLevel * 0.6;
        
        this.nodes.schumannCarrier.connect(this.nodes.schumannGain);
        this.nodes.schumannGain.connect(this.nodes.masterGain);
        this.nodes.schumannHarmonic.connect(this.nodes.schumannHarmonicGain);
        this.nodes.schumannHarmonicGain.connect(this.nodes.masterGain);
        
        this.nodes.schumannLFO.start();
        this.nodes.schumannCarrier.start();
        this.nodes.schumannHarmonic.start();
    }
    
    cleanupSchumannHum() {
        ['schumannCarrier', 'schumannLFO', 'schumannHarmonic'].forEach(name => {
            if (this.nodes[name]) {
                try { this.nodes[name].stop(); this.nodes[name].disconnect(); } catch (e) {}
                this.nodes[name] = null;
            }
        });
        ['schumannGain', 'schumannLFOGain', 'schumannHarmonicGain'].forEach(name => {
            if (this.nodes[name]) {
                try { this.nodes[name].disconnect(); } catch (e) {}
                this.nodes[name] = null;
            }
        });
    }
    
    setVolumeLevel(level) {
        this.volumeLevel = level;
        if (this.volumeLevel === 0) {
            this.cleanupCRTHum();
            this.cleanupSchumannHum();
            this.cleanupBeam();
        } else {
            if (this.isPirateMode && !this.nodes.schumannCarrier) {
                this.setupSchumannHum();
            } else if (!this.isPirateMode && !this.isDeathSequence && !this.nodes.hum) {
                this.setupCRTHum();
            } else {
                this.updateHumVolumes();
            }
        }
    }
    
    updateHumVolumes() {
        const volumeMultipliers = [0, 0.3, 0.6, 1.0];
        const targetVolume = this.baseVolume * volumeMultipliers[this.volumeLevel];
        
        if (this.nodes.humGain) {
            this.nodes.humGain.gain.exponentialRampToValueAtTime(Math.max(0.001, targetVolume), this.context.currentTime + 0.1);
        }
        if (this.nodes.harmonic2Gain) {
            this.nodes.harmonic2Gain.gain.exponentialRampToValueAtTime(Math.max(0.001, targetVolume * 0.3), this.context.currentTime + 0.1);
        }
        if (this.nodes.harmonic3Gain) {
            this.nodes.harmonic3Gain.gain.exponentialRampToValueAtTime(Math.max(0.001, targetVolume * 0.15), this.context.currentTime + 0.1);
        }
        if (this.nodes.schumannGain) {
            this.nodes.schumannGain.gain.exponentialRampToValueAtTime(Math.max(0.001, targetVolume * 1.8), this.context.currentTime + 0.1);
        }
        if (this.nodes.schumannHarmonicGain) {
            this.nodes.schumannHarmonicGain.gain.exponentialRampToValueAtTime(Math.max(0.001, targetVolume * 0.6), this.context.currentTime + 0.1);
        }
    }
    
    syncToDecayStage(stage, progress) {
        this.currentStage = stage;
        if (stage === 'death' && !this.isDeathSequence) {
            this.beginDeath();
            return;
        }
        if (stage === 'pirate' && !this.isPirateMode) return;
        if (!this.ready || this.volumeLevel === 0 || this.isDeathSequence || this.isPirateMode) return;
        
        const stageMap = {
            healthy: { freq: 60, volume: 1.0 },
            panic: { freq: 57, volume: 0.85 },
            decay: { freq: 52, volume: 0.6 }
        };
        
        const config = stageMap[stage] || stageMap.healthy;
        
        if (this.nodes.hum) {
            this.nodes.hum.frequency.exponentialRampToValueAtTime(config.freq, this.context.currentTime + 0.5);
        }
        if (this.nodes.harmonic2) {
            this.nodes.harmonic2.frequency.exponentialRampToValueAtTime(config.freq * 2, this.context.currentTime + 0.5);
        }
        if (this.nodes.harmonic3) {
            this.nodes.harmonic3.frequency.exponentialRampToValueAtTime(config.freq * 3, this.context.currentTime + 0.5);
        }
        
        const volumeMultipliers = [0, 0.3, 0.6, 1.0];
        const baseLevel = this.baseVolume * volumeMultipliers[this.volumeLevel];
        const modulated = baseLevel * config.volume;
        
        if (this.nodes.humGain) {
            this.nodes.humGain.gain.exponentialRampToValueAtTime(Math.max(0.001, modulated), this.context.currentTime + 0.5);
        }
        if (this.nodes.harmonic2Gain) {
            this.nodes.harmonic2Gain.gain.exponentialRampToValueAtTime(Math.max(0.001, modulated * 0.3), this.context.currentTime + 0.5);
        }
        if (this.nodes.harmonic3Gain) {
            this.nodes.harmonic3Gain.gain.exponentialRampToValueAtTime(Math.max(0.001, modulated * 0.15), this.context.currentTime + 0.5);
        }
    }
    
    syncDecayVisuals(stage, progress) {
        const audioBtn = document.getElementById('audio-toggle');
        if (!audioBtn) return;
        
        if (stage === 'healthy') {
            audioBtn.style.filter = 'blur(0.03px)';
            audioBtn.style.opacity = '0.7';
        } else if (stage === 'panic') {
            audioBtn.style.filter = 'brightness(0.95) blur(0.05px)';
            audioBtn.style.opacity = '0.65';
        } else if (stage === 'decay') {
            audioBtn.style.filter = 'hue-rotate(15deg) brightness(0.75) blur(0.6px)';
            audioBtn.style.opacity = '0.55';
        } else if (stage === 'death') {
            audioBtn.style.filter = 'brightness(0) blur(10px)';
            audioBtn.style.opacity = '0';
        } else if (stage === 'pirate') {
            audioBtn.style.filter = 'hue-rotate(180deg) brightness(1.1) saturate(1.3) blur(0px)';
            audioBtn.style.opacity = '0.8';
        }
    }
    
    beginDeath() {
        if (!this.ready || this.volumeLevel === 0 || this.isDeathSequence) return;
        this.isDeathSequence = true;
        
        if (this.nodes.humGain) {
            const currentGain = this.nodes.humGain.gain.value;
            this.nodes.humGain.gain.setValueAtTime(currentGain, this.context.currentTime);
            this.nodes.humGain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 2);
        }
        if (this.nodes.harmonic2Gain) {
            const currentGain = this.nodes.harmonic2Gain.gain.value;
            this.nodes.harmonic2Gain.gain.setValueAtTime(currentGain, this.context.currentTime);
            this.nodes.harmonic2Gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 2);
        }
        if (this.nodes.harmonic3Gain) {
            const currentGain = this.nodes.harmonic3Gain.gain.value;
            this.nodes.harmonic3Gain.gain.setValueAtTime(currentGain, this.context.currentTime);
            this.nodes.harmonic3Gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 2);
        }
        if (this.nodes.beamGain) {
            const currentGain = this.nodes.beamGain.gain.value;
            this.nodes.beamGain.gain.setValueAtTime(currentGain, this.context.currentTime);
            this.nodes.beamGain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 1.5);
        }
        
        setTimeout(() => {
            this.cleanupCRTHum();
            this.cleanupBeam();
        }, 2500);
    }
    
    beginPirateTransition(duration = 7000, onComplete) {
        if (!this.ready || this.volumeLevel === 0) {
            if (onComplete) onComplete();
            return;
        }
        
        this.isPirateMode = true;
        const transitionSec = duration / 1000;
        
        if (this.nodes.humGain) {
            this.nodes.humGain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + transitionSec);
        }
        if (this.nodes.harmonic2Gain) {
            this.nodes.harmonic2Gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + transitionSec);
        }
        if (this.nodes.harmonic3Gain) {
            this.nodes.harmonic3Gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + transitionSec);
        }
        
        const transitionOsc = this.context.createOscillator();
        const transitionGain = this.context.createGain();
        transitionOsc.type = 'sine';
        transitionOsc.frequency.setValueAtTime(60, this.context.currentTime);
        transitionOsc.frequency.exponentialRampToValueAtTime(62.64, this.context.currentTime + transitionSec);
        
        const volumeMultipliers = [0, 0.3, 0.6, 1.0];
        const baseLevel = this.baseVolume * volumeMultipliers[this.volumeLevel];
        
        transitionGain.gain.setValueAtTime(baseLevel * 0.5, this.context.currentTime);
        transitionGain.gain.linearRampToValueAtTime(baseLevel * 2.0, this.context.currentTime + transitionSec * 0.5);
        transitionGain.gain.exponentialRampToValueAtTime(baseLevel * 1.8, this.context.currentTime + transitionSec);
        
        transitionOsc.connect(transitionGain);
        transitionGain.connect(this.nodes.masterGain);
        transitionOsc.start();
        transitionOsc.stop(this.context.currentTime + transitionSec);
        
        setTimeout(() => {
            this.cleanupCRTHum();
            if (this.volumeLevel > 0) {
                this.setupSchumannHum();
            }
            if (onComplete) onComplete();
        }, duration);
    }
    
    triggerLeakSound() {
        if (!this.ready || this.volumeLevel === 0) return;
        
        const frequencies = [
            [523.25, 261.63],
            [659.25, 329.63],
            [783.99, 392.00]
        ];
        
        const volumeMultipliers = [0, 0.3, 0.6, 1.0];
        const volume = 0.08 * volumeMultipliers[this.volumeLevel];
        
        frequencies.forEach((freqPair, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freqPair[0], this.context.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freqPair[1], this.context.currentTime + 0.3);
            gain.gain.setValueAtTime(0, this.context.currentTime);
            gain.gain.linearRampToValueAtTime(volume * (1 - i * 0.2), this.context.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.35);
            osc.connect(gain);
            gain.connect(this.nodes.masterGain);
            osc.start();
            osc.stop(this.context.currentTime + 0.4);
        });
    }
    
    triggerPhosphorTick() {
        if (!this.ready || this.volumeLevel === 0 || !this.isPirateMode) return;
        
        const clickOsc = this.context.createOscillator();
        const clickGain = this.context.createGain();
        clickOsc.type = 'sine';
        clickOsc.frequency.value = 400 + (Math.random() * 100);
        
        const volumeMultipliers = [0, 0.3, 0.6, 1.0];
        const clickVolume = 0.006 * volumeMultipliers[this.volumeLevel];
        
        clickGain.gain.setValueAtTime(clickVolume, this.context.currentTime);
        clickGain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.002);
        clickOsc.connect(clickGain);
        clickGain.connect(this.nodes.masterGain);
        clickOsc.start();
        clickOsc.stop(this.context.currentTime + 0.003);
    }
    
    triggerThinkingPulse() {
        if (!this.ready || this.volumeLevel === 0 || !this.isPirateMode) return;
        
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = 'sine';
        osc.frequency.value = 72;
        
        const volumeMultipliers = [0, 0.3, 0.6, 1.0];
        const volume = 0.12 * volumeMultipliers[this.volumeLevel];
        
        gain.gain.setValueAtTime(0, this.context.currentTime);
        gain.gain.linearRampToValueAtTime(volume, this.context.currentTime + 0.06);
        gain.gain.exponentialRampToValueAtTime(volume * 0.2, this.context.currentTime + 0.12);
        gain.gain.linearRampToValueAtTime(volume * 0.7, this.context.currentTime + 0.22);
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.nodes.masterGain);
        osc.start();
        osc.stop(this.context.currentTime + 0.4);
    }
    
    triggerBeamFizz() {
        if (!this.ready || this.volumeLevel === 0) return;
        
        const baseIntensity = 0.01;
        const bufferSize = this.context.sampleRate * 0.004;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() - 0.5) * 0.2;
        }
        
        const source = this.context.createBufferSource();
        const filter = this.context.createBiquadFilter();
        const gain = this.context.createGain();
        
        source.buffer = buffer;
        filter.type = 'highpass';
        filter.frequency.value = 3000;
        filter.Q.value = 0.7;
        
        const volumeMultipliers = [0, 0.3, 0.6, 1.0];
        const volume = baseIntensity * volumeMultipliers[this.volumeLevel];
        
        gain.gain.setValueAtTime(volume, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.01);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.nodes.masterGain);
        source.start();
    }
    
    triggerBeamSweep(beamY) {
        if (!this.ready || this.volumeLevel === 0 || this.isDeathSequence) return;
        
        const baseFreq = this.isPirateMode ? 69.64 : 67.83;
        const variation = (beamY / window.innerHeight - 0.5) * 4;
        const frequency = baseFreq + variation;
        
        if (!this.nodes.beamOsc) {
            this.nodes.beamOsc = this.context.createOscillator();
            this.nodes.beamGain = this.context.createGain();
            this.nodes.beamOsc.type = 'sine';
            this.nodes.beamOsc.frequency.value = frequency;
            this.nodes.beamGain.gain.value = this.baseBeamGain;
            this.nodes.beamOsc.connect(this.nodes.beamGain);
            this.nodes.beamGain.connect(this.nodes.masterGain);
            this.nodes.beamOsc.start();
        } else {
            this.nodes.beamOsc.frequency.exponentialRampToValueAtTime(frequency, this.context.currentTime + 0.1);
        }
    }
    
    triggerUIContact() {
        if (!this.ready || this.volumeLevel === 0 || !this.nodes.beamOsc) return;
        
        const currentFreq = this.nodes.beamOsc.frequency.value;
        this.nodes.beamOsc.frequency.setValueAtTime(currentFreq, this.context.currentTime);
        this.nodes.beamOsc.frequency.exponentialRampToValueAtTime(currentFreq * 0.2, this.context.currentTime + 0.1);
        this.nodes.beamOsc.frequency.exponentialRampToValueAtTime(currentFreq, this.context.currentTime + 0.4);
        
        this.nodes.beamGain.gain.setValueAtTime(this.baseBeamGain, this.context.currentTime);
        this.nodes.beamGain.gain.linearRampToValueAtTime(this.baseBeamGain * 3, this.context.currentTime + 0.1);
        this.nodes.beamGain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.baseBeamGain), this.context.currentTime + 0.4);
    }
    
    cleanupBeam() {
        if (this.nodes.beamOsc) {
            try { this.nodes.beamOsc.stop(); this.nodes.beamOsc.disconnect(); } catch (e) {}
            this.nodes.beamOsc = null;
        }
        if (this.nodes.beamGain) {
            try { this.nodes.beamGain.disconnect(); } catch (e) {}
            this.nodes.beamGain = null;
        }
    }
}

function integrateLeakWormAudio() {
    const audio = new LeakWormAudio();
    
    const volumeBtn = document.createElement('button');
    volumeBtn.id = 'audio-toggle';
    volumeBtn.innerHTML = `
        <span class="volume-bars">
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
        </span>
    `;
    volumeBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 32px;
        height: 20px;
        padding: 3px 6px;
        background: rgba(229, 62, 44, 0.056);
        border: 1px solid rgba(229, 62, 44, 0.245);
        border-radius: 2px;
        z-index: 500;
        transition: all 0.3s;
        cursor: crosshair;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        filter: blur(0.03px);
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .volume-bars { display: flex; gap: 2px; align-items: flex-end; height: 10px; }
        .bar { width: 2px; background: rgb(229, 62, 44); transition: all 0.3s; opacity: 0.125; }
        .bar-1 { height: 3px; }
        .bar-2 { height: 6px; }
        .bar-3 { height: 10px; }
        .volume-0 .bar { opacity: 0.125; }
        .volume-1 .bar { opacity: 0.125; }
        .volume-1 .bar-1 { opacity: 0.6; }
        .volume-2 .bar { opacity: 0.125; }
        .volume-2 .bar-1, .volume-2 .bar-2 { opacity: 0.7; }
        .volume-3 .bar { opacity: 0.85; }
        #audio-toggle:hover { background: rgba(229, 62, 44, 0.096); border-color: rgba(229, 62, 44, 0.32); opacity: 0.8; }
        #audio-toggle.beam-contact { opacity: 0.9 !important; filter: brightness(1.3) blur(0px) !important; border-color: rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.6) !important; }
        #audio-toggle.beam-contact .bar { background: rgb(var(--glow-r), var(--glow-g), var(--glow-b)) !important; box-shadow: 0 0 8px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.8) !important; }
    `;
    document.head.appendChild(style);
    
    volumeBtn.className = 'volume-1';
    
    volumeBtn.onclick = async function() {
        if (!audio.ready) {
            const initialized = await audio.init();
            if (!initialized) return;
            audio.setVolumeLevel(1);
            volumeBtn.className = 'volume-1';
            return;
        }
        
        const nextLevel = (audio.volumeLevel + 1) % 4;
        audio.setVolumeLevel(nextLevel);
        volumeBtn.className = `volume-${nextLevel}`;
    };
    
    document.body.appendChild(volumeBtn);
    
    const initAudioOnAnyClick = async function(e) {
        if (!audio.ready) {
            const initialized = await audio.init();
            if (initialized) {
                audio.setVolumeLevel(1);
                volumeBtn.className = 'volume-1';
            }
        }
        if (audio.ready) {
            document.removeEventListener('click', initAudioOnAnyClick);
        }
    };
    
    document.addEventListener('click', initAudioOnAnyClick);
    
    if (typeof decay !== 'undefined') {
        window.leakAudio = audio;
        decay.subscribe((stage, progress) => {
            audio.syncToDecayStage(stage, progress);
            audio.syncDecayVisuals(stage, progress);
        });
    }
    
    return audio;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', integrateLeakWormAudio);
} else {
    integrateLeakWormAudio();
}
