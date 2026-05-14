// ═══════ THEME ═══════
const toggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
html.dataset.theme = savedTheme;
toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

toggle.addEventListener('click', () => {
    const isDark = html.dataset.theme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    html.dataset.theme = nextTheme;
    toggle.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('portfolio-theme', nextTheme);
});

// ═══════ SCROLL PROGRESS ═══════
const prog = document.getElementById('scrollProgress');
const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
    const s = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (s / h * 100) + '%';
    nav.classList.toggle('scrolled', s > 50);
});

// ═══════ CURSOR GLOW ═══════
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
    glow.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
});

// ═══════ TYPING ANIMATION ═══════
const phrases = [
    'Bioinformatics Researcher',
    'Multi-omics Specialist',
    'Deep Learning Developer',
    'CSIR-IHBT Dissertation Work',
    'Regulatory Genomics Enthusiast'
];
let pi = 0, ci = 0, del = false;
const typ = document.getElementById('typing');

function type() {
    const p = phrases[pi];
    if (!del) {
        typ.textContent = p.slice(0, ++ci);
        if (ci === p.length) {
            del = true;
            setTimeout(type, 2000);
            return;
        }
    } else {
        typ.textContent = p.slice(0, --ci);
        if (ci === 0) {
            del = false;
            pi = (pi + 1) % phrases.length;
            setTimeout(type, 400);
            return;
        }
    }
    setTimeout(type, del ? 30 : 60);
}
if (typ) type();

// ═══════ REVEAL ON SCROLL ═══════
const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ═══════ 3D TILT ═══════
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
        card.style.transition = 'transform 0.1s';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s';
    });
});

// ═══════ DNA PARTICLES ═══════
const can = document.getElementById('dna-canvas');
if (can) {
    const ctx = can.getContext('2d');
    let W, H;
    function resize() {
        W = can.width = window.innerWidth;
        H = can.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const pts = [];
    class P {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.r = Math.random() * 1.5 + 0.5;
            this.a = Math.random() * 0.4 + 0.1;
            const colors = ['255,153,200', '157,141,241', '208,244,222', '255,200,221'];
            this.c = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.c}, ${this.a})`;
            ctx.fill();
        }
    }
    for (let i = 0; i < 70; i++) pts.push(new P());

    function anim() {
        ctx.clearRect(0, 0, W, H);
        pts.forEach(p => {
            p.update();
            p.draw();
        });
        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const dx = pts[i].x - pts[j].x;
                const dy = pts[i].y - pts[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 100) {
                    ctx.beginPath();
                    ctx.moveTo(pts[i].x, pts[i].y);
                    ctx.lineTo(pts[j].x, pts[j].y);
                    ctx.strokeStyle = `rgba(157,141,241, ${0.08 * (1 - d / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(anim);
    }
    anim();
}

// ═══════ SMOOTH ANCHOR ═══════
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
