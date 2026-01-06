# DevContainer Configuration

This directory contains the DevContainer configuration for the Copilot Governance Lab.

## What is a DevContainer?

A Development Container (DevContainer) is a Docker container configured as a full-featured development environment. It includes all the tools, runtimes, and extensions needed for this lab.

## Benefits

- **Zero Setup Time**: Everything pre-configured and ready to use  
- **Consistency**: Everyone uses the exact same environment  
- **No Version Conflicts**: Node, npm, Angular CLI all pre-installed  
- **Pre-loaded Extensions**: ESLint, Prettier, Copilot all configured  
- **Works with GitHub Codespaces**: Instant cloud-based development  

## Prerequisites

- **Docker Desktop** installed and running
- **VS Code** with the "Dev Containers" extension
  - Install: `code --install-extension ms-vscode-remote.remote-containers`
- **GitHub Copilot** subscription (for full experience)

## How to Use

### Option 1: Local with VS Code

1. Open this folder in VS Code
2. When prompted, click "Reopen in Container"
3. Or use Command Palette: `Dev Containers: Reopen in Container`
4. Wait for container to build (~2-3 minutes first time)
5. Start coding!

### Option 2: GitHub Codespaces

1. Click "Code" → "Codespaces" → "Create codespace on main"
2. Wait for environment to initialize (~2 minutes)
3. Start coding in the browser!

### Option 3: Command Line

```bash
# Build and open in container
code --folder-uri vscode-remote://dev-container+$(pwd | sed 's|/|%2F|g')/workspaces/copilot-governance-lab-angular
```

## What's Included

### Base Image
- **Node.js 18** (LTS)
- **npm** and **npx**
- **Git** pre-configured
- **GitHub CLI** (gh)

### Angular Tooling
- **Angular CLI 16** (installed globally)
- **TypeScript 5.1**
- All project dependencies via npm

### VS Code Extensions
- **GitHub Copilot** - AI pair programmer
- **GitHub Copilot Chat** - AI chat assistant
- **Angular Language Service** - Angular IntelliSense
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Jest Runner** - Test execution

### Pre-configured Settings
- Format on save enabled
- ESLint auto-fix on save
- TypeScript strict mode
- Copilot enabled for TypeScript/HTML
- Auto-save on focus change

## Ports Forwarded

- **4200**: Angular development server (`ng serve`)
- **9876**: Karma test server (`ng test`)

## First Steps After Container Starts

The container automatically runs:
```bash
npm install
npm install -g @angular/cli@16
```

You can immediately start:
```bash
# Start dev server
npm start

# Run tests
npm test

# Run linting
npm run lint

# Start first exercise
cd exercises/01-vulnerable-components
```

## Customization

### Adding Extensions

Edit `.devcontainer/devcontainer.json`:
```json
"customizations": {
  "vscode": {
    "extensions": [
      "your-extension-id"
    ]
  }
}
```

### Changing Node Version

Edit the `image` property:
```json
"image": "mcr.microsoft.com/devcontainers/typescript-node:20-bullseye"
```

### Adding System Packages

Add a `Dockerfile`:
```dockerfile
FROM mcr.microsoft.com/devcontainers/typescript-node:18-bullseye

RUN apt-get update && apt-get install -y \\
    your-package-here
```

Then update `devcontainer.json`:
```json
"build": {
  "dockerfile": "Dockerfile"
}
```

## Troubleshooting

### Container won't start
```bash
# Rebuild container without cache
Command Palette → "Dev Containers: Rebuild Container Without Cache"
```

### Ports not forwarding
- Check Docker Desktop is running
- Verify ports 4200 and 9876 aren't in use locally
- Try manually forwarding: Ports panel → Add Port

### Extensions not loading
- Ensure VS Code is up to date
- Check Docker has enough resources (4GB RAM minimum)
- Try rebuilding container

### npm install fails
```bash
# Inside container terminal
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Git not configured
```bash
# Inside container terminal
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Performance Tips

### Speed up builds
- Use `.dockerignore` to exclude unnecessary files
- Commit node_modules to image (advanced)
- Use Docker BuildKit

### Reduce resource usage
- Limit Docker Desktop resources in settings
- Stop container when not in use
- Use local setup for quick checks

## Comparison: DevContainer vs Local Setup

| Aspect | DevContainer | Local Setup |
|--------|--------------|-------------|
| Setup Time | 30 seconds | 5 minutes |
| Consistency | 100% identical | Varies by machine |
| Disk Space | ~2GB | ~500MB |
| RAM Usage | ~1GB extra | Normal |
| Portability | Works anywhere | Machine-specific |
| GitHub Codespaces | Yes | No |
| Offline Work | Requires Docker | Yes |

## Additional Resources

- [VS Code DevContainers Docs](https://code.visualstudio.com/docs/devcontainers/containers)
- [DevContainer Specification](https://containers.dev/)
- [GitHub Codespaces Docs](https://docs.github.com/codespaces)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Support

If you encounter issues with DevContainers:
1. Check this README for troubleshooting
2. Try the traditional local setup (see QUICK_START.md)
3. Open an issue in the repository
4. Consult VS Code DevContainer documentation

---

**Note**: The DevContainer is optional. The lab works equally well with traditional local setup. Choose the method that works best for your environment.
