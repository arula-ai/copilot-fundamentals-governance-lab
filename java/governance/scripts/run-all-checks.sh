#!/bin/bash

echo "Running all quality and security checks..."
echo ""

FAILED=0

COMMANDS=(
  "mvn -B -q clean"
  "mvn -B test"
  "mvn -B verify"
  "mvn -B package"
  "mvn -B dependency:tree"
)

STEP=1
TOTAL=${#COMMANDS[@]}
for CMD in "${COMMANDS[@]}"; do
  echo "[$STEP/$TOTAL] Executing: $CMD"
  if ! eval "$CMD"; then
    echo "ERROR: Command failed -> $CMD"
    FAILED=$((FAILED + 1))
  else
    echo "SUCCESS: $CMD"
  fi
  echo ""
  STEP=$((STEP + 1))
done

echo "[${STEP}/$TOTAL] Generating Jacoco report"
if ! mvn -B jacoco:report; then
  echo "ERROR: Jacoco report generation failed."
  FAILED=$((FAILED + 1))
else
  echo "SUCCESS: Jacoco report generated."
fi

echo "================================================"
if [ $FAILED -eq 0 ]; then
    echo "All checks passed!"
    exit 0
else
    echo "$FAILED check(s) failed."
    exit 1
fi
