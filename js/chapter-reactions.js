window.BROKEN_STREET_REACTIONS = {
  1: {
    title: 'The Beginning of the End',
    question: 'HOW WAS YOUR NIGHT?',
    options: [
      { id: 'moon', symbol: '☾', label: 'gostei', response: 'Good.' },
      { id: 'spark', symbol: '✦', label: 'interesting', response: "We'll take that." },
      { id: 'uneasy', symbol: '⚠', label: 'alguma coisa está errada', response: 'We thought so too.' },
      { id: 'next', symbol: '???', label: 'preciso do próximo', response: 'Keep reading.' }
    ]
  },
  2: {
    title: 'A New Life',
    question: 'HOW WAS YOUR NIGHT?',
    options: [
      { id: 'moon', symbol: '☾', label: 'gostei', response: 'Good.' },
      { id: 'spark', symbol: '✦', label: 'interesting', response: 'A fresh start, maybe.' },
      { id: 'uneasy', symbol: '⚠', label: 'alguma coisa está errada', response: 'Could be the city.' },
      { id: 'next', symbol: '???', label: 'preciso do próximo', response: 'One more page.' }
    ]
  },
  3: {
    title: 'The Beginning of Life',
    question: 'HOW WAS YOUR NIGHT?',
    options: [
      { id: 'moon', symbol: '☾', label: 'gostei', response: 'Good.' },
      { id: 'spark', symbol: '✦', label: 'interesting', response: "We'll take that." },
      { id: 'uneasy', symbol: '⚠', label: 'alguma coisa está errada', response: 'Noted.' },
      { id: 'next', symbol: '???', label: 'preciso do próximo', response: 'Keep going.' }
    ]
  },
  4: {
    title: 'The First Day',
    question: 'HOW WAS YOUR NIGHT?',
    options: [
      { id: 'moon', symbol: '☾', label: 'gostei', response: 'Glad you stayed.' },
      { id: 'spark', symbol: '✦', label: 'interesting', response: 'We will remember that.' },
      { id: 'uneasy', symbol: '⚠', label: 'alguma coisa está errada', response: 'Maybe it is the hour.' },
      { id: 'next', symbol: '???', label: 'preciso do próximo', response: 'The next one is waiting.' }
    ]
  },
  5: {
    title: 'The First Night',
    question: 'HOW WAS YOUR NIGHT?',
    options: [
      { id: 'moon', symbol: '☾', label: 'foi uma boa festa', response: 'For most people, it was.' },
      { id: 'spark', symbol: '✦', label: 'gostei dessa noite', response: 'Some nights are worth remembering.' },
      { id: 'uneasy', symbol: '⚠', label: 'eu vi alguma coisa', response: "You weren't supposed to." },
      {
        id: 'next',
        symbol: '???',
        label: 'o que aconteceu lá fora?',
        response: 'Nothing.',
        followUp: '...probably.',
        followUpDelay: 1200
      }
    ]
  }
};

const reactionSection = document.querySelector('[data-chapter-reaction]');

if (reactionSection) {
  const chapterNumber = Number(reactionSection.dataset.chapterReaction);
  const chapterSettings = window.BROKEN_STREET_REACTIONS[chapterNumber];
  const question = reactionSection.querySelector('.reaction-question');
  const optionsContainer = reactionSection.querySelector('.reaction-options');
  const response = reactionSection.querySelector('.reaction-response');
  const status = reactionSection.querySelector('.reaction-status');

  if (!chapterSettings || !question || !optionsContainer || !response || !status) {
    throw new Error('Reader reaction markup or chapter settings are incomplete.');
  }

  question.textContent = chapterSettings.question;

  async function recordReaction(reactionId) {
    const supabase = window.BROKEN_STREET_SUPABASE;

    if (!supabase || !supabase.url || !supabase.anonKey) {
      throw new Error('Supabase URL and anon key have not been configured.');
    }

    const result = await fetch(`${supabase.url.replace(/\/$/, '')}/rest/v1/reader_reactions`, {
      method: 'POST',
      headers: {
        apikey: supabase.anonKey,
        Authorization: `Bearer ${supabase.anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        chapter_number: chapterNumber,
        reaction_id: reactionId
      })
    });

    if (!result.ok) {
      throw new Error(`Supabase rejected the reaction (${result.status}).`);
    }
  }

  function showResponse(option) {
    response.replaceChildren();
    response.textContent = option.response;
    response.hidden = false;
    response.classList.remove('is-visible');
    void response.offsetWidth;
    response.classList.add('is-visible');

    if (option.followUp) {
      window.setTimeout(() => {
        const followUp = document.createElement('span');
        followUp.className = 'reaction-follow-up';
        followUp.textContent = option.followUp;
        response.append(followUp);
      }, option.followUpDelay || 900);
    }
  }

  chapterSettings.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'reaction-option';
    button.type = 'button';
    button.dataset.reactionId = option.id;
    button.setAttribute('aria-pressed', 'false');
    button.style.setProperty('--reaction-index', index);
    button.textContent = `${option.symbol} ${option.label}`;

    button.addEventListener('click', async () => {
      if (button.disabled) return;

      optionsContainer.querySelectorAll('.reaction-option').forEach((otherOption) => {
        const isSelected = otherOption === button;
        otherOption.disabled = true;
        otherOption.classList.toggle('is-selected', isSelected);
        otherOption.classList.toggle('is-muted', !isSelected);
        otherOption.setAttribute('aria-pressed', String(isSelected));
      });

      showResponse(option);

      try {
        await recordReaction(option.id);
      } catch (error) {
        console.error('Reader reaction could not be recorded.', error);
        const supabase = window.BROKEN_STREET_SUPABASE;
        status.textContent = supabase && supabase.url && supabase.anonKey
          ? "We couldn't confirm your reaction reached us."
          : 'Reaction counts are not connected yet.';
        status.hidden = false;
      }
    });

    optionsContainer.append(button);
  });
}
