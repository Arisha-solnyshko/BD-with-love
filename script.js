const tabs = [...document.querySelectorAll('.tab')];
const cards = [...document.querySelectorAll('.story-card')];
const grid = document.getElementById('storyGrid');
const selfTopicFilter = document.getElementById('topicFilter');
const selfTopicChips = [...document.querySelectorAll('#topicFilter .topic-chip')];
const friendTopicFilter = document.getElementById('friendTopicFilter');
const friendTopicChips = [...document.querySelectorAll('#friendTopicFilter .topic-chip')];

let activeKind = 'friend';
let activeSelfTopic = 'all';
let activeFriendTopic = 'all';

function closedLabel(card) {
  if (card.dataset.kind === 'friend') return 'читать ответы';
  if (card.dataset.kind === 'family') return '＋';
  return 'открыть ответ';
}

function updateChipState(chips, activeTopic) {
  chips.forEach(chip => {
    const active = chip.dataset.topic === activeTopic;
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-pressed', String(active));
  });
}

function renderCards() {
  cards.forEach(card => {
    const kindMatches = card.dataset.kind === activeKind;
    const activeTopic = activeKind === 'self'
      ? activeSelfTopic
      : activeKind === 'friend'
        ? activeFriendTopic
        : 'all';
    const topicMatches = activeTopic === 'all' || card.dataset.topic === activeTopic;
    const isVisible = kindMatches && topicMatches;

    // Используем сразу три механизма, чтобы фильтрация не зависела
    // от браузерных стилей для атрибута hidden.
    card.hidden = !isVisible;
    card.classList.toggle('is-filtered-out', !isVisible);
    card.setAttribute('aria-hidden', String(!isVisible));
  });

  selfTopicFilter.hidden = activeKind !== 'self';
  friendTopicFilter.hidden = activeKind !== 'friend';

  tabs.forEach(tab => {
    const active = tab.dataset.filter === activeKind;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    activeKind = tab.dataset.filter;

    if (activeKind === 'self') {
      activeSelfTopic = 'all';
      updateChipState(selfTopicChips, activeSelfTopic);
    } else if (activeKind === 'friend') {
      activeFriendTopic = 'all';
      updateChipState(friendTopicChips, activeFriendTopic);
    }

    renderCards();
  });
});

selfTopicChips.forEach(chip => {
  chip.addEventListener('click', () => {
    activeSelfTopic = chip.dataset.topic;
    updateChipState(selfTopicChips, activeSelfTopic);
    renderCards();
  });
});

friendTopicChips.forEach(chip => {
  chip.addEventListener('click', () => {
    activeFriendTopic = chip.dataset.topic;
    updateChipState(friendTopicChips, activeFriendTopic);
    renderCards();
  });
});

/* Ответы открываются в отдельном окне, поэтому сетка карточек больше не "прыгает". */
const storyDialog = document.getElementById('storyDialog');
const storyDialogKicker = storyDialog?.querySelector('.story-dialog-kicker');
const storyDialogTitle = storyDialog?.querySelector('h3');
const storyDialogContent = storyDialog?.querySelector('.story-dialog-content');
const storyDialogClose = storyDialog?.querySelector('.story-dialog-close');

document.querySelectorAll('.reveal').forEach(button => {
  const card = button.closest('.story-card');
  if (card) button.textContent = closedLabel(card);

  button.addEventListener('click', () => {
    const currentCard = button.closest('.story-card');
    if (!currentCard || !storyDialog || !storyDialogKicker || !storyDialogTitle || !storyDialogContent) return;

    storyDialogKicker.textContent = currentCard.querySelector('.card-kicker')?.textContent?.trim() || '';
    storyDialogTitle.textContent = currentCard.querySelector('h3')?.textContent?.trim() || 'История';
    storyDialogContent.innerHTML = currentCard.querySelector('.story-answer')?.innerHTML || '';
    storyDialog.showModal();
    storyDialogClose?.focus();
  });
});

storyDialogClose?.addEventListener('click', () => storyDialog.close());
storyDialog?.addEventListener('click', event => {
  if (event.target === storyDialog) storyDialog.close();
});

/* Нативный href="#top" остаётся рабочим; scrollTo — дополнительная страховка. */
document.querySelector('.back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('img');

document.querySelectorAll('.polaroid').forEach(item => {
  item.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = item.dataset.full;
    lightbox.showModal();
  });
});

lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

updateChipState(friendTopicChips, activeFriendTopic);
updateChipState(selfTopicChips, activeSelfTopic);
renderCards();
