#!/usr/bin/env bash
# Installed on the VPS as /usr/local/bin/deploy-f1lab (ubuntu user, GitHub Actions deploy key).
set -Eeuo pipefail

APP_DIR="/home/ubuntu/apps/F1Lab"
BRANCH="main"
SERVICE="f1lab"
DEPLOYMENT_ACTIVE=0

on_exit() {
  local exit_code=$?
  trap - EXIT

  if [[ "$exit_code" -ne 0 ]]; then
    echo "DEPLOY FAILED (exit code: $exit_code)" >&2

    if [[ "$DEPLOYMENT_ACTIVE" -eq 1 ]]; then
      echo "Attempting to restart F1Lab after failure..."
      sudo systemctl restart "$SERVICE" || sudo systemctl start "$SERVICE" || true
      echo "=== Service status ==="
      sudo systemctl status "$SERVICE" --no-pager || true
      echo "=== Recent application logs ==="
      sudo journalctl -u "$SERVICE" -n 60 --no-pager || true
    fi
  fi

  exit "$exit_code"
}

trap on_exit EXIT

cd "$APP_DIR"

exec 9>/tmp/f1lab-deploy.lock
if ! flock -n 9; then
  echo "ERROR: Another deployment is already running."
  exit 1
fi

if ! git check-ignore -q .env; then
  echo "ERROR: .env is not ignored by Git. Aborting."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: The repository has local changes. Aborting."
  git status --short
  exit 1
fi

echo "=== Stopping F1Lab ==="
sudo systemctl stop "$SERVICE"
DEPLOYMENT_ACTIVE=1

if command -v fuser >/dev/null 2>&1; then
  sudo fuser -k 3000/tcp >/dev/null 2>&1 || true
fi

echo "=== Fetching latest code ==="
git fetch origin "$BRANCH"
git merge --ff-only "origin/$BRANCH"

echo "=== Installing dependencies ==="
pnpm install --frozen-lockfile

echo "=== Generating Prisma Client ==="
pnpm exec prisma generate --config prisma7.config.ts

echo "=== Building Next.js production version ==="
pnpm build

echo "=== Starting F1Lab ==="
sudo systemctl start "$SERVICE"

echo "=== Waiting for service ==="
for attempt in {1..60}; do
  if sudo systemctl is-active --quiet "$SERVICE"; then
    break
  fi
  sleep 1
done

echo "=== Checking application health ==="
for attempt in {1..45}; do
  if curl -fsS --max-time 3 http://127.0.0.1:3000/ -o /dev/null; then
    DEPLOYMENT_ACTIVE=0
    echo "DEPLOY SUCCESSFUL"
    exit 0
  fi
  sleep 1
done

echo "ERROR: F1Lab did not respond within 45 seconds."
exit 1
