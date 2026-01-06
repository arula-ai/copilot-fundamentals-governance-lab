#!/bin/bash

echo "Setting up Copilot Governance Lab for Angular..."

if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed. Please install npm first."
    exit 1
fi

echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies."
    exit 1
fi

echo "Checking Angular CLI..."
if ! command -v ng &> /dev/null; then
    echo "Installing Angular CLI globally..."
    npm install -g @angular/cli@16
fi

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run 'npm start' to start the development server"
echo "  2. Run 'npm test' to run tests"
echo "  3. Review .github/instructions/angular.instructions.md for team guidelines"
echo "  4. Follow the workflow in docs/workflow-guide.md"
echo ""
echo "Happy coding!"
