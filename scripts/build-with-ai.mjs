import { execSync } from 'child_process';

process.env.ENABLE_AI = 'true';
console.log('Building with AI enabled...');
execSync('npm run build', { stdio: 'inherit' });
