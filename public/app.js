/**
 * QUIMERA - CORE CLIENT INTERACTION SCRIPT
 * High performance, zero lag, silky smooth animations & simulators
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Audio and 3D Scene
  let audioEngine = null;
  let sceneEngine = null;

  try {
    audioEngine = new window.QuimeraAudio();
  } catch (e) {
    console.warn('Audio init failed:', e);
  }

  try {
    sceneEngine = new window.QuimeraScene();
  } catch (e) {
    console.warn('3D Scene init failed:', e);
  }

  // 2. Custom Cursor Follower
  initCustomCursor();

  // 3. 3D Scene Mode Switcher Pills
  initSceneModeSwitchers(sceneEngine, audioEngine);

  // 4. Live Cyber Attack Defense Simulator
  initDefenseSimulator(audioEngine);

  // 5. Interactive Solution Readiness Calculator
  initSolutionCalculator(audioEngine);

  // 6. Contact / Incident Protocol Modal
  initContactModal(audioEngine);

  // 7. Stat Counters Animation
  initStatCounters();

  // 8. Real-time Footer Clock
  initFooterClock();

  // 9. FAQ Accordion (Punto 3)
  initFaqAccordion(audioEngine);

  // 10. WhatsApp Floating Widget (Punto 5)
  initWhatsAppWidget(audioEngine);

  // 11. Bilingual Language Switcher (Punto 5)
  initLanguageSwitcher(audioEngine);
});


/* ==========================================================================
   CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursorDot = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.custom-cursor-follower');
  if (!cursorDot || !cursorFollower) return;

  // Don't render on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursorDot.style.display = 'none';
    cursorFollower.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover detection
  const interactiveElements = 'a, button, input, select, textarea, .mode-pill-btn, .attack-btn, .calc-pill, .pillar-card';
  document.querySelectorAll(interactiveElements).forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   3D SCENE CONTROLLER PILLS
   ========================================================================== */
function initSceneModeSwitchers(sceneEngine, audioEngine) {
  const buttons = document.querySelectorAll('.mode-pill-btn');
  if (!buttons.length) return;

  function switchMode(mode) {
    buttons.forEach((b) => {
      if (b.getAttribute('data-mode') === mode) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // Sincronizar tema global en body para transiciones de atmósfera CSS
    document.body.setAttribute('data-pillar-theme', mode);

    // Notificar al motor 3D
    if (sceneEngine) sceneEngine.setMode(mode);

    // Audio temático por pilar
    if (audioEngine) {
      if (mode === 'security') {
        audioEngine.playShieldLock();
      } else if (mode === 'software') {
        [523, 659, 784, 1046].forEach((n, idx) => {
          setTimeout(() => audioEngine.playChime(n, 'sine', 0.16), idx * 45);
        });
      } else if (mode === 'support') {
        [392, 493, 587, 784].forEach((n, idx) => {
          setTimeout(() => audioEngine.playChime(n, 'triangle', 0.2), idx * 55);
        });
      } else if (mode === 'nexus') {
        [440, 659, 987, 1318].forEach((n, idx) => {
          setTimeout(() => audioEngine.playChime(n, 'sawtooth', 0.18), idx * 40);
        });
      }
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      switchMode(mode);
    });
  });

  // Vincular hover sobre las tarjetas de los 3 pilares a la transición cromática
  const pillarSecurity = document.getElementById('card-pillar-security');
  const pillarSoftware = document.getElementById('card-pillar-software');
  const pillarSupport = document.getElementById('card-pillar-support');

  if (pillarSecurity) {
    pillarSecurity.addEventListener('mouseenter', () => switchMode('security'));
  }
  if (pillarSoftware) {
    pillarSoftware.addEventListener('mouseenter', () => switchMode('software'));
  }
  if (pillarSupport) {
    pillarSupport.addEventListener('mouseenter', () => switchMode('support'));
  }
}

/* ==========================================================================
   LIVE CYBER DEFENSE SIMULATOR
   ========================================================================== */
function initDefenseSimulator(audioEngine) {
  const triggerBtns = document.querySelectorAll('.attack-btn');
  const terminalStream = document.getElementById('terminal-stream');
  const defenseFill = document.getElementById('sim-defense-fill');
  const defenseStatusText = document.getElementById('sim-defense-status-text');

  if (!triggerBtns.length || !terminalStream) return;

  const scenarios = {
    insider_leak: {
      name: 'INSIDER THREAT - FUGA DE INFORMACIÓN POR EMPLEADO',
      payload: 'Exfiltración no autorizada (USB Mass Storage / Cloud Sync no regulado)',
      target: 'Base de Datos de Clientes & Repositorio de Código Fuente',
      logs: [
        { type: 'alert', text: '[ALERTA DLP] Actividad anómala: Descarga masiva inusual de registros de clientes y repositorios git' },
        { type: 'intercept', text: '[QUIMERA ENDPOINT SHIELD] Bloqueo inmediato de puertos USB y revocación de accesos SSO' },
        { type: 'neutralized', text: '[AISLAMIENTO ZERO-TRUST] Sesión activa revocada. Canal cifrado bloqueado en 18ms' },
        { type: 'hash', text: '[CADENA DE CUSTODIA] Hash forense generado (SHA-256: 0x9e8a...c4b2) preservado para auditoría legal' },
        { type: 'success', text: '[INFORMACIÓN BLINDADA] Cero exfiltración. Información confidencial 100% resguardada.' }
      ]
    },
    dhcp_conflict: {
      name: 'COLAPSO DE RED POR CONFLICTO MASIVO DHCP',
      payload: 'Rogue DHCP Injection & IP Pool Duplication (Broadcast Storm)',
      target: 'Switches Centrales, VLAN Corporativa y Equipos Endpoint',
      logs: [
        { type: 'alert', text: '[ALERTA DE RED] 52 direcciones IP duplicadas detectadas en subred corporativa. Paquetes perdidos: 72%' },
        { type: 'intercept', text: '[QUIMERA NET-SENTINEL] Localización automática de puerto infractor en switch de planta 2' },
        { type: 'neutralized', text: '[AUTOCORRECCIÓN] DHCP Snooping activado y purgado de tablas ARP en toda la red' },
        { type: 'hash', text: '[ESTABILIZACIÓN] Reasignación dinámica completada. Latencia de red normalizada a 1.2ms' },
        { type: 'success', text: '[OPERACIÓN RESTAURADA] Computadoras, impresoras y servicios 100% operativos sin reinicio manual.' }
      ]
    },
    disk_performance: {
      name: 'DEGRADACIÓN CRÍTICA DE RENDIMIENTO (DISCOS MECÁNICOS)',
      payload: 'I/O Queue Bottleneck (100% Disk Usage constante en estaciones de trabajo)',
      target: 'Estaciones Operativas & Productividad de Colaboradores',
      logs: [
        { type: 'alert', text: '[TELEMETRÍA DE RENDIMIENTO] Tiempos de inicio superiores a 14 min. Colapso en lectura/escritura de archivos' },
        { type: 'intercept', text: '[QUIMERA SYS-DIAGNOSTIC] Detección de cuellos de botella y sectores lentos en discos HDD mecánicos' },
        { type: 'neutralized', text: '[OPTIMIZACIÓN & PLAN] Migración express a SSD NVMe empresarial y purga de servicios zombies' },
        { type: 'hash', text: '[BENCHMARK POST-MEJORA] Tiempo de arranque reducido a 10.4 seg. Rendimiento general acelerado en 480%' },
        { type: 'success', text: '[PRODUCTIVIDAD SALVADA] Eliminados tiempos muertos. Ahorro estimado de 130 horas-hombre al mes.' }
      ]
    },
    drp_failure: {
      name: 'FALLO CRÍTICO DRP (CONTINUIDAD DE NEGOCIO EN RIESGO)',
      payload: 'Corte Eléctrico Mayor & Desconexión Catastrófica de Sede Principal',
      target: 'Servidores Físicos Locales, ERP y Disponibilidad del Negocio',
      logs: [
        { type: 'alert', text: '[ALERTA CRÍTICA DRP] Sede principal sin suministro ni enlace. Servidores locales fuera de línea' },
        { type: 'intercept', text: '[QUIMERA CLOUD FAILOVER] Activación automática del plan de recuperación ante desastres en la nube' },
        { type: 'neutralized', text: '[CONMUTACIÓN INSTANTÁNEA] Redirección automática de DNS y balanceadores hacia réplicas cloud seguras' },
        { type: 'hash', text: '[MÉTRICA RTO / RPO] RPO: 0 pérdida de transacciones. RTO: Negocio operativo en 1 min 22 seg (vs 48 hrs)' },
        { type: 'success', text: '[CONTINUIDAD BLINDADA] Plataformas activas para clientes y personal remoto sin detener la facturación.' }
      ]
    },
    double_extortion: {
      name: 'RANSOMWARE DE DOBLE EXTORSIÓN (DATA LEAK THREAT)',
      payload: 'C2 Reverse Shell & Exfiltration Pipeline previo a Cifrado Asimétrico RSA-4096',
      target: 'Servidores de Producción, Repositorios Financieros y Backups Locales',
      logs: [
        { type: 'alert', text: '[ALERTA CRÍTICA] Detección de túnel C2 encubierto intentando extraer 85 GB de datos comprimidos' },
        { type: 'intercept', text: '[QUIMERA HONEYPOT & CIPHER] Tráfico desviado a entorno trampa y revocación dinámica de llaves' },
        { type: 'neutralized', text: '[KILL-SWITCH INSTANTÁNEO] Proceso malicioso abortado en 12ms. Bloqueado intento de borrado de VSS snapshots' },
        { type: 'hash', text: '[RESPALDO WORM ACTIVO] Instantáneas inmutables validadas (SHA3-512). Cero bytes filtrados a servidores externos' },
        { type: 'success', text: '[AMENAZA NEUTRALIZADA] Extorsión frustrada al 100%. Sistemas limpios y reputación corporativa protegida.' }
      ]
    }
  };

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const scenarioKey = btn.getAttribute('data-scenario');
      const data = scenarios[scenarioKey];
      if (!data) return;

      triggerBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      if (audioEngine) audioEngine.playThreatAlarm();

      // Clear terminal
      terminalStream.innerHTML = '';

      // Animate defense bar drop and recovery
      if (defenseFill && defenseStatusText) {
        defenseFill.style.width = '20%';
        defenseFill.style.background = '#f43f5e';
        defenseStatusText.innerText = 'NEUTRALIZANDO AMENAZA...';
        defenseStatusText.style.color = '#f43f5e';
      }

      // Add scenario title
      appendLog(terminalStream, 'neutralized', `>>> INICIANDO PROTOCOLO: ${data.name}`);
      appendLog(terminalStream, 'hash', `>>> Vector: ${data.payload} | Objetivo: ${data.target}`);

      data.logs.forEach((logItem, index) => {
        setTimeout(() => {
          appendLog(terminalStream, logItem.type, logItem.text);
          terminalStream.scrollTop = terminalStream.scrollHeight;

          if (index === data.logs.length - 1) {
            if (audioEngine) audioEngine.playShieldLock();
            if (defenseFill && defenseStatusText) {
              defenseFill.style.width = '100%';
              defenseFill.style.background = 'linear-gradient(90deg, #00f5d4, #10b981)';
              defenseStatusText.innerText = 'PERÍMETRO BLINDADO • 100% OPERATIVO';
              defenseStatusText.style.color = '#10b981';
            }
          }
        }, (index + 1) * 380);
      });
    });
  });

  function appendLog(parent, type, text) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;

    entry.innerHTML = `<span class="log-time">[${timeStr}]</span> <span class="log-type-${type}">${escapeHtml(text)}</span>`;
    parent.appendChild(entry);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

/* ==========================================================================
   INTERACTIVE SOLUTION & READINESS CALCULATOR
   ========================================================================== */
function initSolutionCalculator(audioEngine) {
  const sectorPills = document.querySelectorAll('.calc-pill-sector');
  const sizePills = document.querySelectorAll('.calc-pill-size');
  const needPills = document.querySelectorAll('.calc-pill-need');

  const scoreDisplay = document.getElementById('calc-score-val');
  const roadmapList = document.getElementById('calc-roadmap-list');
  const actionBtn = document.getElementById('calc-action-btn');

  if (!sectorPills.length) return;

  function recalculate() {
    const selectedSector = document.querySelector('.calc-pill-sector.selected')?.getAttribute('data-val') || 'Finanzas';
    const selectedSize = document.querySelector('.calc-pill-size.selected')?.getAttribute('data-val') || 'Mediana';
    const selectedNeed = document.querySelector('.calc-pill-need.selected')?.getAttribute('data-val') || 'Seguridad';

    let score = 94;
    let items = [];

    if (selectedNeed === 'Seguridad') {
      score = 99;
      items = [
        'Cifrado de Base de Datos en reposo y tránsito (AES-256)',
        'Sistema de Backups Inmutables anti-ransomware (RPO 0s)',
        'Política Zero-Trust Network Access (ZTNA)',
        'Auditoría y Pentesting inicial de vulnerabilidades'
      ];
    } else if (selectedNeed === 'Software') {
      score = 97;
      items = [
        `Arquitectura a medida para el sector ${selectedSector}`,
        'Metodología DevSecOps: Seguridad probada en cada sprint',
        'Backend cloud-native de alta concurrencia & APIs REST/GraphQL',
        'Propiedad intelectual 100% de tu empresa (Sin licencias sorpresa)'
      ];
    } else if (selectedNeed === 'Soporte') {
      score = 98;
      items = [
        'Centro de Operaciones de Seguridad (SOC) 24/7/365 activo',
        'SLA garantizado de resolución crítica menor a 15 minutos',
        'Monitoreo proactivo de servidores, bases de datos y red',
        'Planes automatizados de Disaster Recovery & Failover'
      ];
    } else {
      score = 100;
      items = [
        'Blindaje Integral 360° (Seguridad + Software + Soporte)',
        'Defensa activa contra pérdida y robo de información corporativa',
        'Desarrollo de plataforma core personalizada para tu sector',
        'Ingenieros dedicados de guardia las 24 horas del día'
      ];
    }

    if (scoreDisplay) scoreDisplay.innerText = `${score}%`;

    if (roadmapList) {
      roadmapList.innerHTML = items
        .map(
          (item) => `
        <li>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          <span>${item}</span>
        </li>
      `
        )
        .join('');
    }

    if (actionBtn) {
      actionBtn.setAttribute('data-prefill', `Sector: ${selectedSector} | Tamaño: ${selectedSize} | Enfoque: ${selectedNeed}`);
    }
  }

  function setupPillGroup(pills) {
    pills.forEach((p) => {
      p.addEventListener('click', () => {
        pills.forEach((item) => item.classList.remove('selected'));
        p.classList.add('selected');
        if (audioEngine) audioEngine.playUiTick();
        recalculate();
      });
    });
  }

  setupPillGroup(sectorPills);
  setupPillGroup(sizePills);
  setupPillGroup(needPills);

  // Initial calculation
  recalculate();
}

/* ==========================================================================
   CONTACT MODAL & INCIDENT PROTOCOL
   ========================================================================== */
function initContactModal(audioEngine) {
  const modal = document.getElementById('contact-modal');
  const openBtns = document.querySelectorAll('.btn-open-contact');
  const closeBtn = document.getElementById('modal-close-btn');
  const form = document.getElementById('quimera-contact-form');
  const statusMsg = document.getElementById('form-status-msg');

  if (!modal) return;

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      if (audioEngine) audioEngine.playChime(750, 'sine', 0.2);

      // Check if button had prefill data from calculator
      const prefill = btn.getAttribute('data-prefill');
      const messageField = document.getElementById('contact-message');
      if (prefill && messageField && !messageField.value) {
        messageField.value = `Hola Quimera, me interesa evaluar la siguiente solución:\n[${prefill}]\n\nPor favor contáctenme para coordinar una reunión técnica o auditoría inicial.`;
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `<span>Cifrando y Enviando...</span>`;
      submitBtn.disabled = true;

      if (audioEngine) audioEngine.playUiTick();

      setTimeout(() => {
        if (audioEngine) audioEngine.playShieldLock();

        if (statusMsg) {
          statusMsg.style.display = 'block';
          statusMsg.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 12px; padding: 1rem; color: #10b981; text-align: center; font-size: 0.9rem;">
              <strong>🛡️ Protocolo Recibido con Éxito</strong><br>
              Tus requerimientos han sido cifrados con AES-256 y derivados al equipo de ingenieros de Quimera. Te contactaremos en menos de 15 minutos.
            </div>
          `;
        }

        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        setTimeout(() => {
          modal.classList.remove('active');
          if (statusMsg) statusMsg.style.display = 'none';
        }, 4000);
      }, 1200);
    });
  }
}

/* ==========================================================================
   STAT COUNTERS
   ========================================================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const isDecimal = target % 1 !== 0;

          let start = 0;
          const duration = 1800;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const currentVal = easeProgress * target;

            el.innerHTML = `${prefix}${isDecimal ? currentVal.toFixed(2) : Math.floor(currentVal)}<span class="accent">${suffix}</span>`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.innerHTML = `${prefix}${isDecimal ? target.toFixed(2) : target}<span class="accent">${suffix}</span>`;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  statNumbers.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   REAL-TIME FOOTER CLOCK
   ========================================================================== */
function initFooterClock() {
  const clockEl = document.getElementById('footer-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    clockEl.innerText = `${timeStr} UTC-4 [SANTIAGO / CL]`;
  }
  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   FAQ ACCORDION CONTROLLER - PUNTO 3
   ========================================================================== */
function initFaqAccordion(audioEngine) {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!button || !answer) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Cerrar otros acordeones para mantener lectura limpia
      items.forEach((other) => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          const otherAns = other.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';

        if (audioEngine) {
          audioEngine.playChime(580, 'sine', 0.12);
        }
      }
    });
  });
}

/* ==========================================================================
   WHATSAPP BUSINESS FLOATING WIDGET - PUNTO 5
   ========================================================================== */
function initWhatsAppWidget(audioEngine) {
  const triggerBtn = document.getElementById('whatsapp-trigger-btn');
  const popover = document.getElementById('whatsapp-popover');
  const closeBtn = document.getElementById('wa-popover-close');
  const badge = document.querySelector('.whatsapp-btn-badge');

  if (!triggerBtn || !popover) return;

  function togglePopover(show) {
    const isOpen = typeof show === 'boolean' ? show : !popover.classList.contains('open');
    if (isOpen) {
      popover.classList.add('open');
      popover.setAttribute('aria-hidden', 'false');
      if (badge) badge.style.display = 'none'; // Quitar badge al abrir
      if (audioEngine) audioEngine.playChime(880, 'sine', 0.14);
    } else {
      popover.classList.remove('open');
      popover.setAttribute('aria-hidden', 'true');
    }
  }

  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePopover();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePopover(false);
    });
  }

  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!popover.contains(e.target) && !triggerBtn.contains(e.target)) {
      if (popover.classList.contains('open')) {
        togglePopover(false);
      }
    }
  });

  // Tecla Escape cierra el popover
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popover.classList.contains('open')) {
      togglePopover(false);
    }
  });
}

/* ==========================================================================
   BILINGUAL LANGUAGE SWITCHER (ES / EN) - PUNTO 5
   ========================================================================== */
function initLanguageSwitcher(audioEngine) {
  const switchBtn = document.getElementById('lang-switch-btn');
  if (!switchBtn) return;

  let currentLang = 'es';

  const translations = {
    es: {
      navServices: 'Servicios',
      navSimulator: 'Simulador de Ataques',
      navDiagnostic: 'Diagnóstico',
      navAbout: 'Nosotros',
      navFaq: 'FAQ',
      headerCta: 'Iniciar Blindaje',
      heroBadge: 'PROTECCIÓN DE INFORMACIÓN & INGENIERÍA DIGITAL DE ÉLITE',
      heroTitle: 'Blindamos tus datos.<br><span class="text-gradient">Construimos tu futuro digital.</span>',
      heroDesc: 'Aseguramos la información de tu empresa para que <strong>nunca la pierdas ni nadie pueda robártela</strong>. Desarrollamos <strong>aplicaciones 100% personalizadas</strong> para cualquier industria y respaldamos tu operación con <strong>soporte técnico corporativo 24/7</strong>.',
      heroBtnExplore: 'Conocer Soluciones',
      heroBtnSim: 'Simular Ataque & Defensa',
      pillarsTag: 'NUESTRA TRIPLE VENTAJA',
      pillarsHeading: 'Tres pilares de poder tecnológico para tu empresa',
      faqTag: 'FAQ // PREGUNTAS FRECUENTES',
      faqHeading: 'FAQ <span class="text-gradient">// Preguntas Frecuentes</span>',
      faqSubheading: 'Transparencia técnica absoluta sobre cómo protegemos tu información, cómo operamos y qué garantías reales respaldan tu negocio.',
      footerFaq: 'FAQ // Preguntas Frecuentes',
      waTitle: 'Guardia Técnica Quimera',
      waSub: 'SOC En línea • Respuesta en < 15 min',
      waBubble: '👋 Hola. Bienvenido al centro de respuesta de <strong>Quimera</strong>. ¿Cómo podemos ayudarte hoy?',
      waEmergency: '🚨 Reportar Incidente de Emergencia',
      waQuote: '💼 Cotizar Blindaje / Software a Medida',
      waSchedule: '📅 Agendar Diagnóstico Técnico Gratuito',
      faqItems: [
        {
          badge: 'EQUIPO TI',
          question: '¿Qué ocurre si nuestra empresa ya cuenta con un departamento de informática o TI interno?',
          answer: '<p><strong>Quimera no reemplaza a tu equipo, lo blinda y lo potencia.</strong> Actuamos como su brazo de élite en ciberdefensa avanzada, pruebas continuas de penetración, bóvedas criptográficas y guardia nocturna/fines de semana (24/7/365).</p><p>Liberamos a tu personal de sistemas de la carga del monitoreo de alertas críticas y les proporcionamos herramientas de nivel militar (Zero-Trust, snapshots WORM inmutables) que de otro modo requerirían contratar un equipo completo de especialistas en ciberseguridad.</p>'
        },
        {
          badge: 'SOBERANÍA',
          question: '¿Nuestra información sensible sale de la empresa o se almacena en la nube de Quimera?',
          answer: '<p><strong>Tú mantienes la soberanía absoluta de tus datos y llaves.</strong> Diseñamos infraestructuras híbridas, on-premise o en nube privada exclusiva para tu empresa.</p><p>Las llaves maestras de cifrado (AES-256 GCM) residen exclusivamente bajo tu custodia. Quimera administra el blindaje, los perímetros y los protocolos, pero <em>nunca</em> tiene acceso en texto plano ni almacena tus bases de datos corporativas en servidores de terceros.</p>'
        },
        {
          badge: 'RANSOMWARE',
          question: '¿Cómo garantiza la tecnología WORM que ningún Ransomware pueda secuestrar o borrar los backups?',
          answer: '<p>WORM significa <em>Write Once, Read Many</em> (Escribe una vez, lee muchas veces). Es un bloqueo de inmutabilidad aplicado a nivel de kernel y firmware de almacenamiento.</p><p>Una vez generado el snapshot de respaldo, <strong>ningún usuario, administrador o malware con privilegios root puede cifrar, renombrar o borrar</strong> los datos durante el plazo de retención fijado. En caso de ataque total por ransomware, levantamos tus operaciones a partir del último snapshot inmutable en cuestión de minutos, con cero pérdida de datos y sin pagar extorsiones.</p>'
        },
        {
          badge: 'SOFTWARE',
          question: '¿El código fuente y las aplicaciones desarrolladas a medida pasan a ser 100% de nuestra propiedad?',
          answer: '<p><strong>Sí, de forma total y contractualmente garantizada.</strong> Entregamos todos los repositorios, documentación técnica, diagramas de arquitectura y derechos de explotación intelectual al finalizar cada sprint o proyecto.</p><p>Rechazamos el <em>vendor lock-in</em>. Creemos en la fidelización a través de la excelencia en ingeniería y servicio, no reteniendo clientes como rehenes de su propio software.</p>'
        },
        {
          badge: 'SLA 24/7',
          question: '¿Cómo aseguran un tiempo de respuesta menor a 15 minutos ante emergencias técnicas?',
          answer: '<p>Mediante un <strong>SOC (Security & Network Operations Center) con guardias activas las 24 horas del día</strong>, no sistemas de contestadores automáticos.</p><p>Nuestros sensores de red y telemetría disparan alertas automatizadas a los ingenieros de turno ante la primera anomalía de tráfico, consumo de CPU, intento de fuerza bruta o fallo de enlace. El ingeniero toma control del incidente de forma inmediata con protocolos de contención predefinidos, garantizando una respuesta en menos de 15 minutos bajo contrato.</p>'
        },
        {
          badge: 'PLAZOS',
          question: '¿Cuánto tiempo demora la puesta en marcha inicial del blindaje de una empresa?',
          answer: '<p><strong>Blindaje preventivo de choque en las primeras 24 horas:</strong> Aislamiento de puertos expuestos, configuración inicial de copias inmutables y monitoreo perimetral de emergencia.</p><p>El plan de auditoría profunda, análisis de vulnerabilidades, ethical hacking y configuración de la arquitectura Zero-Trust integral se completa típicamente en un plazo de 7 a 10 días hábiles, trabajando de manera completamente transparente y sin detener la operación de tu negocio.</p>'
        }
      ]
    },
    en: {
      navServices: 'Services',
      navSimulator: 'Attack Simulator',
      navDiagnostic: 'Diagnosis',
      navAbout: 'About Us',
      navFaq: 'FAQ',
      headerCta: 'Start Defense',
      heroBadge: 'DATA PROTECTION & ELITE DIGITAL ENGINEERING',
      heroTitle: 'We shield your data.<br><span class="text-gradient">We build your digital future.</span>',
      heroDesc: 'We secure your company’s information so you <strong>never lose it and no one can steal it</strong>. We develop <strong>100% custom enterprise software</strong> for any industry and back your operations with <strong>24/7 corporate engineering support</strong>.',
      heroBtnExplore: 'Explore Solutions',
      heroBtnSim: 'Simulate Attack & Defense',
      pillarsTag: 'OUR THREEFOLD ADVANTAGE',
      pillarsHeading: 'Three pillars of technological power for your enterprise',
      faqTag: 'FAQ // FREQUENTLY ASKED QUESTIONS',
      faqHeading: 'FAQ <span class="text-gradient">// Frequently Asked Questions</span>',
      faqSubheading: 'Absolute technical transparency on how we secure your data, how we operate, and what contractual guarantees back your enterprise.',
      footerFaq: 'FAQ // Frequently Asked Questions',
      waTitle: 'Quimera SOC Duty Engineer',
      waSub: 'SOC Online • SLA Response < 15 min',
      waBubble: '👋 Hello. Welcome to <strong>Quimera</strong> incident response center. How can we assist your enterprise today?',
      waEmergency: '🚨 Report Emergency Cyber Incident',
      waQuote: '💼 Request Defense / Custom Software Quote',
      waSchedule: '📅 Schedule Free Technical Assessment',
      faqItems: [
        {
          badge: 'IT TEAM',
          question: 'What happens if our company already has an in-house IT department?',
          answer: '<p><strong>Quimera does not replace your team; we shield and empower them.</strong> We operate as their elite cybersecurity division for advanced defense, ongoing penetration testing, cryptographic vaults, and 24/7/365 active monitoring.</p><p>We unburden your internal engineers from relentless security triage and equip them with military-grade tools (Zero-Trust, immutable WORM snapshots) that would otherwise require building an entire specialized security unit from scratch.</p>'
        },
        {
          badge: 'SOVEREIGNTY',
          question: 'Does our confidential data leave the enterprise or get stored in Quimera’s cloud?',
          answer: '<p><strong>You retain 100% sovereign control over your data and cryptographic keys.</strong> We engineer hybrid, on-premises, or dedicated private cloud architectures tailored to your infrastructure.</p><p>Master encryption keys (AES-256 GCM) remain strictly under your custody. Quimera configures the perimeter, vaults, and protocols, but <em>never</em> accesses in plaintext or stores your corporate database records on third-party servers.</p>'
        },
        {
          badge: 'RANSOMWARE',
          question: 'How does WORM storage guarantee that no ransomware can encrypt or delete backups?',
          answer: '<p>WORM stands for <em>Write Once, Read Many</em>. It is a kernel- and firmware-enforced immutability lock.</p><p>Once an immutable snapshot is written, <strong>no user, administrator, or malware with root privileges can modify, rename, or erase</strong> the data throughout the designated retention window. Even during a catastrophic ransomware infiltration, your business recovers in minutes from a clean snapshot with zero data loss and without paying ransoms.</p>'
        },
        {
          badge: 'SOFTWARE',
          question: 'Does our company own 100% of the custom software source code and IP developed by Quimera?',
          answer: '<p><strong>Yes, completely and backed by contract.</strong> All source code repositories, engineering documentation, architectural schematics, and intellectual property rights are officially transferred upon delivery.</p><p>We strictly reject vendor lock-in. We build long-term relationships through engineering excellence and reliable service, never by keeping clients hostage to proprietary black boxes.</p>'
        },
        {
          badge: '24/7 SLA',
          question: 'How do you guarantee a response time under 15 minutes during critical incidents?',
          answer: '<p>Through a <strong>dedicated SOC (Security & Network Operations Center) with active senior engineers on duty 24 hours a day</strong>, not automated voicemail tickets.</p><p>Network telemetry and intrusion sensors instantly trigger high-priority alerts to on-duty engineers at the first sign of abnormal traffic, CPU spikes, or brute-force attempts. Our engineers engage within minutes using predefined containment protocols, guaranteeing a sub-15-minute response SLA by contract.</p>'
        },
        {
          badge: 'TIMELINE',
          question: 'How long does the initial onboarding and enterprise defense deployment take?',
          answer: '<p><strong>Emergency preventative shielding within the first 24 hours:</strong> Closing exposed perimeter ports, establishing initial immutable backup pipelines, and deploying active telemetry probes.</p><p>The comprehensive vulnerability audit, ethical hacking assessment, and full Zero-Trust architecture hardening are completed within 7 to 10 business days, operating in parallel with zero disruption to daily business workflows.</p>'
        }
      ]
    }
  };

  switchBtn.addEventListener('click', () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';

    // Actualizar visual de botones
    const langTexts = switchBtn.querySelectorAll('.lang-text');
    langTexts.forEach((t) => {
      if (t.getAttribute('data-lang') === currentLang) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    const dict = translations[currentLang];

    // Actualizar elementos clave de navegación
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    if (navLinks.length >= 5) {
      navLinks[0].textContent = dict.navServices;
      navLinks[1].textContent = dict.navSimulator;
      navLinks[2].textContent = dict.navDiagnostic;
      navLinks[3].textContent = dict.navAbout;
      navLinks[4].textContent = dict.navFaq;
    }

    const headerCta = document.querySelector('#btn-header-cta span');
    if (headerCta) headerCta.textContent = dict.headerCta;

    const heroBadge = document.querySelector('.hero-pill-badge span:last-child');
    if (heroBadge) heroBadge.textContent = dict.heroBadge;

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.innerHTML = dict.heroTitle;

    const heroDesc = document.querySelector('.hero-description');
    if (heroDesc) heroDesc.innerHTML = dict.heroDesc;

    const btnHeroExplore = document.querySelector('#btn-hero-explore span');
    if (btnHeroExplore) btnHeroExplore.textContent = dict.heroBtnExplore;

    const btnHeroSim = document.querySelector('#btn-hero-sim span');
    if (btnHeroSim) btnHeroSim.textContent = dict.heroBtnSim;

    const pillarsTag = document.querySelector('#pilares .section-tag');
    if (pillarsTag) pillarsTag.textContent = dict.pillarsTag;

    const pillarsHeading = document.querySelector('#pilares .section-heading');
    if (pillarsHeading) pillarsHeading.textContent = dict.pillarsHeading;

    // Actualizar sección FAQ (Punto 3)
    const faqTag = document.querySelector('#faq .section-tag');
    if (faqTag) faqTag.textContent = dict.faqTag;

    const faqHeading = document.querySelector('#faq .section-heading');
    if (faqHeading) faqHeading.innerHTML = dict.faqHeading;

    const faqSubheading = document.querySelector('#faq .section-subheading');
    if (faqSubheading && dict.faqSubheading) faqSubheading.textContent = dict.faqSubheading;

    const footerFaq = document.getElementById('footer-faq-link');
    if (footerFaq && dict.footerFaq) footerFaq.textContent = dict.footerFaq;

    // Actualizar widget flotante WhatsApp
    const waTitle = document.querySelector('.whatsapp-popover-title');
    if (waTitle && dict.waTitle) waTitle.textContent = dict.waTitle;

    const waSub = document.querySelector('.whatsapp-popover-sub');
    if (waSub && dict.waSub) waSub.textContent = dict.waSub;

    const waBubble = document.querySelector('.wa-bubble');
    if (waBubble && dict.waBubble) waBubble.innerHTML = dict.waBubble;

    const waBtns = document.querySelectorAll('.wa-quick-actions .wa-action-btn');
    if (waBtns.length >= 3) {
      if (dict.waEmergency) waBtns[0].textContent = dict.waEmergency;
      if (dict.waQuote) waBtns[1].textContent = dict.waQuote;
      if (dict.waSchedule) waBtns[2].textContent = dict.waSchedule;
    }

    // Actualizar cada pregunta y respuesta del acordeón
    const faqElements = document.querySelectorAll('.faq-item');
    if (dict.faqItems && faqElements.length === dict.faqItems.length) {
      faqElements.forEach((item, index) => {
        const itemData = dict.faqItems[index];
        const badgeEl = item.querySelector('.faq-badge');
        const titleEl = item.querySelector('.faq-title');
        const innerEl = item.querySelector('.faq-answer-inner');
        const answerEl = item.querySelector('.faq-answer');

        if (badgeEl) badgeEl.textContent = itemData.badge;
        if (titleEl) titleEl.textContent = itemData.question;
        if (innerEl) innerEl.innerHTML = itemData.answer;

        // Si el elemento está abierto, recalcular dinámicamente su altura
        if (item.classList.contains('active') && answerEl) {
          answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
        }
      });
    }

    document.documentElement.lang = currentLang;

    if (audioEngine) {
      audioEngine.playChime(currentLang === 'en' ? 740 : 520, 'triangle', 0.15);
    }
  });
}


