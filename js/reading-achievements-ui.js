(function () {
  'use strict';

  const iconShapes = {
    'door-open': '<path d="M4 21V4a2 2 0 0 1 2-2h12v19"/><path d="M2 21h20M12 11h.01M9 21v-5h4v5"/>',
    'book-open': '<path d="M12 7v14M3 18V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16"/><path d="M21 18V5a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v16M3 18h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    'book-check': '<path d="M12 7v14M3 18V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16"/><path d="M21 18V5a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v16M3 18h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6"/><path d="m15 9 2 2 4-4"/>',
    library: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 7h8M8 11h8"/>',
    'book-marked': '<path d="M12 7v14M3 18V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16"/><path d="M21 18V5a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v16M3 18h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6"/><path d="M15 5h4v5l-2-1.5L15 10Z"/>',
    'graduation-cap': '<path d="m2 10 10-5 10 5-10 5-10-5Z"/><path d="M6 12v5c3.5 3 8.5 3 12 0v-5M22 10v6"/>',
    'calendar-check': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-12 5 2 2 4-4"/>'
  };

  function iconMarkup(iconName) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.65');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = iconShapes[iconName] || iconShapes['book-open'];
    return svg;
  }

  function formatDate(value) {
    if (!value) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium'
    }).format(new Date(value));
  }

  function installStylesheet() {
    if (document.querySelector('link[data-bs-achievements-styles]')) return;
    const script = document.currentScript;
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('../css/reading-achievements.css', script.src).href;
    stylesheet.dataset.bsAchievementsStyles = 'true';
    document.head.appendChild(stylesheet);
  }

  function showNotification(detail) {
    const achievement = detail.achievement;
    const queue = window.bsAchievementToastQueue || (window.bsAchievementToastQueue = []);
    queue.push({ achievement, unlockedAt: detail.unlockedAt });
    if (window.bsAchievementToastActive) return;
    window.bsAchievementToastActive = true;

    function displayNext() {
      const item = queue.shift();
      if (!item) {
        window.bsAchievementToastActive = false;
        return;
      }

      const toast = document.createElement('aside');
      toast.className = 'bs-achievement-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      const icon = document.createElement('span');
      icon.className = 'bs-achievement-toast-icon';
      icon.appendChild(iconMarkup(item.achievement.icon));
      const copy = document.createElement('span');
      copy.className = 'bs-achievement-toast-copy';
      const label = document.createElement('span');
      label.className = 'bs-achievement-toast-label';
      label.textContent = 'CONQUISTA DESBLOQUEADA';
      const name = document.createElement('strong');
      name.textContent = item.achievement.name;
      const description = document.createElement('span');
      description.textContent = item.achievement.description;
      copy.append(label, name, description);
      toast.append(icon, copy);
      document.body.appendChild(toast);

      window.setTimeout(() => {
        toast.classList.add('is-leaving');
        window.setTimeout(() => {
          toast.remove();
          displayNext();
        }, 260);
      }, 3600);
    }

    displayNext();
  }

  function renderAchievementsPage() {
    const root = document.querySelector('[data-achievements-page]');
    const service = window.BrokenStreetAchievements;
    if (!root || !service) return;

    const state = service.getState();
    const items = service.getAchievements();
    const publishedChapterIds = service.getPublishedChapterIds();
    const completedCount = publishedChapterIds.filter((id) => state.completedChapters.includes(id)).length;
    const unlockedCount = items.filter((item) => item.unlockedAt).length;
    const percent = Math.round((unlockedCount / items.length) * 100);
    const count = root.querySelector('[data-achievement-count]');
    const progress = root.querySelector('[data-achievement-progress]');
    const progressLabel = root.querySelector('[data-achievement-progress-label]');
    const grid = root.querySelector('[data-achievement-grid]');
    const localStatus = root.querySelector('[data-achievement-storage-status]');
    const storage = service.getStorageStatus();

    count.textContent = `${unlockedCount} de ${items.length}`;
    progress.value = percent;
    progress.setAttribute('aria-valuetext', `${percent}% das conquistas desbloqueadas`);
    progressLabel.textContent = `${percent}%`;
    localStatus.textContent = storage.message
      ? storage.message
      : 'Seu progresso fica salvo somente neste navegador e dispositivo.';

    const stats = root.querySelector('[data-reading-stats]');
    stats.textContent = `${completedCount} capítulo${completedCount === 1 ? '' : 's'} concluído${completedCount === 1 ? '' : 's'} · ${state.visitedCharacters.length} de 4 protagonistas visitados · ${state.visitDates.length} dia${state.visitDates.length === 1 ? '' : 's'} de visita`;

    items.forEach((item) => {
      const unlocked = Boolean(item.unlockedAt);
      const card = document.createElement('article');
      card.className = `bs-achievement-card${unlocked ? ' is-unlocked' : ' is-locked'}`;
      card.setAttribute('aria-label', `${item.name}: ${unlocked ? 'desbloqueada' : 'bloqueada'}`);

      const icon = document.createElement('div');
      icon.className = 'bs-achievement-icon';
      icon.appendChild(iconMarkup(item.icon));
      const body = document.createElement('div');
      body.className = 'bs-achievement-copy';
      const status = document.createElement('span');
      status.className = 'bs-achievement-status';
      status.textContent = unlocked ? 'DESBLOQUEADA' : 'BLOQUEADA';
      const name = document.createElement('h2');
      name.textContent = item.name;
      const description = document.createElement('p');
      description.textContent = item.description;
      const condition = document.createElement('p');
      condition.className = 'bs-achievement-condition';
      condition.textContent = `Como desbloquear: ${item.condition}`;
      body.append(status, name, description, condition);
      if (unlocked) {
        const date = document.createElement('p');
        date.className = 'bs-achievement-date';
        date.textContent = `Desbloqueada em ${formatDate(item.unlockedAt)}`;
        body.appendChild(date);
      }
      card.append(icon, body);
      grid.appendChild(card);
    });
  }

  installStylesheet();
  window.addEventListener('brokenstreet:achievement-unlocked', (event) => showNotification(event.detail));
  window.addEventListener('brokenstreet:chapter-completed', () => {
    const root = document.querySelector('[data-achievements-page]');
    if (root) {
      root.querySelector('[data-achievement-grid]').replaceChildren();
      renderAchievementsPage();
    }
  });
  window.addEventListener('brokenstreet:achievement-storage-error', (event) => {
    const status = document.querySelector('[data-achievement-storage-status]');
    if (status) status.textContent = event.detail.message;
  });
  document.addEventListener('DOMContentLoaded', renderAchievementsPage);
})();
