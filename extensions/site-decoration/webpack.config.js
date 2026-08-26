const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const fs = require('fs');

const blocksDir = path.resolve(__dirname, 'blocks');
const entry = {};

fs.readdirSync(blocksDir).forEach((name) => {
    const candidate = path.join(blocksDir, name, 'src/index.tsx');
    if (fs.existsSync(candidate)) {
        entry[name] = candidate;
    }
});

module.exports = {
    ...defaultConfig,
    entry,
    output: {
        ...defaultConfig.output,
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/index.js',
        clean: false,
    },
};
