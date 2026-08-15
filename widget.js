/* ============================================================
   GOgestión — Widget de chat (asistente virtual)
   Autocontenido: inyecta el botón + panel y habla con el worker.
   Estilo de marca: granate #A6153A + crema. Texto plano (sin Markdown).
   Config: cambia WORKER_URL por la URL real de tu worker de Cloudflare.
   ============================================================ */
(function () {
  var WORKER_URL = (window.GOGESTION_WORKER_URL) || 'https://gogestion-bot.TU-SUBDOMINIO.workers.dev';
  var WINE   = '#A6153A';
  var WINE_D = '#8A1230';
  var CREAM  = '#FDF8F0';

  var css = ''
    + '#gog-btn{position:fixed;bottom:24px;right:24px;z-index:99999;width:60px;height:60px;border-radius:50%;background:' + WINE + ';border:none;cursor:pointer;box-shadow:0 6px 24px rgba(166,21,58,.45);display:flex;align-items:center;justify-content:center;font-size:26px;transition:transform .2s;}'
    + '#gog-btn:hover{transform:scale(1.07);}'
    + '#gog-btn .pulse{position:absolute;top:2px;right:2px;width:13px;height:13px;background:#37c76a;border-radius:50%;border:2px solid #fff;}'
    + '#gog-box{position:fixed;bottom:96px;right:24px;z-index:99998;width:370px;max-width:calc(100vw - 32px);background:#fff;border:1px solid #ece4d6;border-radius:18px;box-shadow:0 24px 60px rgba(60,20,30,.28);display:none;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}'
    + '#gog-box.open{display:flex;}'
    + '.gog-head{background:' + WINE + ';color:#fff;padding:14px 16px;display:flex;align-items:center;gap:11px;}'
    + '.gog-ava{width:40px;height:40px;border-radius:50%;background:#ffffff22;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}'
    + '.gog-head b{font-size:15px;display:block;line-height:1.2;}'
    + '.gog-head span{font-size:11.5px;color:#ffffffcc;display:flex;align-items:center;gap:5px;}'
    + '.gog-head .live{width:7px;height:7px;border-radius:50%;background:#5ee08a;display:inline-block;}'
    + '.gog-x{margin-left:auto;background:none;border:none;color:#ffffffcc;font-size:20px;cursor:pointer;line-height:1;padding:2px 6px;}'
    + '.gog-msgs{padding:16px 14px;display:flex;flex-direction:column;gap:9px;height:340px;max-height:52vh;overflow-y:auto;background:' + CREAM + ';}'
    + '.gog-b{max-width:84%;padding:10px 13px;font-size:14px;line-height:1.55;border-radius:15px;white-space:pre-wrap;word-break:break-word;}'
    + '.gog-b.bot{align-self:flex-start;background:#fff;border:1px solid #ece4d6;color:#1c2027;border-bottom-left-radius:5px;}'
    + '.gog-b.me{align-self:flex-end;background:' + WINE + ';color:#fff;border-bottom-right-radius:5px;}'
    + '.gog-b a{color:inherit;text-decoration:underline;}'
    + '.gog-typing{align-self:flex-start;display:flex;gap:4px;padding:10px 14px;}'
    + '.gog-typing i{width:6px;height:6px;border-radius:50%;background:#b9a58e;display:inline-block;animation:gogblink 1.2s infinite;}'
    + '.gog-typing i:nth-child(2){animation-delay:.2s;} .gog-typing i:nth-child(3){animation-delay:.4s;}'
    + '@keyframes gogblink{0%,80%,100%{opacity:.3;}40%{opacity:1;}}'
    + '.gog-foot{display:flex;gap:8px;padding:11px 12px;border-top:1px solid #ece4d6;background:#fff;}'
    + '.gog-foot input{flex:1;border:1px solid #e0d8c9;border-radius:12px;padding:10px 12px;font-size:14px;outline:none;font-family:inherit;}'
    + '.gog-foot input:focus{border-color:' + WINE + ';}'
    + '.gog-send{width:38px;height:38px;border-radius:50%;background:' + WINE + ';color:#fff;border:none;cursor:pointer;font-size:16px;flex-shrink:0;}'
    + '.gog-send:hover{background:' + WINE_D + ';}'
    + '.gog-legal{font-size:10.5px;color:#8a8172;text-align:center;padding:0 12px 8px;background:#fff;}'
    + '#gog-wa-btn{position:fixed;bottom:27px;right:96px;z-index:99997;width:54px;height:54px;border-radius:50%;background:#25D366;color:#fff;border:0;cursor:pointer;box-shadow:0 7px 22px rgba(20,105,53,.28);display:grid;place-items:center;transition:transform .2s,box-shadow .2s;}'
    + '#gog-wa-btn:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 12px 28px rgba(20,105,53,.35);}'
    + '#gog-wa-btn svg{width:27px;height:27px;display:block;}'
    + '#gog-wa-choice{position:fixed;right:24px;bottom:96px;z-index:99997;width:330px;max-width:calc(100vw - 32px);padding:22px;background:#fff;border:1px solid #e3e3e6;border-radius:12px;box-shadow:0 22px 58px rgba(23,25,34,.2);font-family:"Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",sans-serif;display:none;}'
    + '#gog-wa-choice.open{display:block;animation:gogWaIn .2s ease-out;}'
    + '@keyframes gogWaIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'
    + '.gog-wa-close{position:absolute;top:11px;right:12px;border:0;background:none;color:#7a7e88;font-size:19px;line-height:1;cursor:pointer;padding:5px;}'
    + '#gog-wa-choice strong{display:block;padding-right:24px;color:#171922;font-size:17px;letter-spacing:-.02em;}'
    + '#gog-wa-choice p{margin:8px 0 18px;color:#686d78;font-size:13px;line-height:1.55;}'
    + '.gog-wa-actions{display:grid;gap:8px;}'
    + '.gog-wa-actions button,.gog-wa-actions a{min-height:43px;display:flex;align-items:center;justify-content:center;border-radius:7px;padding:0 14px;font-size:12.5px;font-weight:750;text-decoration:none;cursor:pointer;}'
    + '.gog-wa-ai{border:0;background:' + WINE + ';color:#fff;}.gog-wa-ai:hover{background:' + WINE_D + ';}'
    + '.gog-wa-direct{border:1px solid #b9dfc5;background:#fff;color:#137333;}.gog-wa-direct:hover{background:#f1fbf4;}'
    + '@media(max-width:480px){#gog-btn{right:18px;bottom:18px}#gog-wa-btn{right:88px;bottom:21px}#gog-wa-choice{right:16px;bottom:88px}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'gog-btn';
  btn.setAttribute('aria-label', 'Abrir chat de GOgestión');
  btn.innerHTML = '⚖️<span class="pulse"></span>';
  document.body.appendChild(btn);

  var box = document.createElement('div');
  box.id = 'gog-box';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Asistente de GOgestión');
  box.innerHTML = ''
    + '<div class="gog-head"><div class="gog-ava">💬</div><div><b>Faby · GOgestión</b><span><span class="live"></span> En línea · te orientamos al instante</span></div><button class="gog-x" aria-label="Cerrar">✕</button></div>'
    + '<div class="gog-msgs" id="gog-msgs"></div>'
    + '<div class="gog-foot"><input id="gog-input" type="text" placeholder="Escribe tu consulta…" autocomplete="off" /><button class="gog-send" id="gog-send" aria-label="Enviar">➤</button></div>'
    + '<div class="gog-legal">Orientación inicial · no sustituye asesoramiento jurídico · con la tecnología de Velai</div>';
  document.body.appendChild(box);

  var waBtn = document.createElement('button');
  waBtn.id = 'gog-wa-btn';
  waBtn.type = 'button';
  waBtn.setAttribute('aria-label', 'Contactar por WhatsApp');
  waBtn.setAttribute('aria-expanded', 'false');
  waBtn.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C9.42 3 4.03 8.36 4.03 14.95c0 2.3.66 4.54 1.91 6.47L4 28.5l7.27-1.91a12.06 12.06 0 0 0 4.76.97h.01c6.62 0 12.01-5.36 12.01-11.95C28.05 9.02 22.66 3 16.04 3Zm7.07 17.1c-.3.84-1.75 1.61-2.42 1.67-.62.06-1.39.09-2.24-.18-.52-.16-1.18-.38-2.03-.75-3.57-1.54-5.9-5.12-6.08-5.36-.18-.24-1.45-1.92-1.45-3.67 0-1.75.92-2.61 1.24-2.97.32-.36.7-.45.94-.45h.68c.22 0 .51-.08.8.61.3.72 1.01 2.46 1.1 2.64.09.18.15.39.03.63-.12.24-.18.39-.35.6-.18.21-.37.47-.53.63-.18.18-.36.37-.16.73.21.36.91 1.5 1.96 2.42 1.35 1.2 2.48 1.57 2.84 1.75.35.18.56.15.77-.09.21-.24.89-1.03 1.13-1.39.24-.36.48-.3.8-.18.33.12 2.07.97 2.42 1.15.36.18.59.27.68.42.09.15.09.86-.21 1.7Z"/></svg>';
  document.body.appendChild(waBtn);

  var waChoice = document.createElement('div');
  waChoice.id = 'gog-wa-choice';
  waChoice.setAttribute('role', 'dialog');
  waChoice.setAttribute('aria-label', 'Elegir cómo recibir ayuda');
  waChoice.innerHTML = ''
    + '<button class="gog-wa-close" type="button" aria-label="Cerrar">×</button>'
    + '<strong>¿Quieres que Faby te oriente primero?</strong>'
    + '<p>Puede identificar tu trámite y ayudarte a llegar a WhatsApp con el caso más claro.</p>'
    + '<div class="gog-wa-actions"><button class="gog-wa-ai" type="button">Sí, hablar con Faby</button><a class="gog-wa-direct" href="https://wa.me/34634167405" target="_blank" rel="noopener">No, ir directamente a WhatsApp</a></div>';
  document.body.appendChild(waChoice);

  var msgsEl = box.querySelector('#gog-msgs');
  var input  = box.querySelector('#gog-input');
  var history = [];
  var greeted = false;

  function clean(t) {
    return String(t || '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/(^|\n)#{1,6}\s*/g, '$1')
      .replace(/`/g, '');
  }
  function linkify(safeText) {
    return safeText.replace(/(https?:\/\/[^\s]+)/g, function (u) {
      return '<a href="' + u + '" target="_blank" rel="noopener">' + u + '</a>';
    });
  }
  function addMsg(role, text) {
    var d = document.createElement('div');
    d.className = 'gog-b ' + (role === 'bot' ? 'bot' : 'me');
    var safe = clean(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (role === 'bot') d.innerHTML = linkify(safe); else d.textContent = clean(text);
    msgsEl.appendChild(d);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
  function typing(on) {
    var t = box.querySelector('.gog-typing');
    if (on && !t) {
      t = document.createElement('div');
      t.className = 'gog-typing';
      t.innerHTML = '<i></i><i></i><i></i>';
      msgsEl.appendChild(t);
      msgsEl.scrollTop = msgsEl.scrollHeight;
    } else if (!on && t) { t.remove(); }
  }

  function greet() {
    if (greeted) return; greeted = true;
    addMsg('bot', '¡Hola! 👋 Soy Faby, la asistente de GOgestión, gestoría de extranjería en Sevilla. ¿En qué trámite o situación te puedo orientar? (arraigo, nacionalidad, reagrupación, estudios, canje de carnet…)');
  }

  async function send() {
    var text = input.value.trim();
    if (!text) return;
    addMsg('me', text);
    history.push({ role: 'user', content: text });
    input.value = '';
    typing(true);
    try {
      var r = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      var d = await r.json();
      typing(false);
      var reply = (d && d.reply) ? d.reply : 'Perdona, ha habido un problema técnico. Escríbenos al +34 634 167 405 y te ayudamos.';
      addMsg('bot', reply);
      history.push({ role: 'assistant', content: reply });
    } catch (e) {
      typing(false);
      addMsg('bot', 'No he podido conectar ahora mismo. Puedes escribirnos al +34 634 167 405 y te atendemos.');
    }
  }

  function toggle() {
    waChoice.classList.remove('open');
    waBtn.setAttribute('aria-expanded', 'false');
    var open = box.classList.toggle('open');
    if (open) { greet(); setTimeout(function () { input.focus(); }, 100); }
  }

  btn.addEventListener('click', toggle);
  waBtn.addEventListener('click', function () {
    var open = waChoice.classList.toggle('open');
    waBtn.setAttribute('aria-expanded', String(open));
    if (open && box.classList.contains('open')) box.classList.remove('open');
  });
  waChoice.querySelector('.gog-wa-close').addEventListener('click', function () {
    waChoice.classList.remove('open');
    waBtn.setAttribute('aria-expanded', 'false');
  });
  waChoice.querySelector('.gog-wa-ai').addEventListener('click', function () {
    waChoice.classList.remove('open');
    waBtn.setAttribute('aria-expanded', 'false');
    if (!box.classList.contains('open')) toggle();
  });
  waChoice.querySelector('.gog-wa-direct').addEventListener('click', function () {
    waChoice.classList.remove('open');
    waBtn.setAttribute('aria-expanded', 'false');
  });
  box.querySelector('.gog-x').addEventListener('click', toggle);
  box.querySelector('#gog-send').addEventListener('click', send);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
})();
