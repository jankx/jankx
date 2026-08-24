const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const fs = require('fs');

// Discover all block entry points (blocks/<name>/src/index.tsx)
const blocksDir = path.resolve(__dirname, 'blocks');
const entryPoints = {};

if (fs.existsSync(blocksDir)) {
    fs.readdirSync(blocksDir).forEach((file) => {
        const blockPath = path.join(blocksDir, file);
        if (fs.statSync(blockPath).isDirectory()) {
            const candidates = [
                path.join(blockPath, 'src/index.tsx'),
                path.join(blockPath, 'src/index.ts'),
                path.join(blockPath, 'src/index.js'),
            ];
            for (const candidate of candidates) {
                if (fs.existsSync(candidate)) {
                    entryPoints[file] = candidate;
                    break;
                }
            }
        }
    });
}

module.exports = {
    ...defaultConfig,
    entry: entryPoints,
    output: {
        ...defaultConfig.output,
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/index.js',
        clean: false,
    },
};
