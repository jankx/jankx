#!/bin/bash

# Icon Picker Block Build Script
echo "🚀 Building Icon Picker Block..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build production
echo "🔨 Building production assets..."
npm run build

# Check build result
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Built files are in the 'build' directory"
else
    echo "❌ Build failed!"
    exit 1
fi
