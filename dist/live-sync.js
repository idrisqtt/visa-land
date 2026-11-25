/* Refresh published content after confirmed saves, including in other open tabs. */
(() => {
  const signalKey = 'visaland:published';
  const stateKey = 'visaland:restore:' + location.pathname + location.search;
  const channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel(signalKey) : null;
  let watching = false, revision = null, checking = false, refreshing = false;
  let timer, subscription;

  function rememberPage() {
    const fields = [...document.querySelectorAll('#lead-form input, #lead-form select, #lead-form textarea')]
      .map((field, index) => ({index, value: field.value, checked: field.checked}));
    try { sessionStorage.setItem(stateKey, JSON.stringify({scroll: scrollY, fields, time: Date.now()})); } catch {}
  }

  function restorePage() {
    let state;
    try { state = JSON.parse(sessionStorage.getItem(stateKey)); sessionStorage.removeItem(stateKey); } catch {}
    if (!state || Date.now() - state.time > 60000) return;
    const fields = [...document.querySelectorAll('#lead-form input, #lead-form select, #lead-form textarea')];
    state.fields.forEach(saved => {
      const field = fields[saved.index];
      if (!field) return;
      field.value = saved.value;
      if (field.type === 'checkbox') field.checked = saved.checked;
      if (field.tagName === 'SELECT') field.dispatchEvent(new Event('change', {bubbles: true}));
    });
    requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      window.scrollTo({top: state.scroll, behavior: 'instant'});
    })));
  }
  document.addEventListener('visa-content-ready', restorePage, {once: true});

  async function check() {
    if (!watching || checking || refreshing || document.hidden || !window.visaSupabase) return;
    if (document.querySelector('#lead-form button[type="submit"]')?.disabled) return;
    checking = true;
    try {
      const request = window.visaSupabase.from('site_config').select('updated_at').eq('id', 'main').maybeSingle();
      const {data, error} = await request;
      if (error || !data?.updated_at) return;
      if (data.updated_at === revision) return;
      refreshing = true;
      rememberPage();
      location.reload();
    } catch {
      // Keep the current page usable while offline; the next check retries.
    } finally { checking = false; }
  }

  function publish(updatedAt) {
    const message = {updatedAt};
    channel?.postMessage(message);
    try { localStorage.setItem(signalKey, JSON.stringify({...message, nonce: Date.now()})); } catch {}
    document.dispatchEvent(new CustomEvent('visa-config-saved', {detail: message}));
  }

  function watch(updatedAt) {
    if (watching) return;
    watching = true;
    revision = updatedAt || null;
    timer = setInterval(check, 5000);
    if (window.visaSupabase?.channel) {
      subscription = window.visaSupabase.channel('public-site-config')
        .on('postgres_changes', {event: '*', schema: 'public', table: 'site_config', filter: 'id=eq.main'}, check)
        .subscribe();
    }
    check();
  }
  channel?.addEventListener('message', check);
  window.addEventListener('storage', event => { if (event.key === signalKey) check(); });
  window.addEventListener('focus', check);
  document.addEventListener('visibilitychange', check);
  window.addEventListener('pagehide', () => {
    clearInterval(timer);
    if (subscription) window.visaSupabase?.removeChannel(subscription);
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted && watching) { timer = setInterval(check, 5000); check(); }
  });
  window.VisaLive = {publish, watch};
})();
