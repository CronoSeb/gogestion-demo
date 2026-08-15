# GOgestión — Demo (web + asistente virtual "Faby")

Demo preparado por botnexo para GOgestión (gestoría de extranjería, Sevilla).

- `index.html` — web reconstruida con la marca de GOgestión + asistente Faby.
- `videos/gogestion_vi.mp4` — video oficial conservado como pieza principal del hero.
- `images/` — logotipos y sello del Colegio de Gestores usados en la propuesta.
- `fonts/plus-jakarta-sans.woff2` — tipografía de marca alojada localmente.
- `widget.js` — widget de chat (Faby).
- `worker.js` — Cloudflare Worker (cerebro de Faby, basado en el Prompt Maestro de GOgestión).
- `privacidad/` — política de privacidad (RGPD).
- `wrangler.toml` — config del worker.

## Desplegar
1. Worker: `npx wrangler deploy` (o pegar `worker.js` en el panel de Cloudflare). Secretos: `ANTHROPIC_API_KEY`, `TELEGRAM_TOKEN`. Binding KV: `KV`.
2. Poner la URL del worker en `index.html` (`window.GOGESTION_WORKER_URL`).
3. Publicar la web en Cloudflare Pages (repo o subida directa).

## Dirección de la propuesta
La interfaz usa una base blanca, tipografía Plus Jakarta Sans y una paleta contenida en blanco, grafito y burdeos. La mejora no depende solo del asistente: incorpora un recorrido de trabajo visible, seguimiento de expedientes, precios ordenados y respaldo colegial para reforzar confianza y conversión.
