const fs = require('fs');
const path = require('path');

const targets = [
    'app',
    'components',
    'hooks',
    'navigation',
    'scripts',
    'tsconfig.json',
    'expo-env.d.ts',
    'cleanup.js'
];

targets.forEach(target => {
    const fullPath = path.join(__dirname, target);
    try {
        if (fs.existsSync(fullPath)) {
            fs.rmSync(fullPath, { recursive: true, force: true });
            console.log(`Successfully deleted: ${target}`);
        } else {
            console.log(`Target not found: ${target}`);
        }
    } catch (err) {
        console.error(`Error deleting ${target}: ${err.message}`);
    }
});
