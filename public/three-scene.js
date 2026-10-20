/**
 * QUIMERA - 3D INTERACTIVE WEBGL SCENE
 * OPCIÓN 7 DE 10: "DUNAS DEL DESIERTO NOCTURNO ILUMINADAS POR LA LUNA"
 * (Moonlit Desert Dunes, Shifting Lunar Shadows & Sand Embers)
 *
 * Visual Highlights:
 * - Endless undulating desert dunes sculpted with procedural wind ridges and sweeping crests
 * - Dynamic lunar lighting: moving the mouse alters the celestial moonlight vector,
 *   casting long, cinematic shadows that stretch and glide across the sand valleys in real-time
 * - Serene crescent moon / celestial orb glowing gently in the midnight sky
 * - Drifting luminous sand grains and stardust floating along the windward crests
 * - Click interaction: Desert Wind Gust — a gentle breeze sweeps the dunes, causing glowing
 *   sand dust to rise gracefully and sand ridges to shimmer under the moonbeam
 * - Color adaptation per pillar: Moonlight Silver/Navy, Cobalt Desert, Oasis Emerald, Twilight Rose
 */

import * as THREE from './vendor/three.module.js';

class QuimeraScene {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    if (!this.canvas) return;

    if (typeof document !== 'undefined') {
      document.body.removeAttribute('data-zen-white');
    }

    this.mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      prevX: 0,
      prevY: 0,
      speed: 0
    };

    this.windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.clock = new THREE.Clock();

    // Desert Wind Gust State
    this.gustTime = 999.0;
    this.gustSpeed = 16.0;

    this.currentMode = 'security';

    // Nocturnal Desert Palettes
    this.palettes = {
      security: {
        sandBase: new THREE.Color(0x061118),   // Deep Midnight Slate
        sandHighlight: new THREE.Color(0x00f5d4),// Cyan Moonlit Rim
        moonColor: new THREE.Color(0xf0fdfa),  // Silver Moonlight
        ambientTone: new THREE.Color(0x02070c),// Shadow tone
        fog: 0x02060b
      },
      software: {
        sandBase: new THREE.Color(0x050e1f),   // Royal Midnight Navy
        sandHighlight: new THREE.Color(0x38bdf8),// Sky Blue Dune Edge
        moonColor: new THREE.Color(0xe0f2fe),  // Platinum Lunar
        ambientTone: new THREE.Color(0x020510),// Deep Indigo Shadow
        fog: 0x020514
      },
      support: {
        sandBase: new THREE.Color(0x04130e),   // Oasis Deep Jade
        sandHighlight: new THREE.Color(0x10b981),// Mint Moonbeam Edge
        moonColor: new THREE.Color(0xf0fdf4),  // Pale Oasis Moon
        ambientTone: new THREE.Color(0x010906),// Forest Night Shadow
        fog: 0x010a07
      },
      nexus: {
        sandBase: new THREE.Color(0x120417),   // Twilight Amethyst Sand
        sandHighlight: new THREE.Color(0xfb7185),// Rose Gold Crests
        moonColor: new THREE.Color(0xfdf2f8),  // Pink Pearl Moon
        ambientTone: new THREE.Color(0x0a010d),// Deep Violet Shadow
        fog: 0x0b020e
      }
    };

    const initial = this.palettes.security;
    this.curSandBase = initial.sandBase.clone();
    this.curSandHighlight = initial.sandHighlight.clone();
    this.curMoon = initial.moonColor.clone();
    this.curAmbient = initial.ambientTone.clone();

    this.init();
    this.createDuneLandscape();
    this.createCelestialMoon();
    this.createFloatingSandDust();
    this.bindEvents();
    this.animate();
  }

  init() {
    // 1. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    // 2. Midnight Desert Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(this.palettes.security.fog, 0.024);

    // 3. Perspective Camera
    this.camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0.4, 13.0);

    // 4. World Group with responsive framing
    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);
    this.updateWorldFraming();

    // 5. Celestial Moonlight & Desert Shadows
    this.ambientLight = new THREE.AmbientLight(0x03080e, 1.8);
    this.scene.add(this.ambientLight);

    // Dynamic Moonlight Source (Casts cinematic shadows based on mouse)
    this.moonLight = new THREE.DirectionalLight(0xf0fdfa, 2.8);
    this.moonLight.position.set(6, 9, 8);
    this.worldGroup.add(this.moonLight);

    // Horizon Rim Light
    this.horizonGlow = new THREE.PointLight(0x00f5d4, 45, 30);
    this.horizonGlow.position.set(0, -2, -10);
    this.worldGroup.add(this.horizonGlow);
  }

  updateWorldFraming() {
    if (window.innerWidth > 960) {
      // Offset slightly to the right to frame corporate text on the left
      this.worldGroup.position.set(2.0, -0.4, 0);
    } else {
      this.worldGroup.position.set(0, 0.2, 0);
    }
  }

  /* ==========================================================================
     1. DESERT DUNE LANDSCAPE (High-Resolution Procedural Sand Mesh)
     ========================================================================== */
  createDuneLandscape() {
    this.dunesGroup = new THREE.Group();
    // Tilt the desert floor towards the horizon
    this.dunesGroup.rotation.x = -0.42;
    this.dunesGroup.rotation.y = 0.08;
    this.dunesGroup.position.set(0, -2.4, 0);
    this.worldGroup.add(this.dunesGroup);

    this.duneWidth = 34;
    this.duneHeight = 24;
    this.duneSegsX = 125;
    this.duneSegsY = 90;

    const geo = new THREE.PlaneGeometry(
      this.duneWidth,
      this.duneHeight,
      this.duneSegsX,
      this.duneSegsY
    );

    const pos = geo.attributes.position;
    this.vertexCount = pos.count;
    this.baseHeights = new Float32Array(this.vertexCount);

    for (let i = 0; i < this.vertexCount; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Complex multi-layer harmonic dune equations with razor-sharp crests
      const mainWave = Math.sin(x * 0.22 + Math.cos(y * 0.16) * 1.6);
      const crossWave = Math.cos(y * 0.28 - x * 0.12);
      const detailRipple = Math.sin(x * 0.65 + y * 0.45) * 0.35;

      // Asymmetric dune slope (gentle windward slope, steeper leeward face)
      const ridgeProfile = Math.pow(Math.abs(mainWave), 0.75) * Math.sign(mainWave);
      const height = ridgeProfile * 2.2 + crossWave * 1.35 + detailRipple;

      pos.setZ(i, height);
      this.baseHeights[i] = height;
    }

    geo.computeVertexNormals();

    // Sand Material: Soft matte velvet finish with subtle grazing highlights
    this.sandMat = new THREE.MeshStandardMaterial({
      color: this.curSandBase,
      roughness: 0.88,
      metalness: 0.05,
      flatShading: false
    });

    this.duneMesh = new THREE.Mesh(geo, this.sandMat);
    this.dunesGroup.add(this.duneMesh);

    // Glowing Wireframe Crest Accent (Highlights the razor-sharp dune ridges)
    const crestWireGeo = new THREE.WireframeGeometry(geo);
    this.crestWireMat = new THREE.LineBasicMaterial({
      color: this.curSandHighlight,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    });
    this.crestLines = new THREE.LineSegments(crestWireGeo, this.crestWireMat);
    this.dunesGroup.add(this.crestLines);
  }

  /* ==========================================================================
     2. CELESTIAL CRESCENT MOON (Serene Lunar Orb)
     ========================================================================== */
  createCelestialMoon() {
    this.moonGroup = new THREE.Group();
    this.moonGroup.position.set(5.5, 4.2, -18);
    this.worldGroup.add(this.moonGroup);

    // Glowing Moon Sphere
    const moonGeo = new THREE.SphereGeometry(1.6, 32, 32);
    this.moonMat = new THREE.MeshBasicMaterial({
      color: this.curMoon,
      transparent: true,
      opacity: 0.95
    });
    this.moonMesh = new THREE.Mesh(moonGeo, this.moonMat);
    this.moonGroup.add(this.moonMesh);

    // Ethereal Moon Halo Ring
    const haloGeo = new THREE.RingGeometry(1.8, 3.2, 40);
    this.moonHaloMat = new THREE.MeshBasicMaterial({
      color: this.curSandHighlight,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    this.moonHalo = new THREE.Mesh(haloGeo, this.moonHaloMat);
    this.moonGroup.add(this.moonHalo);
  }

  /* ==========================================================================
     3. FLOATING SAND DUST & LUNAR EMBERS
     ========================================================================== */
  createFloatingSandDust() {
    this.dustCount = 380;
    const pos = new Float32Array(this.dustCount * 3);
    const col = new Float32Array(this.dustCount * 3);
    this.dustData = [];

    for (let i = 0; i < this.dustCount; i++) {
      const x = (Math.random() - 0.5) * 32;
      const y = -3.0 + Math.random() * 7.5;
      const z = (Math.random() - 0.5) * 14;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      col[i * 3] = this.curSandHighlight.r;
      col[i * 3 + 1] = this.curSandHighlight.g;
      col[i * 3 + 2] = this.curSandHighlight.b;

      this.dustData.push({
        x,
        y,
        z,
        baseY: y,
        speedX: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2
      });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    // Circular soft dust texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(0, 245, 212, 0.7)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const mat = new THREE.PointsMaterial({
      size: 0.26,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.sandDustSystem = new THREE.Points(geo, mat);
    this.worldGroup.add(this.sandDustSystem);
  }

  /* ==========================================================================
     CLICK INTERACTION: DESERT WIND GUST & LUNAR SHIMMER
     ========================================================================== */
  setMode(mode) {
    this.currentMode = mode;
    this.triggerPulse();
  }

  triggerPulse() {
    // Trigger a desert breeze wave sweeping from left to right
    this.gustTime = 0.0;

    // Moonlight flash
    if (this.moonLight) {
      this.moonLight.intensity = 5.2;
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('click', () => this.triggerPulse());

    // Mobile touch
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.onMouseMove({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        });
      }
    }, { passive: true });

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.onMouseMove({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        });
        this.triggerPulse();
      }
    }, { passive: true });
  }

  onResize() {
    this.windowHalf.x = window.innerWidth / 2;
    this.windowHalf.y = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.updateWorldFraming();
  }

  onMouseMove(e) {
    const normX = (e.clientX - this.windowHalf.x) / this.windowHalf.x;
    const normY = (e.clientY - this.windowHalf.y) / this.windowHalf.y;

    this.mouse.targetX = normX;
    this.mouse.targetY = normY;

    const dx = e.clientX - this.mouse.prevX;
    const dy = e.clientY - this.mouse.prevY;
    this.mouse.speed = Math.sqrt(dx * dx + dy * dy);
    this.mouse.prevX = e.clientX;
    this.mouse.prevY = e.clientY;
  }

  /* ==========================================================================
     RENDER & LUNAR SHADOW LOOP
     ========================================================================== */
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    // 1. Mouse Lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Camera organic parallax
    this.worldGroup.rotation.y = this.mouse.x * 0.15;
    this.worldGroup.rotation.x = this.mouse.y * 0.08;

    // 2. DYNAMIC MOONLIGHT VECTOR: Shadows slide across dunes in real-time
    this.moonLight.position.x = 6 + this.mouse.x * 7.5;
    this.moonLight.position.y = 9 - this.mouse.y * 4.5;
    this.moonLight.intensity += (2.8 - this.moonLight.intensity) * 0.05;

    // Subtle moon position breathing
    if (this.moonGroup) {
      this.moonGroup.position.x = 5.5 + Math.sin(elapsed * 0.4) * 0.5;
      this.moonGroup.position.y = 4.2 + Math.cos(elapsed * 0.3) * 0.3;
      this.moonHalo.rotation.z += 0.08 * delta;
    }

    // 3. Desert Wind Wave Across Dunes
    this.gustTime += delta;
    const gustWaveX = -18 + this.gustTime * this.gustSpeed;

    const pos = this.duneMesh.geometry.attributes.position;
    const count = this.vertexCount;
    const base = this.baseHeights;

    // Subtle wind ripple breathing across sand
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      let currentHeight = base[i] + Math.sin(x * 0.4 + y * 0.3 + elapsed * 0.6) * 0.08;

      // Click wind gust wave
      if (this.gustTime < 2.5) {
        const distToGust = Math.abs(x - gustWaveX);
        if (distToGust < 3.5) {
          const gustLift = Math.cos((distToGust / 3.5) * Math.PI * 0.5) * (1.0 - this.gustTime / 2.5) * 0.45;
          currentHeight += gustLift;
        }
      }

      pos.setZ(i, currentHeight);
    }
    pos.needsUpdate = true;
    this.duneMesh.geometry.computeVertexNormals();

    // 4. Update Drifting Sand Grains (Windward Flight)
    if (this.sandDustSystem) {
      const dPos = this.sandDustSystem.geometry.attributes.position;
      const countD = this.dustCount;

      for (let i = 0; i < countD; i++) {
        const d = this.dustData[i];
        d.x += d.speedX * delta * 2.2;
        d.y = d.baseY + Math.sin(elapsed * 1.5 + d.phase) * 0.3;

        // Wrap particles back to the windward side
        if (d.x > 18) {
          d.x = -18;
          d.y = -3.0 + Math.random() * 7.5;
        }

        dPos.setXYZ(i, d.x, d.y, d.z);
      }
      dPos.needsUpdate = true;
    }

    // 5. Smooth Nocturnal Palette Morphing
    const targetPal = this.palettes[this.currentMode] || this.palettes.security;
    this.curSandBase.lerp(targetPal.sandBase, 0.05);
    this.curSandHighlight.lerp(targetPal.sandHighlight, 0.05);
    this.curMoon.lerp(targetPal.moonColor, 0.05);

    if (this.sandMat) this.sandMat.color.copy(this.curSandBase);
    if (this.crestWireMat) this.crestWireMat.color.copy(this.curSandHighlight);
    if (this.moonMat) this.moonMat.color.copy(this.curMoon);
    if (this.moonHaloMat) this.moonHaloMat.color.copy(this.curSandHighlight);
    if (this.horizonGlow) this.horizonGlow.color.copy(this.curSandHighlight);

    if (this.scene && this.scene.fog) {
      if (!this.targetFog) this.targetFog = new THREE.Color(targetPal.fog);
      this.targetFog.setHex(targetPal.fog);
      this.scene.fog.color.lerp(this.targetFog, 0.05);
    }

    // 6. Final Render
    this.renderer.render(this.scene, this.camera);
  }
}

// Global Export for app.js
if (typeof window !== 'undefined') {
  window.QuimeraScene = QuimeraScene;
}

export default QuimeraScene;
