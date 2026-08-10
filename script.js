/* ==========================================================================
   CHINTAN HADIYA - 3D PORTFOLIO JS ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize System Core
    initCustomCursor();
    initThreeBackground();
    initScrollLogic();
    initSoundSynth();
    initDeveloperTerminal();
    initProjectSystem();
    initMobileNavigation();
    initGitHubIntegration();
});

/* ==========================================================================
   1. CUSTOM CURSOR TRAIL (LERP ANIMATION)
   ========================================================================== */
function initCustomCursor() {
    const glow = document.getElementById('custom-cursor-glow');
    const dot = document.getElementById('custom-cursor-dot');
    
    if (!glow || !dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate coordinates using Linear Interpolation (lerp) for smooth lag effect
    function animateCursor() {
        // Dot follows quickly
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;
        
        // Glow follows slowly with lag
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;

        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;
        
        glow.style.left = `${glowX}px`;
        glow.style.top = `${glowY}px`;

        requestAnimationFrame(animateCursor);
    }
    
    // Start loop
    animateCursor();

    // Scale effects on hover of interactive elements
    const hoverElements = document.querySelectorAll('a, button, .hologram-card, .glass-panel, input, textarea, .filter-tab');
    hoverElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            glow.style.width = '450px';
            glow.style.height = '450px';
            dot.style.transform = 'translate(-50%, -50%) scale(2.0)';
            dot.style.backgroundColor = '#ec4899';
            dot.style.boxShadow = '0 0 15px #ec4899';
        });
        
        elem.addEventListener('mouseleave', () => {
            glow.style.width = '350px';
            glow.style.height = '350px';
            dot.style.transform = 'translate(-50%, -50%) scale(1.0)';
            dot.style.backgroundColor = '#06b6d4';
            dot.style.boxShadow = '0 0 10px #06b6d4';
        });
    });
}

/* ==========================================================================
   2. THREE.JS 3D PARTICLE WAVE SYSTEM
   ========================================================================== */
function initThreeBackground() {
    const canvas = document.getElementById('three-bg-canvas');
    if (!canvas) return;

    // Create scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Create Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create Particle System geometry
    const particleCount = 700;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Cyber space color palette choices
    const colorChoices = [
        new THREE.Color('#8b5cf6'), // Purple
        new THREE.Color('#06b6d4'), // Cyan
        new THREE.Color('#ec4899'), // Pink
    ];

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Scattered spherical layout
        positions[i] = (Math.random() - 0.5) * 45;      // X
        positions[i + 1] = (Math.random() - 0.5) * 45;  // Y
        positions[i + 2] = (Math.random() - 0.5) * 35;  // Z

        // Color picking
        const randColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
        colors[i] = randColor.r;
        colors[i + 1] = randColor.g;
        colors[i + 2] = randColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle sprite drawing (Procedural round texture canvas)
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const ctx = pCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    // Material definitions
    const material = new THREE.PointsMaterial({
        size: 0.28,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        map: particleTexture,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 22;

    // Mouse Tracking Coordinates for Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // 1. Slow particle constellation rotation
        particles.rotation.y = elapsedTime * 0.015;
        particles.rotation.x = elapsedTime * 0.005;

        // 2. Wave movement effect (manipulating vertices)
        const posArray = geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Float up and down based on sine wave calculations
            posArray[i3 + 1] += Math.sin(elapsedTime + posArray[i3]) * 0.003;
        }
        geometry.attributes.position.needsUpdate = true;

        // 3. Smooth Camera Parallax lag
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
}

/* ==========================================================================
   3. SCROLL PROGRESS & INTERSECTION REVEALS
   ========================================================================== */
function initScrollLogic() {
    const progressLine = document.getElementById('scroll-progress-line');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Scroll Progress bar percentage updater
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const scrollPercent = (window.scrollY / totalHeight) * 100;
            if (progressLine) progressLine.style.width = `${scrollPercent}%`;
        }

        // Active Section Navigation Highlighter
        let activeId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                activeId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    });

    // Intersection Observer for scroll animations
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Animate numbers if it's the stats grid
                if (entry.target.classList.contains('stats-grid')) {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 2000; // 2 seconds
                        const increment = target / (duration / 16); // 60fps
                        
                        let current = 0;
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                counter.innerText = Math.ceil(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCounter();
                    });
                }

                // Animate progress bars for skills
                if (entry.target.classList.contains('skills-category-card')) {
                    const bars = entry.target.querySelectorAll('.progress-fill');
                    bars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        if (width) {
                            bar.style.width = width;
                        }
                    });
                }

                // Optional: stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   4. PROCEDURAL WEB AUDIO SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let soundMuted = true; // Disabled/muted by default to respect browser policies

function initSoundSynth() {
    const btn = document.getElementById('sound-toggle-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!audioCtx) {
            // Lazy initialization of audio context upon user gesture
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        soundMuted = !soundMuted;
        
        const icon = btn.querySelector('.volume-icon');
        const text = btn.querySelector('.audio-text');

        if (soundMuted) {
            text.textContent = 'SFX OFF';
            if (icon) icon.setAttribute('data-lucide', 'volume-x');
        } else {
            text.textContent = 'SFX ON';
            if (icon) icon.setAttribute('data-lucide', 'volume-2');
            
            // Play a success activation hum
            playUIMelody();
        }
        
        // Re-draw icons inside btn
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

    // Attach synth hooks to interactive items
    const elementsToSound = document.querySelectorAll('a, button, .filter-tab, .project-card-item, .hologram-card');
    elementsToSound.forEach(el => {
        el.addEventListener('mouseenter', () => playUISound(600, 'sine', 0.04, 0.05));
        el.addEventListener('click', () => playUISound(400, 'triangle', 0.1, 0.15));
    });
}

function playUISound(frequency, type = 'sine', volume = 0.08, duration = 0.05) {
    if (soundMuted || !audioCtx) return;
    
    try {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        
        // Volume envelopes (smooth fadeout to avoid clicking noises)
        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn('Audio synthesis issue:', e);
    }
}

function playUIMelody() {
    // Custom activation synth flourish
    const notes = [261.63, 329.63, 392.00, 523.25]; // C major chord
    notes.forEach((freq, idx) => {
        setTimeout(() => {
            playUISound(freq, 'sine', 0.1, 0.25);
        }, idx * 100);
    });
}

/* ==========================================================================
   5. DEVELOPER RETRO TERMINAL ENGINE
   ========================================================================== */
function initDeveloperTerminal() {
    const stdin = document.getElementById('terminal-stdin');
    const history = document.getElementById('terminal-history');
    const screen = document.getElementById('terminal-screen');
    const matrixCanvas = document.getElementById('matrix-canvas');

    if (!stdin || !history || !screen) return;

    // Database responses
    const terminalDb = {
        help: () => `
<div class="terminal-line text-cyan font-bold">AVAILABLE COMMANDS:</div>
<table style="width: 100%; border-collapse: collapse; margin: 8px 0;">
  <tr><td style="width: 120px;" class="text-purple font-bold">about</td><td>Displays biography summary</td></tr>
  <tr><td class="text-purple font-bold">skills</td><td>Queries skill assessment ratings</td></tr>
  <tr><td class="text-purple font-bold">education</td><td>Outputs academic credentials</td></tr>
  <tr><td class="text-purple font-bold">projects</td><td>Queries index of digital projects</td></tr>
  <tr><td class="text-purple font-bold">analyze</td><td>Triggers automated telemetry report parsing</td></tr>
  <tr><td class="text-purple font-bold">contact</td><td>Acquires email link details</td></tr>
  <tr><td class="text-purple font-bold">matrix</td><td>Warp terminal interface into code space matrix</td></tr>
  <tr><td class="text-purple font-bold">clear</td><td>Purges the log terminal screen history</td></tr>
</table>
`,
        about: () => `
<div class="terminal-line"><span class="font-bold">Name:</span> Chintan Hadiya</div>
<div class="terminal-line"><span class="font-bold">Subject:</span> B.Tech Computer Engineering</div>
<div class="terminal-line"><span class="font-bold">Campus:</span> IAR University (Admission Year: 2024, Graduation Year: 2028)</div>
<div class="terminal-line"><span class="font-bold">Focus:</span> Building full-stack web solutions, systems computing, algorithms visualization, and procedural interactive frontends.</div>
`,
        skills: () => `
<div class="terminal-line text-cyan font-bold">SKILL METRICS ANALYSIS:</div>
<div class="terminal-line">Python           [████████████████░░░] 85%</div>
<div class="terminal-line">C++              [████████████████░░░] 80%</div>
<div class="terminal-line">HTML5/CSS3       [█████████████████░░] 87%</div>
<div class="terminal-line">JavaScript       [███████████████░░░░] 75%</div>
<div class="terminal-line">Git / Linux      [███████████████░░░░] 75%</div>
<div class="terminal-line">Algorithms/SQL   [██████████████░░░░░] 70%</div>
`,
        education: () => `
<div class="terminal-line text-purple font-bold">IAR UNIVERSITY (2024 - 2028)</div>
<div class="terminal-line">- Course: Bachelor of Technology (B.Tech) in Computer Engineering</div>
<div class="terminal-line">- Specialization: Cybersecurity & Network Systems</div>
<div class="terminal-line">- Key Topics: Cybersecurity, Network Defense, Data Structures, OOP, OS Theory, Web Apps Design.</div>
`,
        projects: () => `
<div class="terminal-line text-cyan font-bold">PROJECT METADATA INDEX:</div>
<div class="terminal-line">1. <span class="font-bold">SchemeDekho</span> (Flask/Python) - Smart government schemes eligibility portal.</div>
<div class="terminal-line">2. <span class="font-bold">Portfolio Website</span> (JS/Three.js/Flask) - Interactive 3D web portfolio & ATS analyzer system.</div>
`,
        analyze: () => `
<div class="terminal-line text-cyan font-bold">ATS METADATA SCANNING:</div>
<div class="terminal-line">&gt; Loading pdf document stream ... OK</div>
<div class="terminal-line">&gt; Parsing keywords and ratings ... OK</div>
<div class="terminal-line">&gt; Found languages: Python, C++, Java, C</div>
<div class="terminal-line">&gt; Certifications checked: Canva A+, Python 101, Google Analytics</div>
<div class="terminal-line">&gt; Estimated Profile Score: <span class="text-green font-bold">94 / 100</span></div>
<div class="terminal-line">&gt; AI evaluation: Dual-capable developer and graphic designer with Flask web application coursework. Recommendation matches high suitability for full-stack engineering entries.</div>
`,
        contact: () => `
<div class="terminal-line">Direct connection lines:</div>
<div class="terminal-line">Email: <a href="mailto:chintanhadiya83@gmail.com" class="text-cyan">chintanhadiya83@gmail.com</a></div>
<div class="terminal-line">GitHub: <a href="https://github.com/chintanhadiya012" target="_blank" class="text-cyan">github.com/chintanhadiya012</a></div>
<div class="terminal-line">LinkedIn: <a href="https://linkedin.com" target="_blank" class="text-cyan">linkedin.com/in/chintan</a></div>
`,
        secret: () => `
<div class="terminal-line text-pink font-bold">*** SYSTEM EASTER EGG ***</div>
<div class="terminal-line">You cracked the server! Antigravity code active. 3D engine operating at 100% computational efficiency. Keep building.</div>
`
    };

    // Keyboard Event Handler
    stdin.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawVal = stdin.value.trim();
            const cmd = rawVal.toLowerCase();
            stdin.value = '';

            if (cmd === '') return;

            // Generate terminal print noise
            playUISound(800, 'sine', 0.05, 0.02);

            // Log command in screen history
            const userLine = document.createElement('div');
            userLine.className = 'terminal-line';
            userLine.innerHTML = `<span class="terminal-prompt">PS C:\\Users\\chintan&gt;</span> <span class="text-main">${rawVal}</span>`;
            history.appendChild(userLine);

            // Output logic
            const outputBlock = document.createElement('div');
            outputBlock.className = 'terminal-output-block';

            if (cmd === 'clear' || cmd === 'cls') {
                history.innerHTML = '';
            } else if (cmd === 'matrix') {
                outputBlock.innerHTML = `<div class="terminal-line text-green">Loading matrix digital rain...</div>`;
                history.appendChild(outputBlock);
                startMatrixRain();
            } else if (cmd === 'analyze' || cmd === 'analysis') {
                outputBlock.innerHTML = `<div class="terminal-line text-cyan font-bold">ATS METADATA SCANNING:</div>`;
                history.appendChild(outputBlock);
                
                const lines = [
                    "&gt; [1/8] Connection established ... OK",
                    "&gt; [2/8] Parsing credentials stream: ch_resume.pdf ... OK",
                    "&gt; [3/8] Checking languages: C++, Python, Java ... OK",
                    "&gt; [4/8] Evaluating layout and ATS optimization ... 94%",
                    "&gt; [5/8] Key Strengths: Full-stack Development, Graphic Design, Data Analytics",
                    "&gt; [6/8] Certifications: Canva A+, Python 101, Google Analytics",
                    "&gt; [7/8] Recommendation: High suitability for engineering roles.",
                    "&gt; [8/8] Telemetry compilation finished."
                ];
                
                stdin.disabled = true; // Disable typing during logs sequence
                
                lines.forEach((line, index) => {
                    setTimeout(() => {
                        const lineDiv = document.createElement('div');
                        lineDiv.className = 'terminal-line';
                        if (index === lines.length - 1) {
                            lineDiv.className = 'terminal-line text-green font-bold';
                        }
                        lineDiv.innerHTML = line;
                        outputBlock.appendChild(lineDiv);
                        screen.scrollTop = screen.scrollHeight;
                        playUISound(850, 'sine', 0.03, 0.02);
                        
                        if (index === lines.length - 1) {
                            stdin.disabled = false;
                            stdin.focus();
                            playUIMelody();
                        }
                    }, (index + 1) * 400);
                });
            } else if (terminalDb[cmd]) {
                outputBlock.innerHTML = terminalDb[cmd]();
                history.appendChild(outputBlock);
            } else {
                outputBlock.innerHTML = `<div class="terminal-line text-pink">Error: Command "${rawVal}" not recognized. Type <span class="text-purple font-bold">help</span> to view available database instructions.</div>`;
                history.appendChild(outputBlock);
            }

            // Keep scrolled to bottom
            screen.scrollTop = screen.scrollHeight;
        }
    });

    // Click anywhere on terminal body to focus input
    screen.addEventListener('click', () => {
        stdin.focus();
    });

    // Matrix Digital Rain Program
    let matrixInterval = null;

    function startMatrixRain() {
        if (!matrixCanvas) return;
        
        matrixCanvas.classList.remove('hidden');
        stdin.disabled = true; // Disable typing during animation
        
        const mCtx = matrixCanvas.getContext('2d');
        
        // Resize canvas
        matrixCanvas.width = matrixCanvas.parentElement.offsetWidth;
        matrixCanvas.height = matrixCanvas.parentElement.offsetHeight - 42;

        const columns = Math.floor(matrixCanvas.width / 14);
        const yPos = Array(columns).fill(0);

        // Web Audio Hum sound sweep
        if (!soundMuted && audioCtx) {
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(60, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 3);
                gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 3.5);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 3.8);
            } catch (e) {}
        }

        function drawMatrix() {
            mCtx.fillStyle = 'rgba(0, 0, 0, 0.06)';
            mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            mCtx.fillStyle = '#0f0';
            mCtx.font = '14px monospace';

            for (let i = 0; i < yPos.length; i++) {
                // Random binary character selection
                const char = Math.random() > 0.5 ? '1' : '0';
                const x = i * 14;
                const y = yPos[i];

                mCtx.fillText(char, x, y);

                if (y > 100 + Math.random() * 10000) {
                    yPos[i] = 0;
                } else {
                    yPos[i] += 14;
                }
            }
        }

        matrixInterval = setInterval(drawMatrix, 33);

        // Self shutdown after 5.5 seconds
        setTimeout(() => {
            clearInterval(matrixInterval);
            matrixCanvas.classList.add('hidden');
            stdin.disabled = false;
            stdin.focus();
            
            // Append completion status to shell log
            const doneBlock = document.createElement('div');
            doneBlock.className = 'terminal-line text-green font-bold';
            doneBlock.textContent = 'Matrix simulation exit complete. Command execution logic restored.';
            history.appendChild(doneBlock);
            screen.scrollTop = screen.scrollHeight;
        }, 5500);
    }
}

/* ==========================================================================
   6. PROJECTS MODALS & CATEGORIES FILTRATION
   ========================================================================= */
function initProjectSystem() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card-item');

    // Tab Filters
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Manage Active Class
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterVal = tab.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterVal === 'all' || category === filterVal) {
                    card.classList.remove('hidden');
                    // Add animate back
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    // Timeout to hide layout
                    setTimeout(() => {
                        if (card.style.opacity === '0') {
                            card.classList.add('hidden');
                        }
                    }, 300);
                }
            });
        });
    });

    // Project Details Data
    const projectDetails = {
        schemedekho: {
            title: 'SchemeDekho',
            tag: 'WEB APPLICATION / GOVERNMENT ELIGIBILITY PORTAL',
            icon: 'search',
            desc: 'SchemeDekho is a smart eligibility discovery platform designed to connect citizens with government schemes. The application processes demographic attributes (age, location, occupation, gender, income) and runs them through logical matching trees on a Python Flask back-end to return a personalized, filtered scheme list in real time.',
            specs: [
                ['Backend Stack', 'Python / Flask'],
                ['Frontend Stack', 'HTML5 / Custom CSS3 / ES6 JavaScript'],
                ['Heuristics Model', 'Multi-attribute eligibility matching decision trees'],
                ['Deployment Status', 'Completed & coursework approved']
            ],
            demoUrl: 'http://localhost:5000',
            repoUrl: 'https://github.com/chintanhadiya012/Scheme-Dekho'
        },
        portfolio: {
            title: 'Portfolio Website',
            tag: 'WEB SYSTEM / 3D GRAPHICS & ATS ENGINE',
            icon: 'layers',
            desc: 'A state-of-the-art interactive 3D portfolio platform designed to showcase software engineering, system architecture, and cybersecurity specialization. Built with custom Vanilla CSS glassmorphism, Three.js hardware-accelerated background particle mesh, live GitHub REST API integration, an interactive PowerShell terminal, and a client-side ATS Resume Analyzer.',
            specs: [
                ['Frontend Stack', 'HTML5 / Vanilla CSS3 / ES6 JavaScript'],
                ['Graphics Engine', 'Three.js / WebGL hardware acceleration'],
                ['Backend Services', 'Python Flask API & SMTP Gateway'],
                ['Integrations', 'Live GitHub REST API & ATS Score Evaluator']
            ],
            demoUrl: '#hero',
            repoUrl: 'https://github.com/chintanhadiya012'
        }
    };

    // Modal Control Logic
    const modal = document.getElementById('details-project-modal');
    const viewport = document.getElementById('modal-viewport');
    const closeBtn = document.getElementById('modal-close-button');

    if (!modal || !viewport || !closeBtn) return;

    // Attach click triggers to details buttons
    const triggers = document.querySelectorAll('.project-modal-trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const pId = trigger.getAttribute('data-project-id');
            const data = projectDetails[pId];

            if (data) {
                // Populate Modal content dynamically
                let specsHtml = '';
                data.specs.forEach(spec => {
                    specsHtml += `
                    <div class="spec-line">
                        <span>${spec[0]}</span>
                        <span class="font-code text-cyan">${spec[1]}</span>
                    </div>`;
                });

                viewport.innerHTML = `
                    <div class="modal-project-header">
                        <div class="modal-proj-icon-bg">
                            <i data-lucide="${data.icon}" class="modal-proj-icon text-purple"></i>
                        </div>
                        <div>
                            <span class="modal-project-tag">${data.tag}</span>
                            <h3 class="modal-project-title">${data.title}</h3>
                        </div>
                    </div>
                    <p class="modal-project-desc">${data.desc}</p>
                    <div class="modal-project-specs">
                        ${specsHtml}
                    </div>
                    <div class="modal-actions-row">
                        <a href="${data.demoUrl}" target="_blank" class="action-btn btn-primary btn-sm">Launch Live Demo</a>
                        <a href="${data.repoUrl}" target="_blank" class="action-btn btn-secondary-outline btn-sm">GitHub Repository</a>
                    </div>
                `;

                // Run icon injection for new dynamic tags
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                // Show modal overlay
                modal.classList.remove('hidden');
                modal.ariaHidden = "false";
                document.body.style.overflow = 'hidden'; // Lock background scroll
            }
        });
    });

    // Close Modal actions
    function closeModal() {
        modal.classList.add('hidden');
        modal.ariaHidden = "true";
        document.body.style.overflow = 'auto'; // Restore scroll
    }

    closeBtn.addEventListener('click', closeModal);
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   7. FORM VALIDATION & SIMULATED SUBMIT
   ========================================================================== */
const contactForm = document.getElementById('portfolio-form');
const successAlert = document.getElementById('form-alert-feedback');
const resetBtn = document.getElementById('btn-reset-contact-form');

if (contactForm && successAlert) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Disable submit button and animate
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending... <span class="spinner"></span>`;
        
        // Play click sound
        playUISound(300, 'sine', 0.1, 0.4);

        // Extract form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Send real network request
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            contactForm.classList.add('hidden');
            successAlert.classList.remove('hidden');
            
            // Play success chime
            playUIMelody();
        })
        .catch(error => {
            console.error('Error:', error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            alert('There was an error sending the message. Please check the server connection or your App Password settings.');
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Reset fields
            contactForm.reset();
            
            // Re-show form
            successAlert.classList.add('hidden');
            contactForm.classList.remove('hidden');
            
            // Re-enable submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.innerHTML = `Send Message <i data-lucide="send" class="btn-icon"></i>`;
            
            // Reinitialize lucide inside button
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }
}

/* ==========================================================================
   8. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileNavigation() {
    const toggle = document.getElementById('hamburger-btn');
    const drawer = document.getElementById('mobile-nav-overlay');
    const drawerLinks = document.querySelectorAll('.mobile-link');

    if (!toggle || !drawer) return;

    function toggleMenu() {
        toggle.classList.toggle('active');
        drawer.classList.toggle('active');
        
        // Sound beep
        playUISound(450, 'sine', 0.08, 0.1);
        
        // Prevent body scroll when menu open
        if (drawer.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    toggle.addEventListener('click', toggleMenu);

    // Close menu when clicking link items
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // Footer current year injection
    const yrTxt = document.getElementById('current-year-txt');
    if (yrTxt) {
        yrTxt.textContent = new Date().getFullYear();
    }
}

/* ==========================================================================
   9. LIVE GITHUB INTEGRATION
   ========================================================================== */
async function initGitHubIntegration() {
    const username = 'chintanhadiya012';
    const loading = document.getElementById('github-loading');
    const content = document.getElementById('github-content');
    
    if (!loading || !content) return;

    try {
        // Fetch User Data from GitHub API
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error('User not found');
        const userData = await userRes.json();

        const ghAvatar = document.getElementById('gh-avatar');
        if (ghAvatar) ghAvatar.src = userData.avatar_url;
        
        const ghName = document.getElementById('gh-name');
        if (ghName) ghName.innerText = userData.name || userData.login;
        
        const ghUsername = document.getElementById('gh-username');
        if (ghUsername) ghUsername.innerText = userData.login;
        
        const ghLink = document.getElementById('gh-link');
        if (ghLink) ghLink.href = userData.html_url;
        
        const ghRepos = document.getElementById('gh-repos');
        if (ghRepos) ghRepos.innerText = userData.public_repos;
        
        const ghFollowers = document.getElementById('gh-followers');
        if (ghFollowers) ghFollowers.innerText = userData.followers;

        // Fetch Repositories
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const reposData = await reposRes.json();
        
        const reposList = document.getElementById('gh-repos-list');
        if (reposList) {
            reposList.innerHTML = '';
            
            if (Array.isArray(reposData) && reposData.length > 0) {
                reposData.forEach(repo => {
                    const card = document.createElement('div');
                    card.className = 'gh-repo-card';
                    card.innerHTML = `
                        <a href="${repo.html_url}" target="_blank" class="gh-repo-name">
                            <i data-lucide="book-open" style="width: 14px; height: 14px; display: inline-block; margin-right: 6px; vertical-align: middle;"></i>
                            ${repo.name}
                        </a>
                        <p class="gh-repo-desc">${repo.description || 'No description available.'}</p>
                        <div class="gh-repo-meta">
                            <span><i data-lucide="star" style="width: 12px; height: 12px; vertical-align: bottom;"></i> ${repo.stargazers_count}</span>
                            <span><i data-lucide="git-fork" style="width: 12px; height: 12px; vertical-align: bottom;"></i> ${repo.forks_count}</span>
                            <span style="color: var(--color-purple);">${repo.language || ''}</span>
                        </div>
                    `;
                    reposList.appendChild(card);
                });
            } else {
                reposList.innerHTML = `<p class="text-muted" style="padding: 10px;">No public repositories found for @${username}.</p>`;
            }
        }

        // Re-initialize lucide icons for new elements
        if (typeof window.lucide !== 'undefined') {
            window.lucide.createIcons();
        }

        loading.style.display = 'none';
        content.style.display = 'flex';
        content.classList.remove('hidden');

    } catch (error) {
        loading.innerText = 'Failed to load GitHub data. Please verify network connection.';
        console.error('GitHub fetch error:', error);
    }
}
