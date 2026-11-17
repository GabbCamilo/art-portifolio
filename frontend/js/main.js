/* ========================================
   ART PORTFOLIO — FRONTEND VANILLA JS
   Header com destaque, hero editorial 50/50
   e muro de fotos em grade fluida.
   Dados via fetch() na API, sem dados
   simulados: a página exibe apenas o que
   está no banco de dados.
   ======================================== */

/* -------------------------------------
   1. RÓTULOS PADRÃO (fallback de rótulo)
   ------------------------------------- */

const DEFAULT_LABELS = {
    artist: 'Artist',
    location: 'Location',
    medium: 'Medium',
    website: 'Website',
    store: 'Store',
    patreon: 'Patreon',
};

/* -------------------------------------
   2. CONFIGURAÇÃO E ESTADO
   ------------------------------------- */

const API_BASE = 'http://localhost:3000/api';
const STORAGE_BASE = API_BASE.replace(/\/api$/, '') + '/storage';
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

let apiOffline = false;

/* -------------------------------------
   3. ACESSO A DADOS (API)
   ------------------------------------- */

async function apiFetch(path) {
    const res = await fetch(API_BASE + path);
    if (!res.ok) {
        throw new Error(`API ${path} respondeu ${res.status}`);
    }
    return res.json();
}

async function loadArtist() {
    const data = await apiFetch('/artist');
    state.artist = {
        id: data.id,
        name: data.name,
        location: data.location,
        medium: data.medium,
        website: data.website,
        store: data.store,
        patreon: data.patreon,
        description: data.description || '',
        labels: data.labels || {},
        image: data.image || null,
    };
    return state.artist;
}

async function loadFeatured() {
    const data = await apiFetch('/publications?featured=true');
    return data.items[0] || null;
}

async function loadFeedBatch(limit, offset) {
    return apiFetch(`/publications?featured=false&limit=${limit}&offset=${offset}`);
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
        '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' +
        '<rect width="100%" height="100%" fill="' + bg + '"/>' +
        '<text x="50%" y="50%" fill="' + fg + '" font-family="sans-serif" font-size="' + Math.round(Math.min(width, height) * 0.05) + '" text-anchor="middle" dominant-baseline="middle">' + safeLabel + '</text>' +
        '</svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function imageSrc(image) {
    return STORAGE_BASE + '/images/' + image.file_name;
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
    image.alt = featured.image.file_name + ' — obra em destaque';
    image.width = featured.image.width;
    image.height = featured.image.height;
}

/* -------------------------------------
   6. HERO — IMAGEM + CAIXA DE TEXTO 50/50
   ------------------------------------- */

function renderHero() {
    const featured = state.featured;
    const artist = state.artist;

    const profile = artist && artist.image;
    const heroImage = document.getElementById('hero-image');
    if (heroImage) {
        if (profile) {
            heroImage.src = imageSrc(profile);
            heroImage.alt = 'Imagem do perfil';
            heroImage.width = profile.width;
            heroImage.height = profile.height;
        } else {
            heroImage.src = '';
            heroImage.alt = '';
        }
    }

    const name = document.getElementById('hero-name');
    if (name) name.textContent = profile ? profile.file_name : '';

    if (!artist) return;

    document.getElementById('detail-artist').textContent = artist.name;
    document.getElementById('detail-location').textContent = artist.location;
    document.getElementById('detail-medium').textContent = artist.medium;

    const websiteLink = document.getElementById('detail-website');
    websiteLink.innerHTML = '';
    const websiteAnchor = document.createElement('a');
    websiteAnchor.href = artist.website;
    websiteAnchor.textContent = 'Click Here!';
    websiteAnchor.target = '_blank';
    websiteAnchor.rel = 'noopener';
    websiteLink.appendChild(websiteAnchor);

    document.getElementById('detail-store').textContent = artist.store;
    document.getElementById('detail-patreon').textContent = artist.patreon;

    if (featured) {
        document.getElementById('hero-description').textContent = featured.description || '';
        document.getElementById('hero-complementary').textContent = featured.complementary || '';
    }

    const descriptionText = document.getElementById('hero-description-text');
    if (descriptionText) descriptionText.textContent = artist.description || '';

    const labels = state.artist.labels || {};
    document.querySelectorAll('dt[data-label-for]').forEach(function (el) {
        el.textContent = labels[el.dataset.labelFor] || DEFAULT_LABELS[el.dataset.labelFor] || '';
    });
}

/* -------------------------------------
   7. MURO DE FOTOS (GRADE FLUIDA)
   ------------------------------------- */

function createWallItem(post, globalIndex) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'wall-item';
    button.setAttribute('aria-label', 'Abrir imagem em visualização ampliada');

    const img = document.createElement('img');
    img.src = imageSrc(post.image);
    img.alt = post.image.file_name;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = function () {
        this.src = svgPlaceholder(this.width || 800, this.height || 400, 0, this.alt);
    };
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

    if (apiOffline) {
        status.textContent = 'Serviço de dados indisponível. Clique em "Atualizar" para tentar novamente.';
        return;
    }

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
    image.alt = item.image.file_name;
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

    lightbox.removeAttribute('data-lightbox-mode');
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
    lightbox.removeAttribute('data-lightbox-mode');

    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
        state.lastFocusedElement.focus();
    }
}

/* -------------------------------------
   DESTAQUE DA IMAGEM DO HERO (FEATURED)
   ------------------------------------- */

function openFeaturedLightbox() {
    const featured = state.featured;
    if (!featured) return;

    const lightbox = document.getElementById('lightbox');
    const image = document.getElementById('lightbox-image');
    const name = document.getElementById('lightbox-name');
    if (!lightbox || !image || !name) return;

    state.lastFocusedElement = document.activeElement;

    image.src = imageSrc(featured.image);
    image.alt = featured.image.file_name + ' — obra em destaque';
    image.width = featured.image.width;
    image.height = featured.image.height;
    name.textContent = featured.image.file_name;

    lightbox.setAttribute('data-lightbox-mode', 'featured');
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    document.addEventListener('keydown', onLightboxKeydown);

    const closeButton = document.getElementById('lightbox-close');
    if (closeButton) {
        closeButton.focus();
    }
}

function initFeaturedLightbox() {
    const artwork = document.querySelector('.featured-artwork');
    if (!artwork) return;

    artwork.addEventListener('click', function () {
        openFeaturedLightbox();
    });
    artwork.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openFeaturedLightbox();
        }
    });
}

/* -------------------------------------
   IMAGEM DE PERFIL DO HERO (PROFILE)
   ------------------------------------- */

function openProfileLightbox() {
    const profile = state.artist && state.artist.image;
    if (!profile) return;

    const lightbox = document.getElementById('lightbox');
    const image = document.getElementById('lightbox-image');
    const name = document.getElementById('lightbox-name');
    if (!lightbox || !image || !name) return;

    state.lastFocusedElement = document.activeElement;

    image.src = imageSrc(profile);
    image.alt = profile.file_name + ' — imagem do perfil';
    image.width = profile.width;
    image.height = profile.height;
    name.textContent = profile.file_name;

    lightbox.setAttribute('data-lightbox-mode', 'profile');
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    document.addEventListener('keydown', onLightboxKeydown);

    const closeButton = document.getElementById('lightbox-close');
    if (closeButton) {
        closeButton.focus();
    }
}

function initProfileLightbox() {
    const frame = document.getElementById('hero-frame');
    if (!frame) return;

    frame.addEventListener('click', function () {
        openProfileLightbox();
    });
    frame.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openProfileLightbox();
        }
    });
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev').addEventListener('click', () => stepLightbox(-1));
    document.getElementById('lightbox-next').addEventListener('click', () => stepLightbox(1));

    lightbox.addEventListener('click', event => {
        if (event.target.closest('button')) return;

        if (lightbox.getAttribute('data-lightbox-mode') === 'featured' || lightbox.getAttribute('data-lightbox-mode') === 'profile') {
            closeLightbox();
            return;
        }

        if (event.clientX < window.innerWidth * PREV_CLICK_ZONE_RATIO) {
            stepLightbox(-1);
        } else {
            stepLightbox(1);
        }
    });
}

const btnRefresh = typeof document !== 'undefined' && document.getElementById('btn-refresh');
if (btnRefresh) {
    btnRefresh.addEventListener('click', async function () {
        const status = document.getElementById('feed-status');
        try {
            apiOffline = false;
            await loadInitialData();
            renderFeatured();
            renderHero();
            const wall = document.getElementById('wall');
            wall.innerHTML = '';
            renderInitialWall();
            if (status) {
                status.textContent = 'Atualizado.';
                setTimeout(function () {
                    if (status && status.textContent === 'Atualizado.') {
                        status.textContent = state.useApi ? 'Role para carregar mais publicações.' : 'Serviço de dados indisponível. Clique em Atualizar.';
                    }
                }, 2000);
            }
        } catch (e) {
            apiOffline = true;
            if (status) status.textContent = 'Falha ao atualizar.';
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
        apiOffline = true;
        console.warn('[feed] API indisponível.', err);
        const status = document.getElementById('feed-status');
        if (status) status.textContent = 'Serviço de dados indisponível. Clique em "Atualizar" para tentar novamente.';
    }

    renderFeatured();
    renderHero();
    initFeaturedLightbox();
    initProfileLightbox();
    renderInitialWall();
    initLightbox();
}

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('DOMContentLoaded', init);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_BASE,
        state,
        loadArtist,
        loadFeatured,
        loadFeedBatch,
        loadInitialData,
        computeIndicatorWindow,
        formatDateISO,
    };
}
