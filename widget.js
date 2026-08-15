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
    + '.gog-legal{font-size:10.5px;color:#8a8172;text-align:center;padding:0 12px 8px;background:#fff;}';

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
    var open = box.classList.toggle('open');
    if (open) { greet(); setTimeout(function () { input.focus(); }, 100); }
  }

  btn.addEventListener('click', toggle);
  box.querySelector('.gog-x').addEventListener('click', toggle);
  box.querySelector('#gog-send').addEventListener('click', send);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
})();
