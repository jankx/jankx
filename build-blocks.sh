#!/bin/bash

# Build Gutenberg Blocks Script
echo "🚀 Building Gutenberg Blocks..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build widget-renderer block
echo "🔨 Building widget-renderer block..."
npm run build:widget-renderer

if [ $? -eq 0 ]; then
    echo "✅ Widget renderer block built successfully!"
    echo "📁 Build files created in: resources/blocks/widget-renderer/build/"
else
    echo "❌ Failed to build widget-renderer block"
    exit 1
fi

echo "🎉 All blocks built successfully!"
echo "💡 You can now use the blocks in WordPress editor"