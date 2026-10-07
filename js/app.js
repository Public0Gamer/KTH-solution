/**
 * KTH SOLUTIONS PVT LTD - Interactive Cyber-Luxury Web Application
 * Features: Live CCTV Camera HUD Simulator, Dynamic Quotation Engine,
 * Lens FOV Visualizer, Consultation Dispatcher, WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initCctvSimulator();
  initQuoteCalculator();
  initFovVisualizer();
  initContactForm();
  initMobileMenu();
  initScrollAnimations();
});

/* ==========================================================================
   1. REAL-TIME LIVE TELEMETRY CLOCK
   ========================================================================== */
function initLiveClock() {
  const clockEls = document.querySelectorAll('.live-timecode');
  if (!clockEls.length) return;

  function update() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const pad3 = (n) => String(n).padStart(3, '0');
    
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const mins = pad(now.getMinutes());
    const secs = pad(now.getSeconds());
    const ms = pad3(Math.floor(now.getMilliseconds()));

    const timeStr = `${year}-${month}-${day} ${hours}:${mins}:${secs}.${ms}`;
    clockEls.forEach(el => {
      el.textContent = timeStr;
    });
  }

  setInterval(update, 47);
  update();
}

/* ==========================================================================
   2. INTERACTIVE LIVE CCTV CAMERA HUD SIMULATOR
   ========================================================================== */
function initCctvSimulator() {
  const viewport = document.getElementById('cctv-viewport');
  const feedBg = document.getElementById('cctv-feed-image');
  const targetBoxes = document.querySelectorAll('.cctv-target-box');
  const camZoneName = document.getElementById('cctv-zone-name');
  const camZoneCode = document.getElementById('cctv-zone-code');
  const camResolution = document.getElementById('cctv-resolution');
  const camFps = document.getElementById('cctv-fps');
  const camLux = document.getElementById('cctv-lux');
  const scanline = document.getElementById('cctv-scanline');
  
  // Controls
  const modeToggles = document.querySelectorAll('[data-cam-mode]');
  const channelBtns = document.querySelectorAll('[data-cam-channel]');
  const toggleAiBtn = document.getElementById('toggle-ai-detection');
  const toggleGridBtn = document.getElementById('toggle-cam-grid');
  const toggleNightBtn = document.getElementById('toggle-cam-night');
  const gridOverlay = document.getElementById('cctv-grid-overlay');

  if (!viewport) return;

  const channels = {
    '1': {
      code: 'CH-01 // ANPR_UHD',
      name: 'Main Perimeter & Vehicle Gate',
      resolution: '4K UHD (3840x2160)',
      fps: '60 FPS',
      lux: '0.0005 LUX',
      image: 'assets/hero_camera.jpg',
      targets: [
        { label: 'VEHICLE DETECTED: SEDAN [99.4%]', top: '42%', left: '35%', width: '38%', height: '32%', color: 'border-sky-400' },
        { label: 'ANPR: DL-08-CC-4921 [VERIFIED]', top: '65%', left: '46%', width: '18%', height: '12%', color: 'border-emerald-400' }
      ]
    },
    '2': {
      code: 'CH-02 // SERVER_VAULT',
      name: 'Enterprise Server & Network Core',
      resolution: '4K AI HDR (3840x2160)',
      fps: '60 FPS',
      lux: '0.0010 LUX',
      image: 'assets/it_infrastructure.jpg',
      targets: [
        { label: 'SERVER RACK A-04 // NORMAL TEMP 21°C', top: '18%', left: '8%', width: '22%', height: '65%', color: 'border-cyan-400' },
        { label: 'ENGINEER AUTHORIZED: ID #KTH-804', top: '42%', left: '60%', width: '20%', height: '45%', color: 'border-emerald-400' }
      ]
    },
    '3': {
      code: 'CH-03 // DOME_360_INT',
      name: 'Luxury Showroom & Reception',
      resolution: '5MP STARLIGHT (2560x1440)',
      fps: '30 FPS',
      lux: '0.0002 LUX',
      image: 'assets/dome_camera.jpg',
      targets: [
        { label: 'HUMAN PRESENCE // 360° SPHERE OK', top: '35%', left: '32%', width: '36%', height: '38%', color: 'border-amber-400' }
      ]
    },
    '4': {
      code: 'CH-04 // HARDWARE_STATION',
      name: 'Central Control Station & IT Rack',
      resolution: '4K ULTRA (3840x2160)',
      fps: '60 FPS',
      lux: '0.0008 LUX',
      image: 'assets/banner_source.png',
      targets: [
        { label: 'SECURITY HARDWARE NODES ONLINE (7/7)', top: '30%', left: '45%', width: '48%', height: '52%', color: 'border-sky-400' }
      ]
    }
  };

  let currentChannel = '1';
  let isAiActive = true;
  let isNightActive = false;
  let isGridActive = true;

  // Channel switcher
  channelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const channel = btn.dataset.camChannel;
      if (channel === currentChannel) return;

      channelBtns.forEach(b => {
        b.classList.remove('bg-sky-500', 'text-white', 'border-sky-500', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      });
      btn.classList.add('bg-sky-500', 'text-white', 'border-sky-500', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');

      // Glitch flash transition
      viewport.style.filter = 'contrast(200%) brightness(150%) hue-rotate(90deg)';
      setTimeout(() => {
        loadChannel(channel);
        viewport.style.filter = isNightActive ? 'hue-rotate(180deg) saturate(140%) brightness(1.1)' : 'none';
      }, 140);
    });
  });

  function loadChannel(ch) {
    currentChannel = ch;
    const data = channels[ch];
    if (!data) return;

    if (camZoneName) camZoneName.textContent = data.name;
    if (camZoneCode) camZoneCode.textContent = data.code;
    if (camResolution) camResolution.textContent = data.resolution;
    if (camFps) camFps.textContent = data.fps;
    if (camLux) camLux.textContent = data.lux;

    if (feedBg) {
      feedBg.src = data.image;
    }

    renderTargets(data.targets);
  }

  function renderTargets(targets) {
    const container = document.getElementById('cctv-targets-container');
    if (!container) return;
    container.innerHTML = '';

    if (!isAiActive) return;

    targets.forEach((t, idx) => {
      const box = document.createElement('div');
      box.className = `hud-target-box ${t.color || 'border-cyan-400'} rounded transition-all duration-300`;
      box.style.top = t.top;
      box.style.left = t.left;
      box.style.width = t.width;
      box.style.height = t.height;

      box.innerHTML = `
        <span class="absolute -top-6 left-0 bg-slate-900/90 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
          ${t.label}
        </span>
      `;
      container.appendChild(box);
    });
  }

  // AI Toggle
  if (toggleAiBtn) {
    toggleAiBtn.addEventListener('click', () => {
      isAiActive = !isAiActive;
      toggleAiBtn.classList.toggle('bg-sky-100', isAiActive);
      toggleAiBtn.classList.toggle('text-sky-700', isAiActive);
      toggleAiBtn.classList.toggle('border-sky-300', isAiActive);
      renderTargets(channels[currentChannel].targets);
    });
  }

  // Grid Toggle
  if (toggleGridBtn) {
    toggleGridBtn.addEventListener('click', () => {
      isGridActive = !isGridActive;
      toggleGridBtn.classList.toggle('bg-sky-100', isGridActive);
      toggleGridBtn.classList.toggle('text-sky-700', isGridActive);
      toggleGridBtn.classList.toggle('border-sky-300', isGridActive);
      if (gridOverlay) {
        gridOverlay.style.display = isGridActive ? 'block' : 'none';
      }
    });
  }

  // Night Vision Toggle
  if (toggleNightBtn) {
    toggleNightBtn.addEventListener('click', () => {
      isNightActive = !isNightActive;
      toggleNightBtn.classList.toggle('bg-amber-100', isNightActive);
      toggleNightBtn.classList.toggle('text-amber-700', isNightActive);
      toggleNightBtn.classList.toggle('border-amber-400', isNightActive);
      
      const badge = document.getElementById('cctv-colorhunter-badge');
      if (badge) {
        badge.textContent = isNightActive ? 'COLORHUNTER STARLIGHT ON' : '4K DAYLIGHT HDR';
        badge.className = isNightActive ? 'text-amber-500 font-mono text-xs font-semibold' : 'text-sky-600 font-mono text-xs font-semibold';
      }

      if (viewport) {
        viewport.style.filter = isNightActive ? 'contrast(120%) brightness(1.15) hue-rotate(185deg) saturate(130%)' : 'none';
      }
    });
  }

  // Initialize Channel 1
  loadChannel('1');
}

/* ==========================================================================
   3. SMART CCTV & IT COST ESTIMATOR
   ========================================================================== */
function initQuoteCalculator() {
  const premiseRadios = document.querySelectorAll('input[name="premise-type"]');
  const cameraCountInput = document.getElementById('calc-camera-count');
  const cameraCountDisplay = document.getElementById('calc-camera-count-val');
  const cameraTypeSelect = document.getElementById('calc-camera-type');
  const storageSelect = document.getElementById('calc-storage-days');
  const addonCheckboxes = document.querySelectorAll('.calc-addon-check');

  // Outputs
  const totalDisplay = document.getElementById('calc-grand-total');
  const hardwareSubtotal = document.getElementById('calc-hardware-subtotal');
  const cablingSubtotal = document.getElementById('calc-cabling-subtotal');
  const installSubtotal = document.getElementById('calc-install-subtotal');
  const whatsappQuoteBtn = document.getElementById('calc-whatsapp-btn');
  const summaryPremise = document.getElementById('calc-summary-premise');
  const summaryCameras = document.getElementById('calc-summary-cameras');

  if (!cameraCountInput) return;

  function calculate() {
    let cameras = parseInt(cameraCountInput.value) || 4;
    if (cameraCountDisplay) cameraCountDisplay.textContent = cameras;

    let selectedPremise = document.querySelector('input[name="premise-type"]:checked')?.value || 'Corporate Office';
    if (summaryPremise) summaryPremise.textContent = selectedPremise;

    // Camera unit price based on grade
    let cameraPrice = 2800; // default 5MP
    let camName = '5MP AI Super HD Bullet/Dome';
    if (cameraTypeSelect) {
      const typeVal = cameraTypeSelect.value;
      if (typeVal === '4k-colorhunter') {
        cameraPrice = 4600;
        camName = '4K Ultra ColorHunter NightVision';
      } else if (typeVal === '4k-ptz') {
        cameraPrice = 14500;
        camName = '4K 360° PTZ Smart Tracking';
      } else if (typeVal === '2mp-hd') {
        cameraPrice = 1950;
        camName = '2MP Full HD Standard';
      }
    }

    // NVR/DVR + HDD calculation based on camera count and storage days
    let storageDays = parseInt(storageSelect?.value) || 30;
    let nvrChannels = cameras <= 4 ? 4 : (cameras <= 8 ? 8 : (cameras <= 16 ? 16 : 32));
    let nvrCost = nvrChannels === 4 ? 4500 : (nvrChannels === 8 ? 7800 : (nvrChannels === 16 ? 14500 : 26000));
    
    // Surveillance Grade HDD (Seagate SkyHawk / WD Purple)
    let hddCost = storageDays <= 15 ? 4200 : (storageDays <= 30 ? 7600 : 14200);

    // Camera Hardware total
    let totalCamHardware = (cameras * cameraPrice) + nvrCost + hddCost;

    // Structured Cabling, Connectors, Waterproof Junction Boxes, Power Supplies
    let cablingPerCam = 850;
    let totalCabling = cameras * cablingPerCam;

    // Certified Installation, Conduit Fitting, Angle Calibration & Mobile Config
    let installPerCam = 750;
    let baseInspectionAndConfig = 1800;
    let totalInstall = (cameras * installPerCam) + baseInspectionAndConfig;

    // IT Hardware Addons
    let addonsCost = 0;
    let selectedAddonsList = [];
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        const cost = parseInt(cb.dataset.addonPrice) || 0;
        addonsCost += cost;
        selectedAddonsList.push(cb.dataset.addonName);
      }
    });

    let grandTotal = totalCamHardware + totalCabling + totalInstall + addonsCost;

    // Update UI numbers
    const formatInr = (n) => '₹' + n.toLocaleString('en-IN');
    if (hardwareSubtotal) hardwareSubtotal.textContent = formatInr(totalCamHardware + addonsCost);
    if (cablingSubtotal) cablingSubtotal.textContent = formatInr(totalCabling);
    if (installSubtotal) installSubtotal.textContent = formatInr(totalInstall);
    if (totalDisplay) totalDisplay.textContent = formatInr(grandTotal);
    if (summaryCameras) summaryCameras.textContent = `${cameras}x ${camName}`;

    // WhatsApp Direct Payload
    if (whatsappQuoteBtn) {
      let message = `Hello KTH Solutions! 🛡️%0A%0AI used your website estimator for our security requirement:%0A- *Premises:* ${encodeURIComponent(selectedPremise)}%0A- *Cameras:* ${cameras}x ${encodeURIComponent(camName)}%0A- *Storage:* ${storageDays} Days Surveillance HDD%0A- *Selected Add-ons:* ${encodeURIComponent(selectedAddonsList.join(', ') || 'None')}%0A- *Estimated Budget:* ${encodeURIComponent(formatInr(grandTotal))}%0A%0APlease schedule a FREE On-Site Inspection & Security Audit for us. Thank you!`;
      whatsappQuoteBtn.href = `https://wa.me/919073968243?text=${message}`;
    }
  }

  // Event Listeners
  premiseRadios.forEach(r => r.addEventListener('change', calculate));
  cameraCountInput.addEventListener('input', calculate);
  if (cameraTypeSelect) cameraTypeSelect.addEventListener('change', calculate);
  if (storageSelect) storageSelect.addEventListener('change', calculate);
  addonCheckboxes.forEach(cb => cb.addEventListener('change', calculate));

  // Quick preset buttons for camera count (4, 8, 16, 32)
  const presetBtns = document.querySelectorAll('[data-cam-preset]');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cameraCountInput.value = btn.dataset.camPreset;
      presetBtns.forEach(b => b.classList.remove('bg-sky-600', 'text-white'));
      btn.classList.add('bg-sky-600', 'text-white');
      calculate();
    });
  });

  calculate();
}

/* ==========================================================================
   4. INTERACTIVE CAMERA LENS & FOV VISUALIZER
   ========================================================================== */
function initFovVisualizer() {
  const slider = document.getElementById('fov-lens-slider');
  const angleLabel = document.getElementById('fov-angle-label');
  const distanceLabel = document.getElementById('fov-distance-label');
  const usageLabel = document.getElementById('fov-usage-label');
  const fovCone = document.getElementById('fov-cone-path');

  if (!slider) return;

  const lensData = {
    '2.8': {
      angle: 108,
      distance: '15 - 20 Meters Wide',
      usage: 'Reception lobbies, retail shops, cash counters, wide gate entry',
      coneWidth: 120
    },
    '4.0': {
      angle: 84,
      distance: '25 - 35 Meters Balanced',
      usage: 'Office corridors, driveways, perimeter fence, warehouse lanes',
      coneWidth: 90
    },
    '6.0': {
      angle: 54,
      distance: '45 - 60 Meters Focused',
      usage: 'Long perimeter boundaries, parking alleys, factory assembly lines',
      coneWidth: 60
    },
    '12.0': {
      angle: 28,
      distance: '80 - 120 Meters Telephoto',
      usage: 'License plate ANPR capture, long highway entrance, high security zones',
      coneWidth: 32
    }
  };

  const steps = ['2.8', '4.0', '6.0', '12.0'];

  function update() {
    const stepIdx = parseInt(slider.value) || 1;
    const lensKey = steps[stepIdx] || '4.0';
    const data = lensData[lensKey] || lensData['4.0'];

    if (angleLabel) angleLabel.textContent = `${lensKey}mm Lens — ${data.angle}° Field of View`;
    if (distanceLabel) distanceLabel.textContent = data.distance;
    if (usageLabel) usageLabel.textContent = data.usage;

    if (fovCone) {
      // Dynamic SVG cone triangle path
      const halfWidth = data.coneWidth;
      const pathD = `M 150 20 L ${150 - halfWidth} 220 L ${150 + halfWidth} 220 Z`;
      fovCone.setAttribute('d', pathD);
    }
  }

  slider.addEventListener('input', update);
  update();
}

/* ==========================================================================
   5. CONSULTATION & SITE SURVEY FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('survey-booking-form');
  const successModal = document.getElementById('form-success-modal');
  const closeModalBtn = document.getElementById('close-success-modal');
  const modalWhatsappLink = document.getElementById('modal-whatsapp-link');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value || 'Client';
    const phone = document.getElementById('form-phone')?.value || '';
    const service = document.getElementById('form-service')?.value || 'CCTV Installation';
    const premise = document.getElementById('form-premise')?.value || 'General Site';
    const message = document.getElementById('form-notes')?.value || '';

    // Generate WhatsApp forward link
    const waText = `Hello KTH Solutions! 🛡️%0A%0AMy Name: *${encodeURIComponent(name)}*%0APhone: *${encodeURIComponent(phone)}*%0ARequirement: *${encodeURIComponent(service)}*%0APremise Type: *${encodeURIComponent(premise)}*%0ANotes: ${encodeURIComponent(message)}%0A%0APlease confirm my Free Site Survey schedule.`;
    
    if (modalWhatsappLink) {
      modalWhatsappLink.href = `https://wa.me/919073968243?text=${waText}`;
    }

    if (successModal) {
      successModal.classList.remove('hidden');
      successModal.classList.add('flex');
    }

    form.reset();
  });

  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
      successModal.classList.remove('flex');
    });
  }
}

/* ==========================================================================
   6. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function open() {
    drawer.classList.remove('translate-x-full');
  }

  function close() {
    drawer.classList.add('translate-x-full');
  }

  toggleBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  navLinks.forEach(link => link.addEventListener('click', close));
}

/* ==========================================================================
   7. SCROLL REVEALS & INTERACTIVE ACCORDIONS
   ========================================================================== */
function initScrollAnimations() {
  // Accordions for FAQs
  const faqButtons = document.querySelectorAll('.faq-toggle');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isExpanded = !content.classList.contains('hidden');

      // Close other open faqs
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

      if (!isExpanded) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });
}
