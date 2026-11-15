/* ========================================
   ART PORTFOLIO — ADMIN
   Autenticação real via API (Etapa 07):
   login/logout/sessão contra o backend.
   Dados do dashboard ainda simulados até
   a integração de upload/CRUD (Etapa 08).
======================================== */

(function () {
    'use strict';

    var API_BASE = 'http://localhost:3000/api';
    var TOKEN_KEY = 'artfolio_admin_token';
    var LABEL_FIELDS = ['name', 'location', 'medium', 'website', 'store', 'patreon'];

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
       2. DASHBOARD — DADOS SIMULADOS
    ------------------------------------- */

    var samplePosts = [
        {
            id: 'admin-1',
            title: 'Retratos Urbanos',
            description: 'Obra principal selecionada pelo proprietário.',
            file_name: 'retratos-urbanos.jpg',
            file_size: '2,4 MB',
            width: 1200,
            height: 900,
            isMain: true,
        },
        {
            id: 'admin-2',
            title: 'Natureza Abstrata',
            description: 'Exploração de texturas e gradientes.',
            file_name: 'natureza-abstrata.jpg',
            file_size: '1,8 MB',
            width: 1600,
            height: 900,
            isMain: false,
        },
        {
            id: 'admin-3',
            title: 'Figuras em Movimento',
            description: 'Desenhos de carvão sobre gesto humano.',
            file_name: 'figuras-em-movimento.jpg',
            file_size: '3,1 MB',
            width: 1000,
            height: 1400,
            isMain: false,
        },
    ];

    var MAX_UPLOAD_BYTES = 5 * 1024 * 1024; /* 5 MB (limite simulado) */

    function placeholderSrc(width, height, label) {
        var safeLabel = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' +
            '<rect width="100%" height="100%" fill="#EAD6D5"/>' +
            '<text x="50%" y="50%" fill="#292323" font-family="sans-serif" font-size="' + Math.round(Math.min(width, height) * 0.05) + '" text-anchor="middle" dominant-baseline="middle">' + safeLabel + '</text>' +
            '</svg>';
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    /* -------------------------------------
       3. UPLOAD SIMULADO (PRÉ-VISUALIZAÇÃO)
    ------------------------------------- */

    function attachUpload(zone, imgEl, messageEl) {
        var input = zone.querySelector('[data-file-input]');
        if (!input) {
            input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.hidden = true;
            input.setAttribute('data-file-input', '');
            zone.appendChild(input);
        }

        function handleFile(file) {
            if (!file) return;

            if (!file.type || file.type.indexOf('image/') !== 0) {
                messageEl.textContent = 'Formato inválido. Selecione uma imagem (JPG, PNG, WEBP).';
                messageEl.classList.add('is-error');
                return;
            }

            if (file.size > MAX_UPLOAD_BYTES) {
                messageEl.textContent = 'Tamanho excessivo. O limite simulado é 5 MB.';
                messageEl.classList.add('is-error');
                return;
            }

            var reader = new FileReader();
            reader.addEventListener('load', function () {
                imgEl.src = reader.result;
                messageEl.classList.remove('is-error');
                messageEl.textContent = 'Pré-visualização atualizada: ' + file.name + ' (' + formatKB(file.size) + '). Substituição permitida.';
            });
            reader.readAsDataURL(file);
        }

        input.addEventListener('change', function () {
            handleFile(input.files[0]);
            input.value = '';
        });

        zone.addEventListener('click', function () {
            input.click();
        });

        zone.addEventListener('dragover', function (event) {
            event.preventDefault();
            zone.classList.add('is-dragover');
        });

        zone.addEventListener('dragleave', function () {
            zone.classList.remove('is-dragover');
        });

        zone.addEventListener('drop', function (event) {
            event.preventDefault();
            zone.classList.remove('is-dragover');
            if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                handleFile(event.dataTransfer.files[0]);
            }
        });
    }

    function formatKB(bytes) {
        return (bytes / 1024).toFixed(0) + ' KB';
    }

    /* -------------------------------------
       4. CAMPOS EDITÁVEIS TRANSLÚCIDOS
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
                    if (multiline && event.shiftKey) return;
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

    /* -------------------------------------
       5. GALERIA ADMINISTRATIVA
    ------------------------------------- */

    function createAdminCard(post, gallery) {
        var article = document.createElement('article');
        article.className = 'post' + (post.isMain ? ' is-main' : '');
        article.setAttribute('data-post-id', post.id);

        var frame = document.createElement('div');
        frame.className = 'media-frame edit-frame';
        frame.setAttribute('data-upload-zone', '');
        frame.style.aspectRatio = post.width + ' / ' + post.height;

        var img = document.createElement('img');
        img.src = placeholderSrc(post.width, post.height, post.file_name);
        img.alt = post.title + ' — pré-visualização';
        img.width = post.width;
        img.height = post.height;
        frame.appendChild(img);

        var veil = document.createElement('div');
        veil.className = 'edit-veil';
        var label = document.createElement('span');
        label.className = 'edit-label';
        label.textContent = 'Substituir imagem (arraste ou selecione)';
        veil.appendChild(label);
        frame.appendChild(veil);

        var title = document.createElement('h3');
        title.className = 'post-title';
        title.setAttribute('data-editable', '');
        title.textContent = post.title;

        var description = document.createElement('p');
        description.className = 'post-description';
        description.setAttribute('data-editable', '');
        description.textContent = post.description;

        var uploadMessage = document.createElement('p');
        uploadMessage.className = 'upload-message';
        uploadMessage.setAttribute('role', 'status');

        var controls = document.createElement('div');
        controls.className = 'admin-controls';

        var btnUp = document.createElement('button');
        btnUp.type = 'button';
        btnUp.textContent = 'Subir';
        btnUp.setAttribute('aria-label', 'Mover ' + post.title + ' para cima');

        var btnDown = document.createElement('button');
        btnDown.type = 'button';
        btnDown.textContent = 'Descer';
        btnDown.setAttribute('aria-label', 'Mover ' + post.title + ' para baixo');

        var btnMain = document.createElement('button');
        btnMain.type = 'button';
        btnMain.textContent = 'Definir principal';
        btnMain.setAttribute('aria-pressed', post.isMain ? 'true' : 'false');

        var btnRemove = document.createElement('button');
        btnRemove.type = 'button';
        btnRemove.textContent = 'Remover';
        btnRemove.setAttribute('aria-label', 'Remover ' + post.title);

        controls.appendChild(btnUp);
        controls.appendChild(btnDown);
        controls.appendChild(btnMain);
        controls.appendChild(btnRemove);

        article.appendChild(frame);
        article.appendChild(title);
        article.appendChild(description);
        article.appendChild(uploadMessage);
        article.appendChild(controls);

        /* Upload na zona da imagem */
        attachUpload(frame, img, uploadMessage);

        /* Edição de título e descrição */
        makeEditable(title);
        makeEditable(description);

        /* Reordenação */
        btnUp.addEventListener('click', function () {
            var prev = article.previousElementSibling;
            if (prev) {
                gallery.insertBefore(article, prev);
            }
        });

        btnDown.addEventListener('click', function () {
            var next = article.nextElementSibling;
            if (next) {
                gallery.insertBefore(next, article);
            }
        });

        /* Selecionar principal */
        btnMain.addEventListener('click', function () {
            var all = gallery.querySelectorAll('.post');
            all.forEach(function (card) {
                card.classList.remove('is-main');
                var mainBtn = card.querySelector('[aria-pressed]');
                if (mainBtn) {
                    mainBtn.setAttribute('aria-pressed', 'false');
                }
            });
            article.classList.add('is-main');
            btnMain.setAttribute('aria-pressed', 'true');
        });

        /* Remover */
        btnRemove.addEventListener('click', function () {
            article.remove();
        });

        return article;
    }

    function initDashboard() {
        var gallery = document.getElementById('admin-gallery');
        if (!gallery) return;

        samplePosts.forEach(function (post) {
            gallery.appendChild(createAdminCard(post, gallery));
        });

        /* Zona de upload da apresentação principal */
        var mainFrame = document.querySelector('.edit-frame[data-upload-zone]');
        if (mainFrame) {
            var mainImg = mainFrame.querySelector('img');
            var mainMessage = document.createElement('p');
            mainMessage.className = 'upload-message';
            mainMessage.setAttribute('role', 'status');
            mainFrame.parentNode.insertBefore(mainMessage, mainFrame.nextSibling);

            var mainPost = samplePosts.find(function (post) { return post.isMain; }) || samplePosts[0];
            mainImg.src = placeholderSrc(mainPost.width, mainPost.height, mainPost.file_name);

            attachUpload(mainFrame, mainImg, mainMessage);
        }

        /* Botão adicionar publicação */
        var btnAdd = document.getElementById('btn-add');
        if (btnAdd) {
            btnAdd.addEventListener('click', function () {
                var newPost = {
                    id: 'admin-new-' + Date.now(),
                    title: 'Nova publicação',
                    description: 'Descrição editável.',
                    file_name: 'nova-imagem.jpg',
                    file_size: '0 KB',
                    width: 1200,
                    height: 900,
                    isMain: false,
                };
                gallery.appendChild(createAdminCard(newPost, gallery));
            });
        }

        loadPresentation().catch(function (err) {
            console.warn('[admin] apresentação via API indisponível:', err.message);
        });

        wireEditables();
        wireTopics();
    }

    function wireEditables() {
        document.querySelectorAll('dt[data-label-for]').forEach(function (el) {
            makeEditable(el, { onSave: saveArtist });
        });
        document.querySelectorAll('dd[data-field]').forEach(function (el) {
            makeEditable(el, { onSave: saveArtist });
        });
        document.querySelectorAll('.details-description[data-field="description"], .details-complementary[data-field="complementary"]').forEach(function (el) {
            makeEditable(el, { multiline: true, onSave: saveFeatured });
        });
    }

    /* -------------------------------------
       7. APRESENTAÇÃO VIA API
       ------------------------------------- */

    function applyArtist(artist) {
        document.querySelectorAll('dt[data-label-for]').forEach(function (el) {
            el.textContent = (artist.labels || {})[el.dataset.labelFor] || '';
        });
        document.querySelectorAll('dd[data-field]').forEach(function (el) {
            el.textContent = artist[el.dataset.field] || '';
        });
    }

    function collectArtist() {
        var labels = {};
        var fields = {};
        document.querySelectorAll('dt[data-label-for]').forEach(function (el) {
            labels[el.dataset.labelFor] = el.textContent;
        });
        document.querySelectorAll('dd[data-field]').forEach(function (el) {
            fields[el.dataset.field] = el.textContent;
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

    var featuredId = null;
    var featuredData = null;
    function loadFeatured() {
        return apiFetch('/publications?featured=true').then(function (data) {
            var item = data && data.items && data.items[0];
            if (!item) return;
            featuredId = item.db_id;
            featuredData = item;
            document.querySelector('.details-description[data-field="description"]').textContent = item.description || '';
            document.querySelector('.details-complementary[data-field="complementary"]').textContent = item.complementary || '';
        });
    }
    function saveFeaturedNow() {
        var descEl = document.querySelector('.details-description[data-field="description"]');
        var compEl = document.querySelector('.details-complementary[data-field="complementary"]');
        if (!descEl || !compEl) return Promise.resolve();
        var body = Object.assign({}, featuredData, {
            description: descEl.textContent,
            complementary: compEl.textContent
        });
        if (!featuredId) return Promise.reject(new Error('Publicação principal não identificada'));
        return apiAuth('/admin/publications/' + featuredId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
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
            renderTopics(artist.topics || []);
            return loadFeatured();
        });
    }

    function renderTopics(topics) {
        var list = document.getElementById('topics-list');
        if (!list) return;
        list.innerHTML = '';
        (topics || []).slice().sort(function (a, b) { return (a.position || 0) - (b.position || 0); }).forEach(appendTopic);
    }

    function appendTopic(topic) {
        var list = document.getElementById('topics-list');
        var article = document.createElement('article');
        article.className = 'topic-box';
        article.setAttribute('data-topic-id', topic.id);

        var title = document.createElement('input');
        title.type = 'text';
        title.className = 'edit-input';
        title.value = topic.title;
        title.setAttribute('data-topic-id', topic.id);
        title.setAttribute('data-topic-field', 'title');

        var body = document.createElement('textarea');
        body.className = 'edit-textarea';
        body.value = topic.body;
        body.setAttribute('data-topic-id', topic.id);
        body.setAttribute('data-topic-field', 'body');

        var remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'topic-remove';
        remove.textContent = '×';
        remove.setAttribute('aria-label', 'Remover caixa de texto');

        article.appendChild(title);
        article.appendChild(body);
        article.appendChild(remove);
        list.appendChild(article);

        makeEditable(title, { onSave: function (v) { saveTopic(topic.id, 'title', v); } });
        makeEditable(body, { multiline: true, onSave: function (v) { saveTopic(topic.id, 'body', v); } });

        remove.addEventListener('click', function () {
            apiAuth('/admin/topics/' + topic.id, { method: 'DELETE' }).then(function () {
                article.remove();
            }).catch(function (e) {
                console.warn('[admin] remover tópico:', e.message);
            });
        });
    }

    function saveTopic(id, field, value) {
        var payload = {};
        payload[field] = value;
        return apiAuth('/admin/topics/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(function (res) {
            if (!res.ok) throw new Error('Falha ao salvar tópico');
        });
    }

    function wireTopics() {
        var btn = document.getElementById('btn-add-topic');
        if (!btn) return;
        btn.addEventListener('click', function () {
            apiAuth('/admin/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: '', body: '' })
            }).then(function (res) {
                if (!res.ok) throw new Error('Falha ao criar tópico');
                return res.json();
            }).then(function (topic) {
                appendTopic(topic);
                var list = document.getElementById('topics-list');
                var last = list.lastElementChild;
                if (last) last.querySelector('input').focus();
            }).catch(function (e) {
                console.warn('[admin] adicionar tópico:', e.message);
            });
        });
    }

    /* -------------------------------------
       6. INICIALIZAÇÃO
       ------------------------------------- */

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
