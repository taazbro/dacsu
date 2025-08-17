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

// First pass: collect all voter numbers and their positions using more robust pattern matching
const voterNumbers = [];
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect department header using more flexible pattern
    if (line.includes('িবভাগ') && line.includes('ভাটার সংখা')) {
        currentDepartment = line.split('(ভাটার সংখা')[0].trim();
        continue;
    }
    
    // Extract voter number using more flexible pattern
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

// Second pass: for each voter number, collect associated information
for (let v = 0; v < voterNumbers.length; v++) {
    const voter = voterNumbers[v];
    const startLine = voter.lineIndex;
    
    let voterData = {
        serial: v + 1,
        voterNumber: voter.voterNumber,
        name: '',
        registrationSession: '',
        department: voter.department,
        currentProgram: '',
        year: ''
    };
    
    // Look for information in the range around this voter number
    // Search in a reasonable range around the voter number
    const searchStart = Math.max(0, startLine - 30);
    const searchEnd = Math.min(lines.length, startLine + 30);
    
    for (let i = searchStart; i < searchEnd; i++) {
        const line = lines[i];
        
        // Extract name using flexible pattern
        if (line.includes('নাম') && line.includes(':')) {
            const nameText = cleanText(line.split(':')[1] || '');
            if (nameText && !voterData.name) {
                voterData.name = nameText;
                
                // Check if name continues on next line
                if (i + 1 < lines.length && lines[i + 1] && 
                    !lines[i + 1].includes(':') && !lines[i + 1].includes('ভাটার') && 
                    lines[i + 1].length > 2) {
                    const nextLine = lines[i + 1].trim();
                    if (nextLine && !nextLine.includes('রিজ') && !nextLine.includes('িবভাগ') && 
                        !nextLine.includes('বতমান')) {
                        voterData.name += ' ' + nextLine;
                    }
                }
            }
        }
        
        // Extract registration session using flexible pattern
        else if (line.includes('রিজ') && line.includes('সশন') && line.includes(':')) {
            const sessionText = cleanText(line.split(':')[1] || '');
            if (sessionText && !voterData.registrationSession) {
                voterData.registrationSession = sessionText;
            }
        }
        
        // Extract department using flexible pattern
        else if (line.includes('িবভাগ') && line.includes(':')) {
            const deptText = cleanText(line.split(':')[1] || '');
            if (deptText) {
                voterData.department = deptText;
            }
        }
        
        // Extract current program using flexible pattern
        else if (line.includes('বতমান') && line.includes('াাম') && line.includes(':')) {
            const programText = cleanText(line.split(':')[1] || '');
            if (programText && !voterData.currentProgram) {
                const { program, year } = parseCurrentProgram(programText);
                voterData.currentProgram = program;
                voterData.year = year;
            }
        }
    }
    
    // If still no name found, look for standalone names near the voter number
    if (!voterData.name) {
        for (let i = startLine + 1; i < Math.min(searchEnd, startLine + 15); i++) {
            const line = lines[i];
            if (line && !line.includes(':') && !line.includes('ভাটার') && 
                !line.includes('রিজ') && !line.includes('িবভাগ') && 
                !line.includes('বতমান') && line.length > 3) {
                voterData.name = line;
                break;
            }
        }
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