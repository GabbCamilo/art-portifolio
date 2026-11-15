/* ========================================
   ART PORTFOLIO — FRONTEND VANILLA JS
   Header com destaque, hero editorial
   50/50 e muro de fotos em grade fluida.
   Dados via fetch() na API (Etapa 05),
   com fallback simulado se a API estiver
   indisponível.
   ======================================== */

/* -------------------------------------
   1. DADOS SIMULADOS (fallback offline)
   ------------------------------------- */

const SIMULATED_ARTIST = {
    name: 'Kenyureru',
    location: 'São Paulo, Brasil',
    medium: 'Digital',
    website: 'https://exemplo.com',
    store: 'N/A',
    patreon: 'N/A',
};

const SIMULATED_PUBLICATIONS = [
    {
        id: 'featured-01',
        title: 'Retratos Urbanos',
        description: 'Uma série de esboços rápidos capturando a luz da cidade ao entardecer.',
        complementary: 'Obra selecionada manualmente pelo proprietário como publicação principal. Dados simulados até a integração com backend.',
        date: '2026-05-12',
        featured: true,
        image: {
            file_name: 'retratos-urbanos.jpg',
            file_size: '2,4 MB',
            width: 1200,
            height: 900,
            tone: 0,
        },
    },
    {
        id: 'pub-02',
        title: 'Natureza Abstrata',
        description: 'Exploração de texturas e gradientes em óleo sobre tela grande.',
        complementary: '',
        date: '2026-04-08',
        featured: false,
        image: {
            file_name: 'natureza-abstrata.jpg',
            file_size: '1,8 MB',
            width: 1600,
            height: 900,
            tone: 1,
        },
    },
    {
        id: 'pub-03',
        title: 'Figuras em Movimento',
        description: 'Desenhos de carvão estudando posa e gesto humano.',
        complementary: '',
        date: '2026-03-22',
        featured: false,
        image: {
            file_name: 'figuras-em-movimento.jpg',
            file_size: '3,1 MB',
            width: 1000,
            height: 1400,
            tone: 2,
        },
    },
    {
        id: 'pub-04',
        title: 'Cidade Noturna',
        description: 'Pintura digital experimentando paletas monocromáticas.',
        complementary: '',
        date: '2026-02-18',
        featured: false,
        image: {
            file_name: 'cidade-noturna.jpg',
            file_size: '2,2 MB',
            width: 1400,
            height: 1000,
            tone: 3,
        },
    },
    {
        id: 'pub-05',
        title: 'Auto-retrato Expressivo',
        description: 'Técnica mista sobre papel kraft, 2024.',
        complementary: '',
        date: '2026-02-05',
        featured: false,
        image: {
            file_name: 'auto-retrato-expressivo.jpg',
            file_size: '1,5 MB',
            width: 1000,
            height: 1000,
            tone: 4,
        },
    },
    {
        id: 'pub-06',
        title: 'Maré Baixa',
        description: 'Estudo de luz sobre água em aquarela digital.',
        complementary: '',
        date: '2026-01-20',
        featured: false,
        image: {
            file_name: 'mare-baixa.jpg',
            file_size: '2,0 MB',
            width: 1500,
            height: 1000,
            tone: 5,
        },
    },
    {
        id: 'pub-07',
        title: 'Silêncio do Interior',
        description: 'Composição minimalista com formas orgânicas.',
        complementary: '',
        date: '2025-12-11',
        featured: false,
        image: {
            file_name: 'silencio-do-interior.jpg',
            file_size: '2,7 MB',
            width: 1200,
            height: 1500,
            tone: 6,
        },
    },
    {
        id: 'pub-08',
        title: 'Entre Linhas',
        description: 'Collage digital explorando geometria e espaço negativo.',
        complementary: '',
        date: '2025-11-03',
        featured: false,
        image: {
            file_name: 'entre-linhas.jpg',
            file_size: '1,9 MB',
            width: 1600,
            height: 1200,
            tone: 7,
        },
    },
    {
        id: 'pub-09',
        title: 'Jardim Suspenso',
        description: 'Ilustração botânica com paleta restrita.',
        complementary: '',
        date: '2025-10-15',
        featured: false,
        image: {
            file_name: 'jardim-suspenso.jpg',
            file_size: '2,3 MB',
            width: 1000,
            height: 1300,
            tone: 8,
        },
    },
    {
        id: 'pub-10',
        title: 'Última Luz',
        description: 'Estudo final de dia ao entardecer.',
        complementary: '',
        date: '2025-09-28',
        featured: false,
        image: {
            file_name: 'ultima-luz.jpg',
            file_size: '1,6 MB',
            width: 1400,
            height: 900,
            tone: 9,
        },
    },
];

/* -------------------------------------
   2. CONFIGURAÇÃO E ESTADO
   ------------------------------------- */

const API_BASE = 'http://localhost:3000/api';
const BATCH_INITIAL = 6;
const BATCH_NEXT = 4;
const INDICATOR_COUNT = 5;
const PREV_CLICK_ZONE_RATIO = 0.25;

const state = {
    artist: null,
    featured: null,
    collection: [],
    total: 0,
    renderedCount: 0,
    useApi: false,
    lightboxIndex: 0,
    lastFocusedElement: null,
};

/* -------------------------------------
   3. ACESSO A DADOS (API + fallback)
   ------------------------------------- */

async function apiFetch(path) {
    const res = await fetch(API_BASE + path);
    if (!res.ok) {
        throw new Error(`API ${path} respondeu ${res.status}`);
    }
    return res.json();
}

async function loadArtist() {
    return apiFetch('/artist');
}

async function loadFeatured() {
    const data = await apiFetch('/publications?featured=true');
    return data.items[0] || null;
}

async function loadFeedBatch(limit, offset) {
    return apiFetch(`/publications?featured=false&limit=${limit}&offset=${offset}`);
}

function useSimulatedFallback() {
    state.artist = SIMULATED_ARTIST;
    state.featured = SIMULATED_PUBLICATIONS.find(p => p.featured) || null;
    state.collection = SIMULATED_PUBLICATIONS
        .filter(p => !p.featured)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    state.total = state.collection.length;
    state.useApi = false;
}

async function loadInitialData() {
    state.artist = await loadArtist();
    state.featured = await loadFeatured();
    const first = await loadFeedBatch(BATCH_INITIAL, 0);
    state.collection = first.items;
    state.total = first.total;
    state.useApi = true;
}

/* -------------------------------------
   4. UTILITÁRIOS PUROS
   ------------------------------------- */

function formatDateISO(isoDate) {
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function computeIndicatorWindow(current, total) {
    const count = Math.min(INDICATOR_COUNT, total);
    const half = Math.floor(count / 2);
    let start = current - half;
    if (start < 0) start = 0;
    if (start + count > total) start = total - count;
    return { start, end: start + count - 1 };
}

function svgPlaceholder(width, height, tone, label) {
    const backgrounds = ['#EAD6D5', '#E3C9C7', '#DBCFCF', '#D4C4C3', '#EFE0DF'];
    const texts = ['#292323', '#4A4040', '#5C5050', '#6B5D5D', '#3A3232'];
    const bg = backgrounds[tone % backgrounds.length];
    const fg = texts[tone % texts.length];
    const safeLabel = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
        `<rect width="100%" height="100%" fill="${bg}"/>` +
        `<text x="50%" y="50%" fill="${fg}" font-family="sans-serif" font-size="${Math.round(Math.min(width, height) * 0.05)}" text-anchor="middle" dominant-baseline="middle">${safeLabel}</text>` +
        `</svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function imageSrc(image) {
    return svgPlaceholder(image.width, image.height, image.tone, image.file_name);
}

/* -------------------------------------
   5. HEADER — OBRA EM DESTAQUE
   ------------------------------------- */

function renderFeatured() {
    const featured = state.featured;
    if (!featured) return;

    const image = document.getElementById('featured-image');
    if (!image) return;

    image.src = imageSrc(featured.image);
    image.alt = featured.title + ' — obra em destaque';
    image.width = featured.image.width;
    image.height = featured.image.height;
}

/* -------------------------------------
   6. HERO — IMAGEM + CAIXA DE TEXTO 50/50
   ------------------------------------- */

function renderHero() {
    const featured = state.featured;
    if (!featured) return;

    const secondary = state.collection[0] || null;
    const heroImage = document.getElementById('hero-image');

    if (secondary && heroImage) {
        heroImage.src = svgPlaceholder(800, 1000, secondary.image.tone, secondary.image.file_name);
        heroImage.alt = secondary.title + ' — obra secundária';
        heroImage.width = secondary.image.width;
        heroImage.height = secondary.image.height;
        document.getElementById('hero-name').textContent = secondary.image.file_name;
    }

    const artist = state.artist || SIMULATED_ARTIST;
    document.getElementById('detail-artist').textContent = artist.name;
    document.getElementById('detail-location').textContent = artist.location;
    document.getElementById('detail-medium').textContent = artist.medium;

    const websiteLink = document.getElementById('detail-website');
    websiteLink.innerHTML = '';
    const websiteAnchor = document.createElement('a');
    websiteAnchor.href = artist.website;
    websiteAnchor.textContent = 'Clique aqui';
    websiteAnchor.target = '_blank';
    websiteAnchor.rel = 'noopener';
    websiteLink.appendChild(websiteAnchor);

    document.getElementById('detail-store').textContent = artist.store;
    document.getElementById('detail-patreon').textContent = artist.patreon;
    document.getElementById('hero-description').textContent = featured.description;
    document.getElementById('hero-complementary').textContent = featured.complementary;
}

/* -------------------------------------
   7. MURO DE FOTOS — GRADE FLUIDA
   ------------------------------------- */

function createWallItem(post, globalIndex) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'wall-item';
    button.setAttribute('aria-label', 'Abrir ' + post.title + ' em visualização ampliada');

    const img = document.createElement('img');
    img.src = svgPlaceholder(800, 400, post.image.tone, post.image.file_name);
    img.alt = post.title;
    img.width = post.image.width;
    img.height = post.image.height;
    img.loading = 'lazy';
    img.decoding = 'async';
    button.appendChild(img);

    const tooltip = document.createElement('span');
    tooltip.className = 'wall-tooltip';
    tooltip.setAttribute('aria-hidden', 'true');
    tooltip.textContent = post.image.file_name;
    button.appendChild(tooltip);

    button.addEventListener('click', () => openLightbox(globalIndex));

    return button;
}

function appendWallItem(post) {
    const wall = document.getElementById('wall');
    if (!wall) return;
    const globalIndex = state.collection.indexOf(post);
    wall.appendChild(createWallItem(post, globalIndex));
}

async function renderNextBatch() {
    const wall = document.getElementById('wall');
    const status = document.getElementById('feed-status');
    if (!wall || !status) return;

    const remaining = state.total - state.renderedCount;
    if (remaining <= 0) {
        status.textContent = 'Fim das publicações.';
        return;
    }

    let batch;
    if (state.useApi) {
        const size = Math.min(BATCH_NEXT, remaining);
        const data = await loadFeedBatch(size, state.collection.length);
        batch = data.items;
        state.collection.push(...batch);
    } else {
        batch = state.collection.slice(state.renderedCount, state.renderedCount + BATCH_NEXT);
    }

    batch.forEach(appendWallItem);
    state.renderedCount += batch.length;

    if (state.renderedCount >= state.total) {
        status.textContent = 'Fim das publicações.';
        const sentinel = document.getElementById('feed-sentinel');
        if (sentinel && sentinelObserver) {
            sentinelObserver.unobserve(sentinel);
        }
    } else {
        status.textContent = 'Carregando mais publicações...';
    }
}

let sentinelObserver = null;

function renderInitialWall() {
    const wall = document.getElementById('wall');
    const status = document.getElementById('feed-status');
    const sentinel = document.getElementById('feed-sentinel');
    if (!wall || !status) return;

    const firstBatch = state.collection.slice(0, BATCH_INITIAL);
    firstBatch.forEach(appendWallItem);
    state.renderedCount = firstBatch.length;

    if (state.renderedCount >= state.total) {
        status.textContent = 'Fim das publicações.';
        return;
    }

    status.textContent = 'Role para carregar mais publicações.';

    if ('IntersectionObserver' in window && sentinel) {
        sentinelObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    renderNextBatch();
                }
            });
        }, {
            root: null,
            rootMargin: '200px 0px',
            threshold: 0,
        });
        sentinelObserver.observe(sentinel);
    } else {
        renderNextBatch();
    }
}

/* -------------------------------------
   8. LIGHTBOX
   ------------------------------------- */

function renderLightboxItem() {
    const item = state.collection[state.lightboxIndex];
    if (!item) return;

    const image = document.getElementById('lightbox-image');
    image.src = imageSrc(item.image);
    image.alt = item.title + ' — ' + item.description;
    image.width = item.image.width;
    image.height = item.image.height;

    document.getElementById('lightbox-name').textContent = item.image.file_name;

    renderIndicators();
}

function renderIndicators() {
    const container = document.getElementById('lightbox-indicators');
    if (!container) return;

    container.innerHTML = '';
    const total = state.collection.length;
    const current = state.lightboxIndex;
    const windowRange = computeIndicatorWindow(current, total);

    for (let i = windowRange.start; i <= windowRange.end; i += 1) {
        const dot = document.createElement('button');
        dot.type = 'button';

        let className = 'indicator';
        if (i === current) {
            className += ' current';
        }
        if (i === windowRange.start && windowRange.start > 0) {
            className += ' half';
        }
        if (i === windowRange.end && windowRange.end < total - 1) {
            className += ' half-end';
        }

        dot.className = className;
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Ir para a obra ${i + 1} de ${total}`);
        if (i === current) {
            dot.setAttribute('aria-current', 'true');
        }
        dot.addEventListener('click', () => {
            state.lightboxIndex = i;
            renderLightboxItem();
        });
        container.appendChild(dot);
    }
}

function stepLightbox(delta) {
    const total = state.collection.length;
    state.lightboxIndex = (state.lightboxIndex + delta + total) % total;
    renderLightboxItem();
}

function getLightboxFocusables() {
    const lightbox = document.getElementById('lightbox');
    return Array.from(
        lightbox.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.disabled && el.offsetParent !== null);
}

function trapLightboxFocus(event) {
    if (event.key !== 'Tab') return;
    const focusables = getLightboxFocusables();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function onLightboxKeydown(event) {
    if (event.key === 'Escape') {
        closeLightbox();
        return;
    }
    if (event.key === 'ArrowLeft') {
        stepLightbox(-1);
        return;
    }
    if (event.key === 'ArrowRight') {
        stepLightbox(1);
        return;
    }
    trapLightboxFocus(event);
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    state.lightboxIndex = index;
    state.lastFocusedElement = document.activeElement;

    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    document.addEventListener('keydown', onLightboxKeydown);

    renderLightboxItem();

    const closeButton = document.getElementById('lightbox-close');
    if (closeButton) {
        closeButton.focus();
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || lightbox.hidden) return;

    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    document.removeEventListener('keydown', onLightboxKeydown);

    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
        state.lastFocusedElement.focus();
    }
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev').addEventListener('click', () => stepLightbox(-1));
    document.getElementById('lightbox-next').addEventListener('click', () => stepLightbox(1));

    lightbox.addEventListener('click', event => {
        if (event.target.closest('button')) return;

        if (event.clientX < window.innerWidth * PREV_CLICK_ZONE_RATIO) {
            stepLightbox(-1);
        } else {
            stepLightbox(1);
        }
    });
}

/* -------------------------------------
   9. INICIALIZAÇÃO
   ------------------------------------- */

async function init() {
    try {
        await loadInitialData();
        console.info('[feed] dados carregados da API:', API_BASE);
    } catch (err) {
        console.warn('[feed] API indisponível, usando dados simulados.', err);
        useSimulatedFallback();
    }

    renderFeatured();
    renderHero();
    renderInitialWall();
    initLightbox();
}

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('DOMContentLoaded', init);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_BASE,
        SIMULATED_ARTIST,
        SIMULATED_PUBLICATIONS,
        state,
        loadArtist,
        loadFeatured,
        loadFeedBatch,
        loadInitialData,
        useSimulatedFallback,
        computeIndicatorWindow,
        formatDateISO,
    };
}
