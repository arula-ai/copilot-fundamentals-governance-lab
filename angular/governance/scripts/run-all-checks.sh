#!/bin/bash

echo "Running all quality and security checks..."
echo ""

FAILED=0

echo "[1/6] Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
    echo "ERROR: ESLint failed."
    FAILED=$((FAILED + 1))
else
    echo "SUCCESS: ESLint passed."
fi
echo ""

echo "[2/6] Running security-focused ESLint..."
npm run lint:security
if [ $? -ne 0 ]; then
    echo "ERROR: Security ESLint failed."
    FAILED=$((FAILED + 1))
else
    echo "SUCCESS: Security ESLint passed."
fi
echo ""

echo "[3/6] Running npm audit..."
npm audit --audit-level=high
if [ $? -ne 0 ]; then
    echo "WARNING: npm audit found vulnerabilities."
    FAILED=$((FAILED + 1))
else
    echo "SUCCESS: npm audit passed."
fi
echo ""

echo "[4/6] Running TypeScript compiler check..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "ERROR: TypeScript compilation failed."
    FAILED=$((FAILED + 1))
else
    echo "SUCCESS: TypeScript check passed."
fi
echo ""

echo "[5/6] Running tests with coverage..."
npm run test:coverage
if [ $? -ne 0 ]; then
    echo "ERROR: Tests failed."
    FAILED=$((FAILED + 1))
else
    echo "SUCCESS: Tests passed."
fi
echo ""

echo "[6/6] Building production bundle..."
npm run build -- --configuration production
if [ $? -ne 0 ]; then
    echo "ERROR: Production build failed."
    FAILED=$((FAILED + 1))
else
    echo "SUCCESS: Production build succeeded."
fi
echo ""

echo "================================================"
if [ $FAILED -eq 0 ]; then
    echo "All checks passed!"
    exit 0
else
    echo "$FAILED check(s) failed."
    exit 1
fi
