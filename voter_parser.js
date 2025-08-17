const fs = require('fs');

// Read the entire file
const filePath = '/Users/tanjim/Downloads/Vezran/DACSU/অমর একুশে হল.txt';
const content = fs.readFileSync(filePath, 'utf8');

// Split into lines and clean up
const lines = content.split('\n').map(line => line.trim().replace(/^\s*\d+→/, ''));

const allVoterData = [];
let currentDepartment = '';
let currentVoter = {};
let serial = 1;

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

// Process each line
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip empty lines and headers
    if (!line || line.includes('চূড়া ভাটার তািলকা') || line.includes('অমর এেশ হল') || 
        line.includes('ঢাকা িবিবদালয়') || line.includes('DUCSU') || 
        line.includes('ডাক ২০২৫') || line.includes('তিরর তািরখ') || 
        line.includes('মাট ভাটার সংখা') || line.includes('ভাটার তথ') ||
        line.includes('িচফ িরটািনং অিফসার') || line.includes('চলমান প ৃা')) {
        continue;
    }
    
    // Detect department header
    if (line.includes('িবভাগ (ভাটার সংখা')) {
        currentDepartment = line.split('(ভাটার সংখা')[0].trim();
        continue;
    }
    
    // Extract voter number
    if (line.startsWith('ভাটার নং :') || line.startsWith('ভাটার নং:')) {
        // Save previous voter if complete
        if (currentVoter.voterNumber && currentVoter.name) {
            currentVoter.serial = serial++;
            allVoterData.push({...currentVoter});
        }
        
        // Start new voter
        currentVoter = {
            voterNumber: cleanText(line.replace('ভাটার নং :', '').replace('ভাটার নং:', '')),
            department: currentDepartment
        };
    }
    
    // Extract name
    else if (line.startsWith('নাম:') || line.startsWith('নাম :')) {
        const nameText = cleanText(line.replace('নাম:', '').replace('নাম :', ''));
        if (nameText && currentVoter.voterNumber) {
            currentVoter.name = nameText;
        }
    }
    
    // Extract registration session
    else if (line.startsWith('রিজ. সশন:') || line.startsWith('রিজ. সশন :')) {
        const sessionText = cleanText(line.replace('রিজ. সশন:', '').replace('রিজ. সশন :', ''));
        if (sessionText && currentVoter.voterNumber) {
            currentVoter.registrationSession = sessionText;
        }
    }
    
    // Extract department (when it appears after voter number)
    else if (line.startsWith('িবভাগ:') || line.startsWith('িবভাগ :')) {
        const deptText = cleanText(line.replace('িবভাগ:', '').replace('িবভাগ :', ''));
        if (deptText && currentVoter.voterNumber) {
            currentVoter.department = deptText;
        }
    }
    
    // Extract current program
    else if (line.startsWith('বতমান াাম:') || line.startsWith('বতমান াাম :')) {
        const programText = cleanText(line.replace('বতমান াাম:', '').replace('বতমান াাম :', ''));
        if (programText && currentVoter.voterNumber) {
            const { program, year } = parseCurrentProgram(programText);
            currentVoter.currentProgram = program;
            currentVoter.year = year;
        }
    }
    
    // Handle names that appear without "নাম:" prefix (continuation from previous line)
    else if (line && !line.includes(':') && currentVoter.voterNumber && !currentVoter.name && 
             !line.includes('ভাটার') && !line.includes('রিজ') && !line.includes('িবভাগ') && 
             !line.includes('বতমান') && line.length > 3) {
        // Check if previous line was a name line
        if (i > 0 && lines[i-1].startsWith('নাম:')) {
            currentVoter.name = (currentVoter.name || '') + ' ' + line;
        }
        // Or if this looks like a standalone name
        else if (!currentVoter.name) {
            currentVoter.name = line;
        }
    }
}

// Add the last voter
if (currentVoter.voterNumber && currentVoter.name) {
    currentVoter.serial = serial++;
    allVoterData.push({...currentVoter});
}

// Fill in missing fields with defaults
allVoterData.forEach(voter => {
    if (!voter.registrationSession) voter.registrationSession = 'তথ্য নেই';
    if (!voter.department) voter.department = 'তথ্য নেই';
    if (!voter.currentProgram) voter.currentProgram = 'তথ্য নেই';
    if (!voter.year) voter.year = 'তথ্য নেই';
});

// Generate the JavaScript array format
console.log('const allVoterData = [');
allVoterData.forEach((voter, index) => {
    const comma = index < allVoterData.length - 1 ? ',' : '';
    console.log(`    {serial: ${voter.serial}, voterNumber: "${voter.voterNumber}", name: "${voter.name}", registrationSession: "${voter.registrationSession}", department: "${voter.department}", currentProgram: "${voter.currentProgram}", year: "${voter.year}"}${comma}`);
});
console.log('];');

console.log(`\n// Total voters extracted: ${allVoterData.length}`);