# GOgestión — Demo (web + asistente virtual "Faby")

Demo preparado por botnexo para GOgestión (gestoría de extranjería, Sevilla).

- `index.html` — web reconstruida con la marca de GOgestión + asistente Faby.
- `widget.js` — widget de chat (Faby).
- `worker.js` — Cloudflare Worker (cerebro de Faby, basado en el Prompt Maestro de GOgestión).
- `privacidad/` — política de privacidad (RGPD).
- `wrangler.toml` — config del worker.

## Desplegar
1. Worker: `npx wrangler deploy` (o pegar `worker.js` en el panel de Cloudflare). Secretos: `ANTHROPIC_API_KEY`, `TELEGRAM_TOKEN`. Binding KV: `KV`.
2. Poner la URL del worker en `index.html` (`window.GOGESTION_WORKER_URL`).
3. Publicar la web en Cloudflare Pages (repo o subida directa).
