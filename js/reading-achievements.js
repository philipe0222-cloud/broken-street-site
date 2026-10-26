(function () {
  'use strict';

  const storageKey = 'brokenStreet.readingAchievements';
  const version = 1;
  const publishedChapterIds = [
    'chapter-01',
    'chapter-02',
    'chapter-03',
    'chapter-04',
    'chapter-05',
    'chapter-06',
    'chapter-07',
    'chapter-08',
    'chapter-09'
  ];
  const characters = ['philip', 'aidem', 'anny', 'scott'];
  const achievements = [
    {
      id: 'first-contact',
      icon: 'door-open',
      name: 'Primeiro contato',
      description: 'Você entrou no universo de Broken Street pela primeira vez.',
      condition: 'Visite o site neste navegador.'
    },
    {
      id: 'new-life',
      icon: 'book-open',
      name: 'Uma nova vida',
      description: 'Você concluiu seu primeiro capítulo.',
      condition: 'Conclua um capítulo publicado.'
    },
    {
      id: 'familiar-faces',
      icon: 'users',
      name: 'Rostos familiares',
      description: 'Você conheceu os quatro protagonistas.',
      condition: 'Visite as páginas de Philip, Aidem, Anny e Scott.'
    },
    {
      id: 'dedicated-reader',
      icon: 'book-check',
      name: 'Leitor dedicado',
      description: 'Você concluiu três capítulos.',
      condition: 'Conclua três capítulos diferentes.'
    },
    {
      id: 'story-continues',
      icon: 'library',
      name: 'A história continua',
      description: 'Você concluiu cinco capítulos.',
      condition: 'Conclua cinco capítulos diferentes.'
    },
    {
      id: 'beyond-first-pages',
      icon: 'book-marked',
      name: 'Além das primeiras páginas',
      description: 'Você concluiu dez capítulos.',
      condition: 'Conclua dez capítulos diferentes.'
    },
    {
      id: 'story-scholar',
      icon: 'graduation-cap',
      name: 'Conhecedor da história',
      description: 'Você concluiu todos os capítulos publicados compatíveis com o sistema.',
      condition: 'Conclua todos os capítulos publicados e elegíveis.'
    },
    {
      id: 'frequent-visitor',
      icon: 'calendar-check',
      name: 'Visitante frequente',
      description: 'Você voltou para visitar Broken Street em outro dia.',
      condition: 'Visite o site em pelo menos dois dias locais diferentes.'
    }
  ];
  let state = createEmptyState();
  let persistent = true;
  let storageMessage = '';

  function createEmptyState() {
    return {
      version,
      firstVisit: null,
      visitDates: [],
      completedChapters: [],
      visitedCharacters: [],
      achievements: {}
    };
  }

  function isDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const parsed = new Date(year, month - 1, day);
    return parsed.getFullYear() === year
      && parsed.getMonth() === month - 1
      && parsed.getDate() === day;
  }

  function isTimestamp(value) {
    return typeof value === 'string' && !Number.isNaN(Date.parse(value));
  }

  function normalizeState(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== version) {
      return null;
    }
    if (value.firstVisit !== null && !isDate(value.firstVisit)) return null;
    if (!Array.isArray(value.visitDates)
      || !value.visitDates.every(isDate)
      || !Array.isArray(value.completedChapters)
      || !value.completedChapters.every((id) => typeof id === 'string' && /^chapter-\d{2}$/.test(id))
      || !Array.isArray(value.visitedCharacters)
      || !value.visitedCharacters.every((id) => characters.includes(id))
      || !value.achievements
      || typeof value.achievements !== 'object'
      || Array.isArray(value.achievements)) {
      return null;
    }

    const unlocks = {};
    for (const [id, unlockedAt] of Object.entries(value.achievements)) {
      if (!/^[a-z0-9-]+$/.test(id) || !isTimestamp(unlockedAt)) return null;
      unlocks[id] = unlockedAt;
    }

    return {
      version,
      firstVisit: value.firstVisit,
      visitDates: [...new Set(value.visitDates)],
      completedChapters: [...new Set(value.completedChapters)],
      visitedCharacters: [...new Set(value.visitedCharacters)],
      achievements: unlocks
    };
  }

  function loadState() {
    let stored;
    try {
      stored = localStorage.getItem(storageKey);
    } catch (error) {
      persistent = false;
      storageMessage = 'O armazenamento local está indisponível; o progresso vale apenas nesta sessão.';
      console.warn(storageMessage, error);
      window.dispatchEvent(new CustomEvent('brokenstreet:achievement-storage-error', {
        detail: { message: storageMessage }
      }));
      return createEmptyState();
    }
    if (stored === null) return createEmptyState();

    try {
      const parsed = JSON.parse(stored);
      if (parsed && Number.isInteger(parsed.version) && parsed.version > version) {
        persistent = false;
        storageMessage = 'Os dados de conquistas foram criados por uma versão mais recente e foram preservados sem alterações.';
        console.warn(storageMessage);
        return createEmptyState();
      }
      const normalized = normalizeState(parsed);
      if (normalized) return normalized;
      console.warn('Os dados de conquistas estavam inválidos; o progresso local será reconstruído.');
      return createEmptyState();
    } catch (error) {
      console.warn('Os dados de conquistas não puderam ser lidos; o progresso local será reconstruído.', error);
      return createEmptyState();
    }
  }

  function saveState() {
    if (!persistent) return false;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      storageMessage = '';
      return true;
    } catch (error) {
      persistent = false;
      storageMessage = 'Não foi possível salvar o progresso; ele vale apenas nesta sessão.';
      console.warn(storageMessage, error);
      window.dispatchEvent(new CustomEvent('brokenstreet:achievement-storage-error', {
        detail: { message: storageMessage }
      }));
      return false;
    }
  }

  function localDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function notifyUnlock(achievement) {
    window.dispatchEvent(new CustomEvent('brokenstreet:achievement-unlocked', {
      detail: {
        achievement,
        unlockedAt: state.achievements[achievement.id]
      }
    }));
  }

  function evaluateAchievements() {
    const completedCount = publishedChapterIds.filter((id) => state.completedChapters.includes(id)).length;
    const allChaptersCompleted = publishedChapterIds.length > 0
      && publishedChapterIds.every((id) => state.completedChapters.includes(id));
    const conditions = {
      'first-contact': Boolean(state.firstVisit),
      'new-life': completedCount >= 1,
      'familiar-faces': characters.every((id) => state.visitedCharacters.includes(id)),
      'dedicated-reader': completedCount >= 3,
      'story-continues': completedCount >= 5,
      'beyond-first-pages': completedCount >= 10,
      'story-scholar': allChaptersCompleted,
      'frequent-visitor': state.visitDates.length >= 2
    };
    let changed = false;

    achievements.forEach((achievement) => {
      if (conditions[achievement.id] && !state.achievements[achievement.id]) {
        state.achievements[achievement.id] = new Date().toISOString();
        changed = true;
        notifyUnlock(achievement);
      }
    });
    return changed;
  }

  function update(mutator) {
    const before = JSON.stringify(state);
    mutator();
    evaluateAchievements();
    if (JSON.stringify(state) !== before) saveState();
  }

  function recordVisit() {
    const today = localDateKey(new Date());
    update(() => {
      if (!state.firstVisit) state.firstVisit = today;
      if (!state.visitDates.includes(today)) state.visitDates.push(today);
    });
  }

  function recordCharacterVisit(characterId) {
    if (!characters.includes(characterId)) return;
    update(() => {
      if (!state.visitedCharacters.includes(characterId)) state.visitedCharacters.push(characterId);
    });
  }

  function completeChapter(chapterId) {
    if (!publishedChapterIds.includes(chapterId)) return false;
    if (state.completedChapters.includes(chapterId)) return false;
    update(() => state.completedChapters.push(chapterId));
    window.dispatchEvent(new CustomEvent('brokenstreet:chapter-completed', {
      detail: { chapterId }
    }));
    return true;
  }

  function getState() {
    return JSON.parse(JSON.stringify(state));
  }

  function getAchievements() {
    return achievements.map((achievement) => ({
      ...achievement,
      unlockedAt: state.achievements[achievement.id] || null
    }));
  }

  function installNavigationLink() {
    if (document.querySelector('.bs-achievements-nav-link')) return;
    const path = window.location.pathname;
    const href = /\/chars\//i.test(path) ? '../achievements.html' : 'achievements.html';
    const link = document.createElement('a');
    link.className = 'bs-achievements-nav-link';
    link.href = href;
    link.textContent = 'Conquistas';
    if (/\/achievements\.html$/i.test(path)) link.setAttribute('aria-current', 'page');

    const navLinks = document.querySelector('.nav-links');
    const characterLinks = document.querySelector('.nav-chars');
    const worldbookLinks = document.querySelector('.top-nav-left');
    const topbar = document.querySelector('.topbar');
    const siteNav = document.querySelector('.site-nav');
    if (navLinks) {
      const item = document.createElement('li');
      item.className = 'bs-achievements-nav-item';
      item.appendChild(link);
      const archiveItem = navLinks.querySelector('.highlight')?.closest('li');
      navLinks.insertBefore(item, archiveItem || null);
    } else if (characterLinks) {
      link.classList.add('nav-achievements-link');
      const chaptersLink = characterLinks.querySelector('.nav-chapters-link');
      characterLinks.insertBefore(link, chaptersLink || null);
    } else if (worldbookLinks) {
      link.classList.add('nav-link');
      worldbookLinks.appendChild(link);
    } else if (topbar) {
      topbar.appendChild(link);
    } else if (siteNav) {
      link.classList.add('nav-link');
      siteNav.appendChild(link);
    }
  }

  function installChapterCompletion() {
    const match = window.location.pathname.match(/\/(chapter-\d{2})\.html$/i);
    if (!match || !publishedChapterIds.includes(match[1])) return;

    const chapterId = match[1];
    const article = document.querySelector('.chapter-content');
    if (!article) {
      console.warn(`O conteúdo narrativo de ${chapterId} não foi encontrado; a conclusão automática não foi ativada.`);
      return;
    }

    const completeButton = document.createElement('button');
    completeButton.className = 'bs-chapter-complete';
    completeButton.type = 'button';
    completeButton.textContent = state.completedChapters.includes(chapterId)
      ? 'Capítulo concluído'
      : 'Concluir capítulo';
    completeButton.disabled = state.completedChapters.includes(chapterId);
    completeButton.setAttribute('aria-label', `Confirmar conclusão de ${chapterId.replace('-', ' ')}`);
    completeButton.setAttribute('aria-live', 'polite');
    article.insertAdjacentElement('afterend', completeButton);

    completeButton.addEventListener('click', () => completeChapter(chapterId));
    window.addEventListener('brokenstreet:chapter-completed', (event) => {
      if (event.detail.chapterId !== chapterId) return;
      completeButton.textContent = 'Capítulo concluído';
      completeButton.disabled = true;
    });

    let hasScrolledThroughContent = false;
    const startingScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      if (window.scrollY > startingScrollY + 24) hasScrolledThroughContent = true;
      if (!hasScrolledThroughContent || state.completedChapters.includes(chapterId)) return;
      if (article.getBoundingClientRect().bottom <= window.innerHeight + 8) {
        completeChapter(chapterId);
      }
    }, { passive: true });
  }

  state = loadState();
  window.BrokenStreetAchievements = Object.freeze({
    getAchievements,
    getState,
    getPublishedChapterIds: () => [...publishedChapterIds],
    getStorageStatus: () => ({ persistent, message: storageMessage }),
    completeChapter,
    recordCharacterVisit
  });
  installNavigationLink();
  recordVisit();

  const characterMatch = window.location.pathname.match(/\/chars\/(philip|aidem|anny|scott)\.html$/i);
  if (characterMatch) recordCharacterVisit(characterMatch[1].toLowerCase());
  installChapterCompletion();
})();
