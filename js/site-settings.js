(function () {
  'use strict';

  const storageKey = 'brokenStreet.siteSettings';
  const storyIdeasStorageKey = 'brokenStreet.storyIdeas';
  const ideasPin = '0732';
  const defaults = {
    theme: 'dark',
    reduceEffects: false,
    neon: 65,
    fontSize: 100,
    lineHeight: 1.82,
    readingWidth: 680,
    readingFont: 'rajdhani',
    reduceMotion: false,
    highContrast: false,
    legibility: false,
    soundEnabled: true,
    continueReading: true,
    chapterTitleLanguage: 'en'
  };
  const scriptUrl = document.currentScript.src;
  const reactionAdminUrl = new URL('../reaction-admin.html', scriptUrl).href;
  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = new URL('../css/site-settings.css', scriptUrl).href;
  document.head.appendChild(styleLink);

  let settings = readSettings();
  let lastFocusedElement = null;

  function readSettings() {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return { ...defaults };

    try {
      return { ...defaults, ...JSON.parse(stored) };
    } catch (error) {
      console.warn('As configurações salvas não puderam ser lidas; os valores padrão serão usados.', error);
      return { ...defaults };
    }
  }

  function saveSettings() {
    localStorage.setItem(storageKey, JSON.stringify(settings));
    applySettings();
  }

  function applySettings() {
    const root = document.documentElement;
    root.dataset.bsTheme = settings.theme;
    root.classList.toggle('bs-reduce-effects', settings.reduceEffects);
    root.classList.toggle('bs-reduce-motion', settings.reduceMotion);
    root.classList.toggle('bs-high-contrast', settings.highContrast);
    root.classList.toggle('bs-legibility', settings.legibility);
    root.style.setProperty('--bs-neon-opacity', String(settings.neon / 100));
    root.style.setProperty('--bs-reading-scale', String(settings.fontSize / 100));
    root.style.setProperty('--bs-reading-line-height', String(settings.lineHeight));
    root.style.setProperty('--bs-reading-width', `${settings.readingWidth}px`);
    root.style.setProperty('--bs-reading-font', readingFonts[settings.readingFont] || readingFonts.rajdhani);
    document.querySelectorAll('audio, video').forEach((media) => {
      media.muted = !settings.soundEnabled;
      if (!settings.soundEnabled) media.pause();
    });
    applyChapterTitles();
    updateControls();
  }

  const chapterTitles = {
    '01': { en: 'The Beginning of the End', pt: 'O Começo do Fim' },
    '02': { en: 'A New Life', pt: 'Uma Nova Vida' },
    '03': { en: 'The Beginning of Life', pt: 'O Início da Vida' },
    '04': { en: 'The First Night', pt: 'A Primeira Noite' },
    '05': { en: 'The Morning After', pt: 'A Manhã Seguinte' },
    '06': { en: 'What Remains', pt: 'O Que Resta' },
    '07': { en: 'First Contact', pt: 'Primeiro Contato' }
  };

  function applyChapterTitles() {
    const language = settings.chapterTitleLanguage === 'pt' ? 'pt' : 'en';
    document.querySelectorAll('[data-chapter-title], [data-chapter-title-meta], [data-chapter-title-aria]').forEach((element) => {
      const chapterNumber = element.dataset.chapterTitle
        || element.dataset.chapterTitleMeta
        || element.dataset.chapterTitleAria;
      const chapter = chapterTitles[chapterNumber];
      if (!chapter) return;

      const title = chapter[language];
      if (element.hasAttribute('data-chapter-title')) {
        element.textContent = title;
        if (element.closest('.chapter-heading')) {
          document.title = `Capítulo ${Number(chapterNumber)}: ${title} | Broken Street`;
        }
      }
      if (element.hasAttribute('data-chapter-title-meta')) {
        element.content = `Capítulo ${Number(chapterNumber)}: ${title} | Broken Street`;
      }
      if (element.hasAttribute('data-chapter-title-aria')) {
        element.setAttribute('aria-label', `Capítulo ${Number(chapterNumber)}: ${title}`);
      }
    });
  }

  const readingFonts = {
    rajdhani: "'Rajdhani', sans-serif",
    georgia: "Georgia, 'Times New Roman', serif",
    arial: "Arial, Helvetica, sans-serif",
    system: "system-ui, -apple-system, 'Segoe UI', sans-serif"
  };

  const launcher = document.createElement('button');
  launcher.className = 'bs-settings-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Abrir configurações');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'bs-settings-panel');
  launcher.innerHTML = '<span></span><span></span><span></span>';

  const backdrop = document.createElement('div');
  backdrop.className = 'bs-settings-backdrop';
  backdrop.hidden = true;
  backdrop.innerHTML = `
    <aside class="bs-settings-panel" id="bs-settings-panel" role="dialog" aria-modal="true" aria-labelledby="bs-settings-title" tabindex="-1">
      <header class="bs-settings-header">
        <div>
          <p class="bs-settings-eyebrow">BROKEN STREET · PREFERÊNCIAS</p>
          <h2 id="bs-settings-title">Configurações</h2>
        </div>
        <button class="bs-settings-close" type="button" aria-label="Fechar configurações">×</button>
      </header>
      <div class="bs-settings-layout">
        <nav class="bs-settings-tabs" aria-label="Seções de configurações" role="tablist" aria-orientation="vertical">
          <button class="bs-settings-tab is-active" type="button" role="tab" id="bs-tab-appearance" aria-controls="bs-section-appearance" aria-selected="true" data-settings-tab="appearance">Aparência</button>
          <button class="bs-settings-tab" type="button" role="tab" id="bs-tab-reading" aria-controls="bs-section-reading" aria-selected="false" data-settings-tab="reading" tabindex="-1">Leitura</button>
          <button class="bs-settings-tab" type="button" role="tab" id="bs-tab-accessibility" aria-controls="bs-section-accessibility" aria-selected="false" data-settings-tab="accessibility" tabindex="-1">Acessibilidade</button>
          <button class="bs-settings-tab" type="button" role="tab" id="bs-tab-preferences" aria-controls="bs-section-preferences" aria-selected="false" data-settings-tab="preferences" tabindex="-1">Preferências</button>
          <button class="bs-settings-tab" type="button" role="tab" id="bs-tab-creator" aria-controls="bs-section-creator" aria-selected="false" data-settings-tab="creator" tabindex="-1">Criador</button>
          <button class="bs-settings-tab" type="button" role="tab" id="bs-tab-ideas" aria-controls="bs-section-ideas" aria-selected="false" data-settings-tab="ideas" tabindex="-1">Ideias</button>
          <button class="bs-settings-tab" type="button" role="tab" id="bs-tab-about" aria-controls="bs-section-about" aria-selected="false" data-settings-tab="about" tabindex="-1">Sobre</button>
        </nav>
        <div class="bs-settings-content">
          <section class="bs-settings-section is-active" id="bs-section-appearance" role="tabpanel" aria-labelledby="bs-tab-appearance" data-settings-section="appearance">
            <h3>Aparência</h3>
            <p class="bs-settings-description">Personalize a experiência visual do site.</p>
            <label class="bs-settings-field">
              <span>Tema</span>
              <select data-setting="theme">
                <option value="dark">Tema escuro</option>
                <option value="light">Tema claro</option>
              </select>
            </label>
            <label class="bs-settings-toggle">
              <span><strong>Efeitos visuais reduzidos</strong><small>Suaviza brilhos e elementos decorativos.</small></span>
              <input type="checkbox" data-setting="reduceEffects">
            </label>
            <label class="bs-settings-field bs-settings-range">
              <span>Intensidade dos efeitos neon <output data-output="neon"></output></span>
              <input type="range" min="0" max="100" step="5" data-setting="neon">
            </label>
          </section>

          <section class="bs-settings-section" id="bs-section-reading" role="tabpanel" aria-labelledby="bs-tab-reading" data-settings-section="reading" hidden>
            <h3>Leitura</h3>
            <p class="bs-settings-description">Deixe os capítulos mais confortáveis para ler.</p>
            <label class="bs-settings-field bs-settings-range">
              <span>Tamanho da fonte <output data-output="fontSize"></output></span>
              <input type="range" min="90" max="140" step="5" data-setting="fontSize">
            </label>
            <label class="bs-settings-field bs-settings-range">
              <span>Espaçamento entre linhas <output data-output="lineHeight"></output></span>
              <input type="range" min="1.4" max="2.2" step="0.1" data-setting="lineHeight">
            </label>
            <label class="bs-settings-field bs-settings-range">
              <span>Largura do texto <output data-output="readingWidth"></output></span>
              <input type="range" min="560" max="900" step="20" data-setting="readingWidth">
            </label>
            <label class="bs-settings-field">
              <span>Fonte de leitura</span>
              <select data-setting="readingFont">
                <option value="rajdhani">Rajdhani</option>
                <option value="georgia">Georgia</option>
                <option value="arial">Arial</option>
                <option value="system">Sistema</option>
              </select>
            </label>
          </section>

          <section class="bs-settings-section" id="bs-section-accessibility" role="tabpanel" aria-labelledby="bs-tab-accessibility" data-settings-section="accessibility" hidden>
            <h3>Acessibilidade</h3>
            <p class="bs-settings-description">Opções para facilitar a navegação e a leitura.</p>
            <label class="bs-settings-toggle">
              <span><strong>Reduzir animações</strong><small>Desativa movimentos não essenciais.</small></span>
              <input type="checkbox" data-setting="reduceMotion">
            </label>
            <label class="bs-settings-toggle">
              <span><strong>Aumentar contraste</strong><small>Deixa textos e controles mais nítidos.</small></span>
              <input type="checkbox" data-setting="highContrast">
            </label>
            <label class="bs-settings-toggle">
              <span><strong>Melhorar legibilidade</strong><small>Usa texto mais espaçado e fácil de acompanhar.</small></span>
              <input type="checkbox" data-setting="legibility">
            </label>
            <label class="bs-settings-field">
              <span>Nomes dos capítulos</span>
              <select data-setting="chapterTitleLanguage">
                <option value="en">Inglês (padrão)</option>
                <option value="pt">Português</option>
              </select>
            </label>
          </section>

          <section class="bs-settings-section" id="bs-section-preferences" role="tabpanel" aria-labelledby="bs-tab-preferences" data-settings-section="preferences" hidden>
            <h3>Preferências</h3>
            <p class="bs-settings-description">Pequenos ajustes para sua experiência.</p>
            <label class="bs-settings-toggle">
              <span><strong>Ativar sons</strong><small>Controla o áudio de músicas e vídeos.</small></span>
              <input type="checkbox" data-setting="soundEnabled">
            </label>
            <label class="bs-settings-toggle">
              <span><strong>Continuar de onde parou</strong><small>Marca seu último capítulo na lista.</small></span>
              <input type="checkbox" data-setting="continueReading">
            </label>
            <button class="bs-settings-reset" type="button">Restaurar configurações padrão</button>
          </section>

          <section class="bs-settings-section" id="bs-section-creator" role="tabpanel" aria-labelledby="bs-tab-creator" data-settings-section="creator" hidden>
            <h3>Resultados das reações</h3>
            <p class="bs-settings-description">Acesse o painel privado para ver as reações dos leitores por capítulo.</p>
            <a class="bs-settings-admin-link" href="${reactionAdminUrl}">Abrir resultados das reações</a>
          </section>

          <section class="bs-settings-section" id="bs-section-ideas" role="tabpanel" aria-labelledby="bs-tab-ideas" data-settings-section="ideas" hidden>
            <h3>Caderno de ideias</h3>
            <p class="bs-settings-description">Guarde lembretes, cenas e detalhes para desenvolver a história depois.</p>
            <form class="bs-ideas-gate" data-ideas-gate>
              <label class="bs-ideas-pin-label" for="bs-ideas-pin">Digite seu PIN para abrir o caderno</label>
              <div class="bs-ideas-pin-row">
                <input id="bs-ideas-pin" name="pin" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off" required aria-describedby="bs-ideas-gate-status">
                <button class="bs-ideas-button" type="submit">Acessar</button>
              </div>
              <p class="bs-ideas-inline-status" id="bs-ideas-gate-status" data-ideas-gate-status aria-live="polite"></p>
            </form>
            <div class="bs-ideas-editor" data-ideas-editor hidden>
              <p class="bs-ideas-local-note">As ideias são salvas somente neste navegador.</p>
              <form class="bs-ideas-form" data-ideas-form>
                <label class="bs-ideas-pin-label" for="bs-idea-text">Nova ideia</label>
                <textarea id="bs-idea-text" name="idea" rows="4" maxlength="2000" placeholder="Anote uma cena, personagem, reviravolta ou detalhe do mundo..." required></textarea>
                <div class="bs-ideas-form-footer">
                  <small>Até 2.000 caracteres</small>
                  <button class="bs-ideas-button" type="submit">Salvar ideia</button>
                </div>
              </form>
              <p class="bs-ideas-inline-status" data-ideas-storage-status aria-live="polite"></p>
              <div class="bs-ideas-list" data-ideas-list aria-live="polite"></div>
            </div>
            <p class="bs-ideas-security-note">O PIN é apenas um bloqueio simples nesta página; não protege contra quem inspecionar o código do site.</p>
          </section>

          <section class="bs-settings-section bs-settings-about" id="bs-section-about" role="tabpanel" aria-labelledby="bs-tab-about" data-settings-section="about" hidden>
            <p class="bs-settings-eyebrow">BROKEN STREET · CRÉDITOS</p>
            <h3>Por trás da criação</h3>
            <p class="bs-settings-about-lead">Uma história construída a partir de ideias, imaginação e colaboração.</p>
            <hr>
            <p><em>Broken Street</em> é uma obra original idealizada e desenvolvida por seu autor, a partir de suas próprias ideias, personagens, conceitos, narrativas e visão criativa.</p>
            <p>Ao longo do processo, ferramentas como <strong>ChatGPT</strong>, <strong>Genspark</strong> e <strong>Visual Studio Code</strong> foram utilizadas como apoio criativo e técnico no desenvolvimento da obra e do site.</p>
            <p>Essas ferramentas auxiliam na exploração de possibilidades, organização de ideias e construção do projeto. A direção criativa, as escolhas narrativas e a identidade de <em>Broken Street</em> são conduzidas por seu autor.</p>
            <p><strong>Esta é uma história que nasce da imaginação humana e evolui com o auxílio da tecnologia.</strong></p>
            <hr>
            <p class="bs-settings-about-footer">Broken Street — Um universo em constante construção.</p>
            <p class="bs-settings-version">Site versão 1.0 · © 2026 Broken Street · Direitos reservados.</p>
            <p class="bs-settings-version">Contato: philipe0222@gmail.com</p>
          </section>
        </div>
      </div>
      <p class="bs-settings-status" aria-live="polite"></p>
    </aside>
  `;
  const topBar = document.querySelector('.site-nav, .top-nav, .topbar, body > nav');
  const accentRgb = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim()
    || '176, 38, 255';
  launcher.style.setProperty('--bs-settings-accent-rgb', accentRgb);
  if (topBar) {
    topBar.appendChild(launcher);
    topBar.classList.add('bs-settings-has-launcher');
  } else {
    document.body.appendChild(launcher);
  }
  document.body.appendChild(backdrop);

  const panel = backdrop.querySelector('.bs-settings-panel');
  const closeButton = backdrop.querySelector('.bs-settings-close');
  const status = backdrop.querySelector('.bs-settings-status');
  const ideasGate = backdrop.querySelector('[data-ideas-gate]');
  const ideasGateStatus = backdrop.querySelector('[data-ideas-gate-status]');
  const ideasEditor = backdrop.querySelector('[data-ideas-editor]');
  const ideasForm = backdrop.querySelector('[data-ideas-form]');
  const ideasText = ideasForm.querySelector('textarea');
  const ideasStorageStatus = backdrop.querySelector('[data-ideas-storage-status]');
  const ideasList = backdrop.querySelector('[data-ideas-list]');
  let ideas = [];
  let ideasLoadFailed = false;

  function readIdeas() {
    let stored;
    try {
      stored = localStorage.getItem(storyIdeasStorageKey);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.some((idea) => (
        !idea || typeof idea.id !== 'string' || typeof idea.text !== 'string' || typeof idea.createdAt !== 'string'
      ))) {
        throw new TypeError('O formato salvo não corresponde a uma lista de ideias.');
      }
      return parsed;
    } catch (error) {
      console.error('As ideias salvas não puderam ser lidas.', error);
      ideasLoadFailed = true;
      return [];
    }
  }

  function saveIdeas(nextIdeas) {
    try {
      localStorage.setItem(storyIdeasStorageKey, JSON.stringify(nextIdeas));
      ideas = nextIdeas;
      ideasStorageStatus.textContent = 'Ideias salvas neste navegador.';
      return true;
    } catch (error) {
      console.error('As ideias não puderam ser salvas neste navegador.', error);
      ideasStorageStatus.textContent = 'Não foi possível salvar. Verifique o espaço disponível e as permissões do navegador.';
      return false;
    }
  }

  function renderIdeas() {
    ideasList.replaceChildren();
    if (ideasLoadFailed) {
      ideasStorageStatus.textContent = 'Não foi possível ler o caderno salvo. As anotações existentes foram preservadas.';
      ideasForm.querySelector('button').disabled = true;
      return;
    }
    ideasForm.querySelector('button').disabled = false;
    if (ideas.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'bs-ideas-empty';
      emptyState.textContent = 'Seu caderno está vazio. Registre a primeira ideia quando quiser.';
      ideasList.appendChild(emptyState);
      return;
    }

    ideas.forEach((idea) => {
      const card = document.createElement('article');
      card.className = 'bs-idea-card';
      const meta = document.createElement('div');
      meta.className = 'bs-idea-meta';
      const timestamp = document.createElement('time');
      timestamp.dateTime = idea.createdAt;
      const createdAt = new Date(idea.createdAt);
      timestamp.textContent = Number.isNaN(createdAt.getTime())
        ? 'Data indisponível'
        : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(createdAt);
      const removeButton = document.createElement('button');
      removeButton.className = 'bs-idea-delete';
      removeButton.type = 'button';
      removeButton.dataset.deleteIdea = idea.id;
      removeButton.setAttribute('aria-label', 'Excluir ideia');
      removeButton.textContent = 'Excluir';
      meta.append(timestamp, removeButton);
      const text = document.createElement('p');
      text.className = 'bs-idea-text';
      text.textContent = idea.text;
      card.append(meta, text);
      ideasList.appendChild(card);
    });
  }

  ideasGate.addEventListener('submit', (event) => {
    event.preventDefault();
    const pinInput = ideasGate.elements.pin;
    if (pinInput.value !== ideasPin) {
      ideasGateStatus.textContent = 'PIN incorreto. Tente novamente.';
      pinInput.value = '';
      pinInput.focus();
      return;
    }

    ideas = readIdeas();
    ideasGate.hidden = true;
    ideasEditor.hidden = false;
    ideasGateStatus.textContent = '';
    renderIdeas();
    ideasText.focus();
  });

  ideasForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = ideasText.value.trim();
    if (!text || ideasLoadFailed) return;

    const nextIdeas = [{
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      createdAt: new Date().toISOString()
    }, ...ideas];
    if (saveIdeas(nextIdeas)) {
      ideasText.value = '';
      renderIdeas();
      ideasText.focus();
    }
  });

  ideasList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-delete-idea]');
    if (!button) return;
    const nextIdeas = ideas.filter((idea) => idea.id !== button.dataset.deleteIdea);
    if (saveIdeas(nextIdeas)) renderIdeas();
  });

  function updateControls() {
    backdrop.querySelectorAll('[data-setting]').forEach((control) => {
      const key = control.dataset.setting;
      if (control.type === 'checkbox') {
        control.checked = Boolean(settings[key]);
      } else {
        control.value = String(settings[key]);
      }
    });
    backdrop.querySelectorAll('[data-output]').forEach((output) => {
      const key = output.dataset.output;
      const value = settings[key];
      output.value = key === 'lineHeight' ? `${Number(value).toFixed(1)}` : `${value}${key === 'readingWidth' ? ' px' : '%'}`;
      output.textContent = output.value;
    });
  }

  function openPanel() {
    lastFocusedElement = document.activeElement;
    backdrop.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    document.body.classList.add('bs-settings-open');
    panel.focus();
    closeButton.focus();
  }

  function closePanel() {
    backdrop.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('bs-settings-open');
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function selectTab(name) {
    backdrop.querySelectorAll('[data-settings-tab]').forEach((tab) => {
      const isActive = tab.dataset.settingsTab === name;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    backdrop.querySelectorAll('[data-settings-section]').forEach((section) => {
      const isActive = section.dataset.settingsSection === name;
      section.classList.toggle('is-active', isActive);
      section.hidden = !isActive;
    });
  }

  launcher.addEventListener('click', openPanel);
  closeButton.addEventListener('click', closePanel);
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closePanel();
  });
  backdrop.querySelectorAll('[data-settings-tab]').forEach((tab) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.settingsTab));
  });
  backdrop.querySelectorAll('[data-setting]').forEach((control) => {
    control.addEventListener('input', () => {
      const key = control.dataset.setting;
      settings[key] = control.type === 'checkbox'
        ? control.checked
        : (control.type === 'range' ? Number(control.value) : control.value);
      saveSettings();
      status.textContent = 'Preferência salva neste dispositivo.';
    });
    control.addEventListener('change', () => {
      const key = control.dataset.setting;
      settings[key] = control.type === 'checkbox'
        ? control.checked
        : (control.type === 'range' ? Number(control.value) : control.value);
      saveSettings();
    });
  });
  backdrop.querySelector('.bs-settings-reset').addEventListener('click', () => {
    settings = { ...defaults };
    saveSettings();
    status.textContent = 'Configurações padrão restauradas.';
  });
  document.addEventListener('keydown', (event) => {
    if (!backdrop.hidden && event.key === 'Escape') closePanel();
    if (!backdrop.hidden && event.key === 'Tab') {
      const focusable = [...panel.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  document.addEventListener('play', (event) => {
    if (!settings.soundEnabled && event.target instanceof HTMLMediaElement) {
      event.target.pause();
      event.target.muted = true;
    }
  }, true);
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey) return;
    settings = readSettings();
    applySettings();
  });

  applySettings();
})();
