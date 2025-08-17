const fs = require('fs');
const path = require('path');

// Directory containing portrait SVG files
const portraitDir = '/Users/tanjim/Downloads/Vezran/DACSU';

// Function to read all portrait SVG files and create the embedded portraits object
function extractPortraitSVGs() {
    const embeddedPortraits = {};
    
    try {
        // Get all files in the directory
        const files = fs.readdirSync(portraitDir);
        
        // Filter for portrait SVG files
        const portraitFiles = files.filter(file => 
            file.startsWith('portrait_') && file.endsWith('.svg')
        );
        
        console.log(`Found ${portraitFiles.length} portrait files`);
        
        portraitFiles.forEach((filename, index) => {
            try {
                const filePath = path.join(portraitDir, filename);
                const svgContent = fs.readFileSync(filePath, 'utf8');
                
                // Extract the number from filename (e.g., portrait_0001.svg -> 1)
                const match = filename.match(/portrait_(\d+)\.svg/);
                if (match) {
                    const serialNumber = parseInt(match[1], 10);
                    
                    // Create voter number in Bengali format (এক-০০০০১)
                    const paddedSerial = String(serialNumber).padStart(5, '0');
                    const voterNumber = `এক-${paddedSerial}`;
                    
                    // Clean SVG content (remove any extra whitespace/newlines)
                    const cleanSVG = svgContent.trim();
                    
                    // Add to embedded portraits with both formats
                    embeddedPortraits[voterNumber] = cleanSVG;
                    embeddedPortraits[`portrait_${serialNumber}`] = cleanSVG;
                    
                    if (index < 10) {
                        console.log(`Processed: ${filename} -> ${voterNumber}`);
                    }
                }
            } catch (error) {
                console.error(`Error processing ${filename}:`, error.message);
            }
        });
        
        return embeddedPortraits;
    } catch (error) {
        console.error('Error reading directory:', error.message);
        return {};
    }
}

// Function to generate the JavaScript code for embedding
function generateEmbeddedPortraitsCode() {
    const portraits = extractPortraitSVGs();
    const portraitCount = Object.keys(portraits).length;
    
    console.log(`\nTotal portraits extracted: ${portraitCount}`);
    
    // Create the JavaScript code
    let jsCode = '        // Embedded SVG portraits data - Generated automatically\n';
    jsCode += '        const embeddedPortraits = {\n';
    
    const entries = Object.entries(portraits);
    entries.forEach(([key, svgContent], index) => {
        // Escape the SVG content for JavaScript string
        const escapedSVG = svgContent
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\${/g, '\\${');
        
        jsCode += `            "${key}": \`${escapedSVG}\``;
        
        if (index < entries.length - 1) {
            jsCode += ',';
        }
        jsCode += '\n';
    });
    
    jsCode += '        };';
    
    return jsCode;
}

// Generate and save the code
try {
    const embeddedCode = generateEmbeddedPortraitsCode();
    
    // Save to file for inspection
    fs.writeFileSync(path.join(portraitDir, 'embedded_portraits_code.js'), embeddedCode);
    
    console.log('\nGenerated embedded portraits code saved to: embedded_portraits_code.js');
    console.log('This code can now be inserted into the HTML file.');
    
} catch (error) {
    console.error('Error generating embedded code:', error.message);
}