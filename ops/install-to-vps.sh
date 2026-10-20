#!/usr/bin/env bash
# Run on the VPS from a checkout of the server branch (or via scp of ops/).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

sudo install -m 755 "$REPO_ROOT/ops/deploy/deploy-f1lab.sh" /usr/local/bin/deploy-f1lab
sudo install -m 755 "$REPO_ROOT/ops/deploy/deploy-f1lab-ssh-wrapper.sh" /usr/local/bin/deploy-f1lab-ssh-wrapper
sudo install -m 644 "$REPO_ROOT/ops/systemd/f1lab.service" /etc/systemd/system/f1lab.service
sudo install -m 644 "$REPO_ROOT/ops/nginx/f1lab-ir.conf" /etc/nginx/sites-available/f1lab-ir

if [[ ! -e /etc/nginx/sites-enabled/f1lab-ir ]]; then
  sudo ln -sf /etc/nginx/sites-available/f1lab-ir /etc/nginx/sites-enabled/f1lab-ir
fi

sudo systemctl daemon-reload
sudo nginx -t
sudo systemctl enable f1lab
echo "Ops files installed. Deploy key should use: command=\"/usr/local/bin/deploy-f1lab-ssh-wrapper\""
