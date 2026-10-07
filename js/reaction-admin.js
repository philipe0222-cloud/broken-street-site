const loginForm = document.querySelector('[data-admin-login]');
const dashboard = document.querySelector('[data-admin-dashboard]');
const countsBody = document.querySelector('[data-admin-counts]');
const statusMessage = document.querySelector('[data-admin-status]');
const logoutButton = document.querySelector('[data-admin-logout]');
const supabaseConfig = window.BROKEN_STREET_SUPABASE;

function setAdminStatus(message, isError) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle('is-error', Boolean(isError));
}

async function readResponse(response) {
  let body = {};

  try {
    body = await response.json();
  } catch (error) {
    if (response.ok) throw error;
  }

  if (!response.ok) {
    throw new Error(body.msg || body.message || `Supabase request failed (${response.status}).`);
  }

  return body;
}

async function loadReactionCounts(accessToken) {
  const response = await fetch(`${supabaseConfig.url.replace(/\/$/, '')}/rest/v1/rpc/get_reader_reaction_counts`, {
    method: 'POST',
    headers: {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: '{}'
  });
  const rows = await readResponse(response);
  const totals = new Map(rows.map((row) => [`${row.chapter_number}:${row.reaction_id}`, Number(row.total)]));

  countsBody.replaceChildren();

  Object.entries(window.BROKEN_STREET_REACTIONS).forEach(([chapterNumber, chapter]) => {
    chapter.options.forEach((option) => {
      const row = document.createElement('tr');
      const chapterCell = document.createElement('td');
      const reactionCell = document.createElement('td');
      const countCell = document.createElement('td');

      chapterCell.textContent = `${String(chapterNumber).padStart(2, '0')} · ${chapter.title}`;
      reactionCell.textContent = `${option.symbol} ${option.label}`;
      countCell.textContent = String(totals.get(`${chapterNumber}:${option.id}`) || 0);

      row.append(chapterCell, reactionCell, countCell);
      countsBody.append(row);
    });
  });

  loginForm.hidden = true;
  dashboard.hidden = false;
  setAdminStatus('Counts loaded.', false);
}

if (!loginForm || !dashboard || !countsBody || !statusMessage || !logoutButton) {
  throw new Error('Reader reaction admin page markup is incomplete.');
}

if (!supabaseConfig || !supabaseConfig.url || !supabaseConfig.anonKey) {
  loginForm.querySelector('button[type="submit"]').disabled = true;
  setAdminStatus('Add the Supabase project URL and anon key to js/supabase-config.js before signing in.', true);
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = loginForm.querySelector('button[type="submit"]');
  const formData = new FormData(loginForm);
  submitButton.disabled = true;
  setAdminStatus('Signing in…', false);

  try {
    const response = await fetch(`${supabaseConfig.url.replace(/\/$/, '')}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: supabaseConfig.anonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password')
      })
    });
    const session = await readResponse(response);

    if (!session.access_token) {
      throw new Error('Supabase did not return an access token.');
    }

    await loadReactionCounts(session.access_token);
    loginForm.reset();
  } catch (error) {
    console.error('Creator could not load reader reaction counts.', error);
    setAdminStatus('Sign-in or count loading failed. Check the Supabase setup and try again.', true);
  } finally {
    submitButton.disabled = false;
  }
});

logoutButton.addEventListener('click', () => {
  dashboard.hidden = true;
  loginForm.hidden = false;
  loginForm.reset();
  setAdminStatus('Signed out.', false);
});
