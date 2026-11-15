/* ========================================
   ART PORTFOLIO — ADMIN (VISUAL)
   Estrutura visual apenas. Autenticação,
   persistência e processamento de imagens
   serão integrados ao backend (Etapas 04-07).
======================================== */

(function () {
    'use strict';

    /* -------------------------------------
       1. LOGIN (ESTRUTURA VISUAL)
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

            /* A autenticação real será validada no backend.
               Nenhuma credencial é armazenada localmente. */
            message.textContent =
                'Autenticação será implementada no backend (Etapa 07). Nenhuma senha foi armazenada.';
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

    function makeEditable(element) {
        element.addEventListener('click', function () {
            if (element.classList.contains('is-editing')) return;

            var current = element.textContent;
            element.classList.add('is-editing');
            element.textContent = '';

            var input = document.createElement('input');
            input.type = 'text';
            input.className = 'edit-input';
            input.value = current;
            element.appendChild(input);
            input.focus();

            function save() {
                element.textContent = input.value.trim() || current;
                element.classList.remove('is-editing');
            }

            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    save();
                }
                if (event.key === 'Escape') {
                    element.textContent = current;
                    element.classList.remove('is-editing');
                }
            });

            input.addEventListener('blur', save);
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
        img.src = '';
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

        var caption = document.createElement('p');
        caption.className = 'media-caption';
        var name = document.createElement('span');
        name.className = 'caption-name';
        name.textContent = post.file_name;
        caption.appendChild(name);

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
        article.appendChild(caption);
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

        /* Campos editáveis da apresentação */
        document.querySelectorAll('[data-editable]').forEach(makeEditable);
    }

    /* -------------------------------------
       6. INICIALIZAÇÃO
    ------------------------------------- */

    function init() {
        initLogin();
        initDashboard();
    }

    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
