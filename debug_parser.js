const fs = require('fs');

// Read the entire file
const filePath = '/Users/tanjim/Downloads/Vezran/DACSU/অমর একুশে হল.txt';
const content = fs.readFileSync(filePath, 'utf8');

// Split into lines and check first 50 lines
const lines = content.split('\n');

console.log('Total lines:', lines.length);
console.log('\nFirst 50 lines after cleaning:');

for (let i = 0; i < Math.min(50, lines.length); i++) {
    const cleaned = lines[i].trim().replace(/^\s*\d+→/, '');
    console.log(`${i}: "${cleaned}"`);
}

// Look for voter number pattern
console.log('\nSearching for voter number patterns in first 200 lines:');
for (let i = 0; i < Math.min(200, lines.length); i++) {
    const line = lines[i].trim().replace(/^\s*\d+→/, '');
    if (line.includes('ভাটার নং')) {
        console.log(`Line ${i}: "${line}"`);
    }
}