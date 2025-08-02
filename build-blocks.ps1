# Build Gutenberg Blocks Script for Windows
Write-Host "🚀 Building Gutenberg Blocks..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Build widget-renderer block
Write-Host "🔨 Building widget-renderer block..." -ForegroundColor Yellow
npm run build:widget-renderer

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Widget renderer block built successfully!" -ForegroundColor Green
    Write-Host "📁 Build files created in: resources/blocks/widget-renderer/build/" -ForegroundColor Cyan
} else {
    Write-Host "❌ Failed to build widget-renderer block" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 All blocks built successfully!" -ForegroundColor Green
Write-Host "💡 You can now use the blocks in WordPress editor" -ForegroundColor Cyan