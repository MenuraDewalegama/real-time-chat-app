#!/bin/bash
NAMESPACE="chat-app"

while true; do
  clear
  echo "============================================================"
  echo "  CHAT-APP ALERT MONITOR     $(date '+%Y-%m-%d %H:%M:%S')"
  echo "============================================================"

  echo
  echo "--- POD STATUS (restarts > 0 = potential alert) ---"
  kubectl -n $NAMESPACE get pods \
    -o custom-columns='NAME:.metadata.name,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,AGE:.metadata.creationTimestamp' \
    --no-headers | awk '{printf "%-45s %-10s %-10s\n", $1, $2, $3}'

  echo
  echo "--- RECENT WARNINGS ---"
  kubectl -n $NAMESPACE get events \
    --field-selector type=Warning \
    --sort-by='.lastTimestamp' \
    -o custom-columns='TIME:.lastTimestamp,REASON:.reason,OBJECT:.involvedObject.name,MESSAGE:.message' \
    --no-headers 2>/dev/null | tail -10

  echo
  echo "--- HPA STATUS ---"
  kubectl -n $NAMESPACE get hpa --no-headers 2>/dev/null

  echo
  echo "(refreshing every 5s — Ctrl+C to exit)"
  sleep 5
done
