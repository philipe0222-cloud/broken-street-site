const lastReadChapterKey = 'brokenStreet.lastReadChapter';
let siteSettings = {};
const currentChapter = window.location.pathname.match(/chapter-(\d{2})\.html$/);

try {
  siteSettings = JSON.parse(localStorage.getItem('brokenStreet.siteSettings') || '{}');
} catch (error) {
  console.warn('As preferências de leitura não puderam ser lidas.', error);
}

if (siteSettings.continueReading !== false
  && currentChapter
  && Number(currentChapter[1]) >= 1
  && Number(currentChapter[1]) <= 5) {
  localStorage.setItem(lastReadChapterKey, currentChapter[1]);
}

const lastReadChapter = localStorage.getItem(lastReadChapterKey);

if (siteSettings.continueReading !== false && /^0[1-5]$/.test(lastReadChapter || '')) {
  const lastReadLink = document.querySelector(`.chapter-card[href="chapter-${lastReadChapter}.html"]`);
  const status = lastReadLink && lastReadLink.querySelector('.chapter-status');

  if (lastReadLink && status) {
    lastReadLink.classList.add('is-current');
    lastReadLink.setAttribute('aria-current', 'page');
    status.textContent = 'VOCÊ PAROU AQUI →';
  }
}
