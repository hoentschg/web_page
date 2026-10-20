/**
 * QUIMERA - PROCEDURAL AUDIO SYNTHESIZER & HUD VISUALIZER
 * Web Audio API based - Subliminal sci-fi UI soundscapes inspired by Lusion.co
 */

class QuimeraAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.ambientGain = null;
    this.visualizerCanvas = document.getElementById('sound-canvas');
    this.soundBtn = document.getElementById('btn-sound-toggle');
    this.analyser = null;

    this.initVisualizer();
    this.bindEvents();
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Analyser for visualizer
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 32;
      this.masterGain.connect(this.analyser);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.ensureContext();
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.startAmbientDrone();
      this.playChime(660, 'sine', 0.15);
      if (this.soundBtn) this.soundBtn.classList.add('sound-active');
    } else {
      this.stopAmbientDrone();
      if (this.soundBtn) this.soundBtn.classList.remove('sound-active');
    }
  }

  startAmbientDrone() {
    if (!this.ctx || this.ambientOsc) return;

    // Dual low drone with low-pass filter
    this.ambientOsc = this.ctx.createOscillator();
    this.ambientOsc.type = 'sine';
    this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(140, this.ctx.currentTime);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 1.5);

    this.ambientOsc.connect(this.filter);
    this.filter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    this.ambientOsc.start();
  }

  stopAmbientDrone() {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
      setTimeout(() => {
        if (this.ambientOsc) {
          this.ambientOsc.stop();
          this.ambientOsc.disconnect();
          this.ambientOsc = null;
        }
      }, 450);
    }
  }

  playUiTick() {
    if (!this.isPlaying || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch (e) {}
  }

  playChime(freq = 520, type = 'sine', duration = 0.25) {
    if (!this.isPlaying || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playThreatAlarm() {
    if (!this.isPlaying || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(440, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch (e) {}
  }

  playShieldLock() {
    if (!this.isPlaying || !this.ctx) return;
    try {
      const notes = [440, 554, 659, 880];
      notes.forEach((n, idx) => {
        setTimeout(() => this.playChime(n, 'triangle', 0.18), idx * 60);
      });
    } catch (e) {}
  }

  initVisualizer() {
    if (!this.visualizerCanvas) return;
    const ctx = this.visualizerCanvas.getContext('2d');
    const width = this.visualizerCanvas.width = 24;
    const height = this.visualizerCanvas.height = 16;

    const bars = 4;
    const barWidth = 3;
    const barGap = 3;

    const render = () => {
      requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < bars; i++) {
        let barHeight = 4;
        if (this.isPlaying) {
          const t = Date.now() * 0.008 + i * 1.2;
          barHeight = 4 + Math.abs(Math.sin(t)) * 10;
        }

        ctx.fillStyle = this.isPlaying ? '#00f5d4' : '#64748b';
        ctx.fillRect(
          i * (barWidth + barGap),
          height - barHeight,
          barWidth,
          barHeight
        );
      }
    };
    render();
  }

  bindEvents() {
    if (this.soundBtn) {
      this.soundBtn.addEventListener('click', () => this.toggleSound());
    }

    // Attach hover sound to interactive elements
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('button, a, .calc-pill, .attack-btn, .mode-pill-btn')) {
        this.playUiTick();
      }
    });
  }
}

window.QuimeraAudio = QuimeraAudio;
