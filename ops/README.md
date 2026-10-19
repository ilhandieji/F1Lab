# F1Lab VPS operations

Canonical copies of production deploy scripts, systemd unit, and nginx site config. This tree lives on the **`server`** branch only.

## Layout

| Path | Installed on VPS |
|------|------------------|
| `ops/deploy/deploy-f1lab.sh` | `/usr/local/bin/deploy-f1lab` |
| `ops/deploy/deploy-f1lab-ssh-wrapper.sh` | `/usr/local/bin/deploy-f1lab-ssh-wrapper` |
| `ops/systemd/f1lab.service` | `/etc/systemd/system/f1lab.service` |
| `ops/nginx/f1lab-ir.conf` | `/etc/nginx/sites-available/f1lab-ir` |

Application code is deployed from **`main`** into `/home/ubuntu/apps/F1Lab`. Each deploy resets that clone to `origin/main`.

## Release workflow

1. Merge or push changes on **`main`** (application).
2. Merge `main` into **`server`** and push `server`.
3. GitHub Actions on `server` runs quality checks and SSH deploy.

## One-time / manual install on VPS

```bash
cd /home/ubuntu/apps/F1Lab
git fetch origin server
git checkout server -- ops   # or clone and run from server branch
sudo ./ops/install-to-vps.sh
```

## GitHub Actions deploy key

The `ubuntu` user `authorized_keys` entry should force:

```
command="/usr/local/bin/deploy-f1lab-ssh-wrapper",restrict ssh-ed25519 … github-actions-f1lab
```

Secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`.
