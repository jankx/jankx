#!/bin/bash

# Define directories
THEME_ROOT=$(pwd)
RESOURCES_DIR="$THEME_ROOT/resources"
BLOCKS_DIR="$RESOURCES_DIR/blocks"

echo "Starting release cleanup..."

# 1. Process Blocks
if [ -d "$BLOCKS_DIR" ]; then
    echo "Processing blocks in $BLOCKS_DIR..."
    for block in "$BLOCKS_DIR"/*; do
        if [ -d "$block" ]; then
            block_name=$(basename "$block")
            echo "  Cleaning block: $block_name"
            # Delete everything inside block except block.json and build directory
            # Using find to select files/dirs to delete
            # -mindepth 1: Don't delete the block dir itself
            # -maxdepth 1: Only look at immediate children
            # ! -name 'block.json': Exclude block.json
            # ! -name 'build': Exclude build dir
            find "$block" -mindepth 1 -maxdepth 1 ! -name 'block.json' ! -name 'build' -exec rm -rf {} +
        fi
    done
else
    echo "Blocks directory not found at $BLOCKS_DIR"
fi

# 2. Delete node_modules
echo "Deleting node_modules..."
rm -rf "$THEME_ROOT/node_modules"
rm -rf "$RESOURCES_DIR/node_modules"

# 3. Delete .git in packages
# Searching in vendor directory for .git folders
if [ -d "$THEME_ROOT/vendor" ]; then
    echo "Deleting .git directories in vendor..."
    find "$THEME_ROOT/vendor" -type d -name ".git" -exec rm -rf {} +
fi

# 4. Delete test artifacts
echo "Deleting test artifacts..."
rm -rf "$THEME_ROOT/coverage"
rm -rf "$RESOURCES_DIR/coverage"
rm -f "$THEME_ROOT/.phpunit.result.cache"
rm -f "$RESOURCES_DIR/.phpunit.result.cache"
rm -rf "$THEME_ROOT/.phpunit.cache"
rm -rf "$RESOURCES_DIR/.phpunit.cache"

echo "Release cleanup complete!"
