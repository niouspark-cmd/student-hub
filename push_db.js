
const { execSync } = require('child_process');
const fs = require('fs');

try {
    const envFile = fs.readFileSync('.env', 'utf8');
    const dbUrlLine = envFile.split('\n').find(line => line.startsWith('DATABASE_URL='));

    if (!dbUrlLine) {
        throw new Error('DATABASE_URL not found in .env');
    }

    // Correct extraction handling multiple = signs
    const dbUrl = dbUrlLine.substring('DATABASE_URL='.length).trim();

    console.log('Pushing schema with DB URL length:', dbUrl.length);

    process.env.DATABASE_URL = dbUrl;

    execSync('npx prisma db push', { stdio: 'inherit', env: process.env });
    console.log('Schema push successful');
} catch (error) {
    console.error('Schema push failed:', error);
    process.exit(1);
}
