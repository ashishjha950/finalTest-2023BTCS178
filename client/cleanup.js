const fs = require('fs');
const path = require('path');

const targets = [
    'app',
    'navigation',
    'components',
    'hooks',
    'constants',
    'scripts',
    'tsconfig.json',
    'expo-env.d.ts',
    'screens/DetailsScreen.jsx',
    'screens/HomeScreen.jsx',
    'screens/SettingsScreen.jsx'
];

targets.forEach(target => {
    const fullPath = path.join(__dirname, target);
    try {
        if (fs.existsSync(fullPath)) {
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                fs.rmSync(fullPath, { recursive: true, force: true });
                console.log(`Deleted directory: ${target}`);
            } else {
                fs.unlinkSync(fullPath);
                console.log(`Deleted file: ${target}`);
            }
        } else {
            console.log(`Target does not exist: ${target}`);
        }
    } catch (error) {
        console.error(`Failed to delete ${target}: ${error.message}`);
    }
});
