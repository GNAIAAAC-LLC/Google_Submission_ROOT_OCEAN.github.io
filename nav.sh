#!/bin/bash
# nav.sh — simple Bash wrapper for voice navigation

VOICE="$1"
TOKEN="$2"
MODE="$3"

node nav-run.js "$VOICE" "$TOKEN" "$MODE"