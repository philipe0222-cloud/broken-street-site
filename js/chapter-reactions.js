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
  },
  6: {
    title: 'The Morning After',
    question: 'HOW DID THE MORNING FEEL?',
    options: [
      { id: 'moon', symbol: '☾', label: 'a cidade parece diferente', response: 'It does now.' },
      { id: 'spark', symbol: '✦', label: 'quero entender a energia', response: 'So do they.' },
      { id: 'uneasy', symbol: '⚠', label: 'a criatura ainda está lá', response: 'Somewhere.' },
      { id: 'next', symbol: '???', label: 'preciso continuar', response: 'The pattern is waiting.' }
    ]
  },
  7: {
    title: 'The Tension',
    question: 'WHAT WOULD YOU FOLLOW?',
    options: [
      { id: 'moon', symbol: '☾', label: 'os desaparecimentos', response: 'Start with the map.' },
      { id: 'spark', symbol: '✦', label: 'as marcas no concreto', response: 'They were left recently.' },
      { id: 'uneasy', symbol: '⚠', label: 'a equipe no beco', response: 'They are not alone.' },
      { id: 'next', symbol: '???', label: 'quero ver o primeiro contato', response: 'Keep reading.' }
    ]
  },
  8: {
    title: 'First Contact',
    question: 'WHO REACHED THE TRUTH FIRST?',
    options: [
      { id: 'moon', symbol: '☾', label: 'a equipe de contenção', response: 'They found the evidence.' },
      { id: 'spark', symbol: '✦', label: 'Philip e Aidem', response: 'They followed the signs.' },
      { id: 'uneasy', symbol: '⚠', label: 'alguém que observa', response: 'Someone is always watching.' },
      { id: 'next', symbol: '???', label: 'quero continuar', response: 'There is more to uncover.' }
    ]
  },
  9: {
    title: 'School and Friendships',
    question: 'WHAT SHOULD PHILIP HOLD ON TO?',
    options: [
      { id: 'moon', symbol: '☾', label: 'uma rotina normal', response: 'Some things are worth protecting.' },
      { id: 'spark', symbol: '✦', label: 'as novas amizades', response: 'He does not have to face it alone.' },
      { id: 'uneasy', symbol: '⚠', label: 'as respostas sobre a cidade', response: 'The city keeps its secrets.' },
      { id: 'next', symbol: '???', label: 'quero mais um capítulo', response: 'The story continues.' }
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
