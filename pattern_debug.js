const fs = require('fs');

// Read the entire file
const filePath = '/Users/tanjim/Downloads/Vezran/DACSU/অমর একুশে হল.txt';
const content = fs.readFileSync(filePath, 'utf8');

// Split into lines and clean up
const lines = content.split('\n').map(line => line.trim().replace(/^\s*\d+→/, ''));

console.log('Searching for lines containing "ভাটার নং":');
let count = 0;
for (let i = 0; i < Math.min(300, lines.length); i++) {
    const line = lines[i];
    if (line.includes('ভাটার নং')) {
        console.log(`Line ${i}: "${line}"`);
        console.log(`Starts with "ভাটার নং :": ${line.startsWith('ভাটার নং :')}`);
        console.log(`Starts with "ভাটার নং:": ${line.startsWith('ভাটার নং:')}`);
        console.log(`Characters: ${Array.from(line).map(c => c.charCodeAt(0)).join(', ')}`);
        console.log('---');
        count++;
        if (count > 5) break;
    }
}