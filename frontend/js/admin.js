/* ========================================
   ART PORTFOLIO — ADMIN
   Uploads reais via API e sincronização com a página pública.
   Dados do painel via backend (simplificação Etapa 08).
   ======================================== */

(function () {
    'use strict';

    var API_BASE = 'API_BASE_PLACEHOLDER';
    var STORAGE_BASE = API_BASE.replace(/\/api$/, '') + '/storage';
    var TOKEN_KEY = 'artfolio_admin_token';

    function apiAuth(path, opts) {
        var options = opts || {};
        options.headers = options.headers || {};
        if (!options.headers.Authorization) {
            var token = localStorage.getItem(TOKEN_KEY);
            if (token) {
                options.headers.Authorization = 'Bearer ' + token;
            }
        }
        return fetch(API_BASE + path, options);
    }

    function apiFetch(path, opts) {
        var options = opts || {};
        options.headers = options.headers || {};
        var token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            options.headers.Authorization = 'Bearer ' + token;
        }
        return fetch(API_BASE + path, options).then(function (res) {
            if (!res.ok) throw new Error('Requisição falhou: ' + res.status);
            return res.json();
        });
    }

    /* -------------------------------------
       1. LOGIN (API REAL)
    ------------------------------------- */

    function initLogin() {
        const form = document.getElementById('login-form');
        if (!form) return;

        const userInput = document.getElementById('login-user');
        const passwordInput = document.getElementById('login-password');
        const message = document.getElementById('login-message');

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            userInput.classList.remove('input-error');
            passwordInput.classList.remove('input-error');
            message.classList.remove('is-error');
            message.textContent = '';

            let hasError = false;

            if (!userInput.value.trim()) {
                userInput.classList.add('input-error');
                hasError = true;
            }

            if (!passwordInput.value) {
                passwordInput.classList.add('input-error');
                hasError = true;
            }

            if (hasError) {
                message.classList.add('is-error');
                message.textContent = 'Preencha usuário e senha.';
                return;
            }

            fetch(API_BASE + '/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: userInput.value.trim(),
                    password: passwordInput.value,
                }),
            })
                .then(function (res) {
                    return res.json().then(function (data) { return { status: res.status, data: data }; });
                })
                .then(function (result) {
                    if (result.status === 200 && result.data.token) {
                        localStorage.setItem(TOKEN_KEY, result.data.token);
                        window.location.href = 'dashboard.html';
                        return;
                    }
                    message.classList.add('is-error');
                    message.textContent = (result.data && result.data.error) || 'Falha no login. Tente novamente.';
                })
                .catch(function () {
                    message.classList.add('is-error');
                    message.textContent = 'Serviço de autenticação indisponível no momento.';
                });
        });
    }

    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function clearToken() {
        localStorage.removeItem(TOKEN_KEY);
    }

    function requireSession() {
        var token = getToken();
        if (!token) {
            if (!document.getElementById('login-form')) {
                window.location.href = 'login.html';
            }
            return Promise.resolve(null);
        }
        return fetch(API_BASE + '/admin/session', {
            headers: { Authorization: 'Bearer ' + token },
        })
            .then(function (res) {
                if (res.status === 401) {
                    clearToken();
                    window.location.href = 'login.html';
                    return null;
                }
                if (!res.ok) return null;
                return res.json();
            })
            .catch(function () {
                clearToken();
                window.location.href = 'login.html';
                return null;
            });
    }

    function initLogout() {
        var link = document.getElementById('logout-link');
        if (!link) return;
        link.addEventListener('click', function (event) {
            event.preventDefault();
            var token = getToken();
            clearToken();
            if (token) {
                fetch(API_BASE + '/admin/logout', {
                    method: 'POST',
                    headers: { Authorization: 'Bearer ' + token },
                }).catch(function () {}).finally(function () {
                    window.location.href = 'login.html';
                });
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    /* -------------------------------------
       2. DETAILS (EDITÁVEIS)
    ------------------------------------- */

    function makeEditable(element, options) {
        var multiline = options && options.multiline;
        var onSave = options && options.onSave;

        element.addEventListener('click', function () {
            if (element.classList.contains('is-editing')) return;

            var current = element.textContent;
            element.classList.add('is-editing');
            element.textContent = '';

            var input = multiline ? document.createElement('textarea') : document.createElement('input');
            if (!multiline) {
                input.type = 'text';
            }
            input.className = multiline ? 'edit-textarea' : 'edit-input';
            input.value = current;
            element.appendChild(input);
            input.focus();
            if (multiline) {
                input.style.height = 'auto';
                input.style.height = input.scrollHeight + 'px';
            }

            function save() {
                var next = input.value.trim() || current;
                element.textContent = next;
                element.classList.remove('is-editing');
                if (onSave) {
                    onSave(next);
                }
            }

            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    if (multiline) {
                        if (event.ctrlKey || event.metaKey) {
                            event.preventDefault();
                            save();
                        }
                        return;
                    }
                    event.preventDefault();
                    save();
                }
                if (event.key === 'Escape') {
                    element.textContent = current;
                    element.classList.remove('is-editing');
                }
            });

            input.addEventListener('blur', save);

            if (multiline) {
                input.addEventListener('input', function () {
                    input.style.height = 'auto';
                    input.style.height = input.scrollHeight + 'px';
                });
            }
        });
    }

    function applyArtist(artist) {
        document.querySelectorAll('dt[data-label-for]').forEach(function (el) {
            el.textContent = (artist.labels || {})[el.dataset.labelFor] || '';
        });
        document.querySelectorAll('dd[data-field]').forEach(function (el) {
            if (el.classList.contains('is-editing')) return;
            if (el.dataset.field === 'description') {
                el.textContent = (artist.labels && artist.labels.description) || '';
            } else {
                el.textContent = artist[el.dataset.field] || '';
            }
        });
        var profile = document.getElementById('slot-profile-img');
        if (profile && artist.image) {
            profile.src = imageUrl(artist.image.file_name);
            profile.alt = 'Imagem do perfil';
        }
    }

    function collectArtist() {
        var labels = {};
        var fields = {};
        document.querySelectorAll('dt[data-label-for]').forEach(function (el) {
            labels[el.dataset.labelFor] = el.textContent;
        });
        document.querySelectorAll('dd[data-field]').forEach(function (el) {
            if (el.dataset.field === 'website') {
                var link = el.querySelector('a');
                fields[el.dataset.field] = link ? link.getAttribute('href') : el.textContent;
            } else if (el.dataset.field === 'description') {
                if (!labels) labels = {};
                labels.description = el.textContent;
            } else {
                fields[el.dataset.field] = el.textContent;
            }
        });
        return Object.assign({}, fields, { labels: labels });
    }

    var artistSaveTimer = null;
    function doSaveArtist() {
        return apiAuth('/admin/artist', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(collectArtist())
        }).then(function (res) {
            if (!res.ok) throw new Error('Falha ao salvar perfil');
            return res.json();
        }).then(applyArtist);
    }
    function saveArtist() {
        if (artistSaveTimer) clearTimeout(artistSaveTimer);
        artistSaveTimer = setTimeout(function () {
            doSaveArtist().catch(function (e) {
                console.warn('[admin] perfil:', e.message);
            });
        }, 250);
    }

    /* -------------------------------------
       3. OBRA EM DESTAQUE (DESCRIÇÃO / COMPLEMENTO)
    ------------------------------------- */

    var featuredId = null;

    function loadFeatured() {
        return apiFetch('/publications?featured=true').then(function (data) {
            var item = data && data.items && data.items[0];
            if (!item) return;
            featuredId = item.db_id;
            var descEl = document.querySelector('.details-description[data-field="description"]');
            var compEl = document.querySelector('.details-complementary[data-field="complementary"]');
            if (descEl) descEl.textContent = item.description || '';
            if (compEl) compEl.textContent = item.complementary || '';
        });
    }
    function saveFeaturedNow() {
        var descEl = document.querySelector('.details-description[data-field="description"]');
        var compEl = document.querySelector('.details-complementary[data-field="complementary"]');
        if (!descEl || !compEl) return Promise.resolve();
        if (!featuredId) return Promise.reject(new Error('Publicação principal não identificada'));
        return apiAuth('/admin/publications/' + featuredId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: descEl.textContent, complementary: compEl.textContent })
        }).then(function (res) {
            if (!res.ok) throw new Error('Falha ao salvar apresentação');
        });
    }
    var featuredSaveTimer = null;
    function saveFeatured() {
        if (featuredSaveTimer) clearTimeout(featuredSaveTimer);
        featuredSaveTimer = setTimeout(function () {
            saveFeaturedNow().catch(function (e) {
                console.warn('[admin] apresentação:', e.message);
            });
        }, 250);
    }
    function loadPresentation() {
        return apiFetch('/artist').then(function (artist) {
            applyArtist(artist);
            return loadFeatured();
        });
    }

    /* -------------------------------------
       4. PUBLICAÇÕES (FEED)
    ------------------------------------- */

    function imageUrl(fileName) {
        return STORAGE_BASE + '/images/' + fileName;
    }

    function placeholderSrc(width, height, label) {
        var safeLabel = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' +
            '<rect width="100%" height="100%" fill="#EAD6D5"/>' +
            '<text x="50%" y="50%" fill="#292323" font-family="sans-serif" font-size="' + Math.round(Math.min(width, height) * 0.05) + '" text-anchor="middle" dominant-baseline="middle">' + safeLabel + '</text>' +
            '</svg>';
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    function createAdminCard(post) {
        var article = document.createElement('article');
        article.className = 'post';
        article.setAttribute('data-post-id', post.db_id);

        var img = document.createElement('img');
        img.className = 'post-image';
        img.src = imageUrl(post.image.file_name);
        img.alt = post.image.file_name;
        img.width = post.image.width;
        img.height = post.image.height;
        img.decoding = 'async';
        img.onerror = function () {
            this.src = placeholderSrc(this.width, this.height, this.alt);
        };

        var remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'post-remove';
        remove.textContent = '×';
        remove.setAttribute('aria-label', 'Remover ' + post.image.file_name);

        article.appendChild(img);
        article.appendChild(remove);

        remove.addEventListener('click', function () {
            apiAuth('/admin/publications/' + post.db_id, { method: 'DELETE' }).then(function () {
                article.remove();
                var gallery = document.getElementById('admin-gallery');
                var empty = document.getElementById('admin-empty');
                var note = document.getElementById('admin-note');
                if (gallery && gallery.children.length === 0) {
                    if (empty) empty.hidden = false;
                    if (note) note.hidden = true;
                }
            }).catch(function (e) {
                console.warn('[admin] remover publicação:', e.message);
            });
        });

        return article;
    }

    function renderPublications(posts) {
        var gallery = document.getElementById('admin-gallery');
        var empty = document.getElementById('admin-empty');
        var note = document.getElementById('admin-note');
        gallery.innerHTML = '';
        (posts || []).forEach(function (post) {
            gallery.appendChild(createAdminCard(post));
        });
        if (gallery && empty && note) {
            if ((posts || []).length === 0) {
                empty.hidden = false;
                note.hidden = true;
            } else {
                empty.hidden = true;
                note.hidden = false;
            }
        }
    }

    function loadPublications() {
        return Promise.all([
            apiFetch('/publications?featured=true'),
            apiFetch('/publications?featured=false'),
        ]).then(function (results) {
            var featured = results[0] && results[0].items && results[0].items[0] || null;
            var feed = results[1] && results[1].items || [];
            renderFeaturedSlot(featured);
            renderPublications(feed);
        });
    }

    function renderFeaturedSlot(featured) {
        var img = document.getElementById('slot-featured-img');
        var msg = document.getElementById('slot-featured-msg');
        if (img) {
            if (featured) {
                img.src = imageUrl(featured.image.file_name);
                img.alt = 'Destaque principal';
            } else {
                img.src = placeholderSrc(1200, 900, 'sem destaque');
                img.alt = 'Destaque principal';
            }
            img.onerror = function () {
                this.src = placeholderSrc(this.width, this.height, this.alt);
            };
        }
        if (msg) {
            msg.textContent = featured ? 'Destaque carregado.' : 'Nenhum destaque definido.';
        }
    }

    /* -------------------------------------
       5. UPLOADS (ZONES POR SLOT)
    ------------------------------------- */

    function uploadFile(zone, file) {
        var slot = zone.getAttribute('data-slot');
        var img = zone.querySelector('img');
        var msg = document.getElementById('slot-' + slot + '-msg');
        var form = new FormData();
        form.append('file', file);
        if (msg) msg.textContent = 'Enviando…';
        return fetch(API_BASE + '/admin/uploads?slot=' + slot, {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + localStorage.getItem(TOKEN_KEY) },
            body: form,
        }).then(function (res) {
            if (!res.ok) {
                return res.json().then(function (data) {
                    throw new Error((data && data.error) || 'Upload falhou');
                });
            }
            return res.json();
        }).then(function (data) {
            var fileName = data.image && data.image.file_name;
            if (!fileName) throw new Error('Resposta do upload sem imagem');
            if (slot === 'featured' || slot === 'profile') {
                if (img) {
                    img.src = imageUrl(fileName);
                    img.alt = file.name;
                    img.onerror = function () {
                        this.src = placeholderSrc(this.width, this.height, this.alt);
                    };
                }
            }
            if (slot === 'feed') {
                loadPublications();
            }
            if (msg) msg.textContent = 'Enviado.';
        }).catch(function (e) {
            if (msg) msg.textContent = 'Falha no upload.';
            console.warn('[admin] upload:', e.message);
        });
    }

    function wireUploadZone(zone) {
        var input = zone.querySelector('[data-file-input]');
        if (!input) return;
        zone.addEventListener('click', function () {
            input.value = '';
            input.click();
        });
        input.addEventListener('change', function () {
            var files = input.files;
            if (!files || files.length === 0) return;
            Array.from(files).forEach(function (file) {
                uploadFile(zone, file);
            });
            input.value = '';
        });
    }

    function wireUploadZones() {
        document.querySelectorAll('[data-upload-zone]').forEach(wireUploadZone);
    }

    /* -------------------------------------
       6. SALVAR / ATUALIZAR SITE
    ------------------------------------- */

    /* -------------------------------------
       7. INICIALIZAÇÃO
    ------------------------------------- */

    function wireEditables() {
        document.querySelectorAll('dt[data-label-for]').forEach(function (el) {
            makeEditable(el, { onSave: saveArtist });
        });
        document.querySelectorAll('dd[data-field]').forEach(function (el) {
            makeEditable(el, { multiline: el.hasAttribute('data-multiline'), onSave: saveArtist });
        });
        document.querySelectorAll('.details-description[data-field="description"], .details-complementary[data-field="complementary"]').forEach(function (el) {
            makeEditable(el, { multiline: true, onSave: saveFeatured });
        });
    }

    function initDashboard() {
        wireEditables();
        loadPresentation().catch(function (err) {
            console.warn('[admin] apresentação via API indisponível:', err.message);
        });
        loadPublications().catch(function (err) {
            console.warn('[admin] publicações via API indisponíveis:', err.message);
        });
        wireUploadZones();

        var btnPublish = document.getElementById('btn-publish');
        if (btnPublish) {
            btnPublish.addEventListener('click', async function () {
                var status = document.getElementById('publish-status');
                try {
                    if (artistSaveTimer) clearTimeout(artistSaveTimer);
                    await doSaveArtist();
                    if (featuredSaveTimer) clearTimeout(featuredSaveTimer);
                    await saveFeaturedNow();
                    await loadPublications();
                    status.textContent = 'Site atualizado.';
                    status.classList.remove('is-error');
                    setTimeout(function () { status.textContent = ''; }, 4000);
                } catch (e) {
                    status.textContent = 'Falha ao atualizar: ' + e.message;
                    status.classList.add('is-error');
                }
            });
        }
    }

    function init() {
        initLogin();
        requireSession().then(function (session) {
            if (session) {
                initDashboard();
                initLogout();
            }
        });
    }

    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
