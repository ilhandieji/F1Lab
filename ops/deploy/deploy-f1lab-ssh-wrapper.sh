#!/usr/bin/env bash
# SSH forced-command entrypoint: survive client disconnect during long builds.
exec setsid /usr/local/bin/deploy-f1lab
