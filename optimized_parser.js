const fs = require('fs');

// Read the entire file
const filePath = '/Users/tanjim/Downloads/Vezran/DACSU/অমর একুশে হল.txt';
const content = fs.readFileSync(filePath, 'utf8');

// Split into lines and clean up
const lines = content.split('\n').map(line => line.trim().replace(/^\s*\d+→/, ''));

const allVoterData = [];
let currentDepartment = '';

// Helper function to clean Bengali text
function cleanText(text) {
    return text.replace(/^\s*:\s*/, '').replace(/^\s*/, '').replace(/\s*$/, '');
}

// Helper function to extract year and program from current program text
function parseCurrentProgram(programText) {
    const cleanProgram = cleanText(programText);
    
    // Extract year information
    let year = '';
    if (cleanProgram.includes('১ম বর্ষ') || cleanProgram.includes('১ম বষ')) {
        year = '১ম বর্ষ';
    } else if (cleanProgram.includes('২য় বর্ষ') || cleanProgram.includes('২য় বষ')) {
        year = '২য় বর্ষ';
    } else if (cleanProgram.includes('৩য় বর্ষ') || cleanProgram.includes('৩য় বষ')) {
        year = '৩য় বর্ষ';
    } else if (cleanProgram.includes('৪থ বর্ষ') || cleanProgram.includes('৪থ বষ')) {
        year = '৪থ বর্ষ';
    }
    
    // Extract program type
    let program = '';
    if (cleanProgram.includes('মাস্টার্স') || cleanProgram.includes('মাাস')) {
        program = 'মাস্টার্স';
    } else if (cleanProgram.includes('আন্ডারগ্রাজুয়েট') || cleanProgram.includes('আডারাজুেয়ট')) {
        program = 'আন্ডারগ্রাজুয়েট';
    }
    
    return { program, year };
}

// First pass: collect all voter numbers and their positions
const voterNumbers = [];
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect department header
    if (line.includes('িবভাগ') && line.includes('ভাটার সংখা')) {
        currentDepartment = line.split('(ভাটার সংখা')[0].trim();
        continue;
    }
    
    // Extract voter number
    if (line.includes('ভাটার নং') && line.includes(':')) {
        const voterNumber = cleanText(line.split(':')[1] || '');
        if (voterNumber && voterNumber.includes('এক-')) {
            voterNumbers.push({
                voterNumber: voterNumber,
                lineIndex: i,
                department: currentDepartment
            });
        }
    }
}

console.log(`Found ${voterNumbers.length} voter numbers`);

// Create arrays to collect all data types
const allNames = [];
const allSessions = [];
const allDepartments = [];
const allPrograms = [];

// Collect all data
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Collect names
    if (line.includes('নাম') && line.includes(':')) {
        const nameText = cleanText(line.split(':')[1] || '');
        if (nameText) {
            allNames.push({ text: nameText, lineIndex: i });
        }
    }
    
    // Collect registration sessions
    if (line.includes('রিজ') && line.includes('সশন') && line.includes(':')) {
        const sessionText = cleanText(line.split(':')[1] || '');
        if (sessionText) {
            allSessions.push({ text: sessionText, lineIndex: i });
        }
    }
    
    // Collect departments
    if (line.includes('িবভাগ') && line.includes(':')) {
        const deptText = cleanText(line.split(':')[1] || '');
        if (deptText) {
            allDepartments.push({ text: deptText, lineIndex: i });
        }
    }
    
    // Collect programs
    if (line.includes('বতমান') && line.includes('াাম') && line.includes(':')) {
        const programText = cleanText(line.split(':')[1] || '');
        if (programText) {
            allPrograms.push({ text: programText, lineIndex: i });
        }
    }
}

// Function to find closest data to a voter number
function findClosestData(voterLineIndex, dataArray, maxDistance = 50) {
    let closest = null;
    let minDistance = Infinity;
    
    for (const item of dataArray) {
        const distance = Math.abs(item.lineIndex - voterLineIndex);
        if (distance < minDistance && distance <= maxDistance) {
            minDistance = distance;
            closest = item;
        }
    }
    
    return closest;
}

// Process each voter number
for (let v = 0; v < voterNumbers.length; v++) {
    const voter = voterNumbers[v];
    
    let voterData = {
        serial: v + 1,
        voterNumber: voter.voterNumber,
        name: '',
        registrationSession: '',
        department: voter.department,
        currentProgram: '',
        year: ''
    };
    
    // Find closest name
    const closestName = findClosestData(voter.lineIndex, allNames);
    if (closestName) {
        voterData.name = closestName.text;
        
        // Check if name continues on the next line
        const nextLineIndex = closestName.lineIndex + 1;
        if (nextLineIndex < lines.length) {
            const nextLine = lines[nextLineIndex].trim();
            if (nextLine && !nextLine.includes(':') && !nextLine.includes('ভাটার') && 
                !nextLine.includes('রিজ') && !nextLine.includes('িবভাগ') && 
                !nextLine.includes('বতমান') && nextLine.length > 2) {
                voterData.name += ' ' + nextLine;
            }
        }
    }
    
    // Find closest registration session
    const closestSession = findClosestData(voter.lineIndex, allSessions);
    if (closestSession) {
        voterData.registrationSession = closestSession.text;
    }
    
    // Find closest department (override if found)
    const closestDept = findClosestData(voter.lineIndex, allDepartments);
    if (closestDept) {
        voterData.department = closestDept.text;
    }
    
    // Find closest program
    const closestProgram = findClosestData(voter.lineIndex, allPrograms);
    if (closestProgram) {
        const { program, year } = parseCurrentProgram(closestProgram.text);
        voterData.currentProgram = program;
        voterData.year = year;
    }
    
    // Fill in missing fields with defaults
    if (!voterData.name) voterData.name = 'তথ্য নেই';
    if (!voterData.registrationSession) voterData.registrationSession = 'তথ্য নেই';
    if (!voterData.department) voterData.department = 'তথ্য নেই';
    if (!voterData.currentProgram) voterData.currentProgram = 'তথ্য নেই';
    if (!voterData.year) voterData.year = 'তথ্য নেই';
    
    allVoterData.push(voterData);
}

// Generate the JavaScript array format
console.log('const allVoterData = [');
allVoterData.forEach((voter, index) => {
    const comma = index < allVoterData.length - 1 ? ',' : '';
    console.log(`    {serial: ${voter.serial}, voterNumber: "${voter.voterNumber}", name: "${voter.name}", registrationSession: "${voter.registrationSession}", department: "${voter.department}", currentProgram: "${voter.currentProgram}", year: "${voter.year}"}${comma}`);
});
console.log('];');

console.log(`\n// Total voters extracted: ${allVoterData.length}`);