# Open WebUI on ai.tanlian.dev

This deploys Open WebUI on the Tencent VM and points it at Ollama running on the desktop over Tailscale.

## Target Topology

- Desktop: Ollama bound to the Tailscale interface and firewalled to the tailnet.
- Tencent VM: Dockerized Open WebUI bound to `127.0.0.1:3000`.
- Public edge: Nginx and Let's Encrypt serving `https://ai.tanlian.dev`.
- Ollama tailnet URL: `http://100.95.137.108:11434`.

## Desktop Setup

Install Ollama and pull a small model:

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen2.5:3b-instruct-q4_K_M
ollama run qwen2.5:3b-instruct-q4_K_M
```

Bind Ollama beyond localhost:

```bash
sudo systemctl edit ollama.service
```

Add:

```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
```

Restart and verify:

```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
curl http://127.0.0.1:11434/api/tags
```

Lock the port to Tailscale:

```bash
sudo ufw allow in on tailscale0 from 100.64.0.0/10 to any port 11434 proto tcp
sudo ufw deny 11434/tcp
sudo ufw status numbered
```

## Tencent VM Setup

Install and join Tailscale:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
tailscale ping 100.95.137.108
curl http://100.95.137.108:11434/api/tags
```

Start Open WebUI:

```bash
cd deploy/open-webui
cp .env.example .env
openssl rand -hex 32
```

Put the generated value in `WEBUI_SECRET_KEY`, then:

```bash
docker compose up -d
docker compose logs -f open-webui
curl http://127.0.0.1:3000
```

For first admin bootstrap, either temporarily set `ENABLE_SIGNUP=true`, create the first admin account, then set it back to `false` and restart:

```bash
docker compose up -d
```

Or set `WEBUI_ADMIN_EMAIL` and `WEBUI_ADMIN_PASSWORD` in `.env` before the first boot.

## Nginx and TLS

Point DNS for `ai.tanlian.dev` at the Tencent VM first.

Install the vhost:

```bash
sudo cp deploy/open-webui/nginx/ai.tanlian.dev.bootstrap.conf /etc/nginx/sites-available/ai.tanlian.dev
sudo ln -s /etc/nginx/sites-available/ai.tanlian.dev /etc/nginx/sites-enabled/ai.tanlian.dev
sudo nginx -t
sudo systemctl reload nginx
```

Issue the certificate:

```bash
sudo certbot --nginx -d ai.tanlian.dev
```

Replace the bootstrap vhost with the final TLS config if certbot did not already write an equivalent HTTPS server:

```bash
sudo cp deploy/open-webui/nginx/ai.tanlian.dev.conf /etc/nginx/sites-available/ai.tanlian.dev
sudo nginx -t
sudo systemctl reload nginx
```

After TLS is active, verify:

```bash
curl -I https://ai.tanlian.dev
docker compose logs --tail=100 open-webui
```

## Operations

Upgrade Open WebUI:

```bash
cd deploy/open-webui
docker compose pull
docker compose up -d
```

Back up chat/account data:

```bash
docker run --rm -v open-webui_open_webui_data:/data -v "$PWD":/backup alpine tar czf /backup/open-webui-data.tgz -C /data .
```
