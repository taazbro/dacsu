const fs = require('fs');
const path = require('path');

// Directory containing portrait SVG files
const portraitDir = '/Users/tanjim/Downloads/Vezran/DACSU';

// Function to read first 50 portrait SVG files for demo
function extractDemoPortraitSVGs() {
    const embeddedPortraits = {};
    
    try {
        // Get all files in the directory
        const files = fs.readdirSync(portraitDir);
        
        // Filter for portrait SVG files and sort them
        const portraitFiles = files
            .filter(file => file.startsWith('portrait_') && file.endsWith('.svg'))
            .sort((a, b) => {
                const numA = parseInt(a.match(/portrait_(\d+)\.svg/)[1], 10);
                const numB = parseInt(b.match(/portrait_(\d+)\.svg/)[1], 10);
                return numA - numB;
            })
            .slice(0, 50); // Take only first 50 for demo
        
        console.log(`Processing ${portraitFiles.length} portrait files for demo`);
        
        portraitFiles.forEach((filename, index) => {
            try {
                const filePath = path.join(portraitDir, filename);
                const svgContent = fs.readFileSync(filePath, 'utf8');
                
                // Extract the number from filename
                const match = filename.match(/portrait_(\d+)\.svg/);
                if (match) {
                    const serialNumber = parseInt(match[1], 10);
                    
                    // Create voter number in Bengali format
                    const paddedSerial = String(serialNumber).padStart(5, '0');
                    const voterNumber = `এক-${paddedSerial}`;
                    
                    // Clean SVG content
                    const cleanSVG = svgContent.trim();
                    
                    // Add to embedded portraits with both formats
                    embeddedPortraits[voterNumber] = cleanSVG;
                    embeddedPortraits[`portrait_${serialNumber}`] = cleanSVG;
                    
                    console.log(`Processed: ${filename} -> ${voterNumber}`);
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

// Function to generate the JavaScript code for demo embedding
function generateDemoEmbeddedPortraitsCode() {
    const portraits = extractDemoPortraitSVGs();
    const portraitCount = Object.keys(portraits).length;
    
    console.log(`\nTotal demo portraits extracted: ${portraitCount}`);
    
    // Create the JavaScript code with instructions
    let jsCode = '        // Embedded SVG portraits data - Demo with first 50 portraits\n';
    jsCode += '        // To add all 1291 portraits, replace this with the full generated code\n';
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
    
    jsCode += '            // Add remaining 1241 portraits here...\n';
    jsCode += '            // Use the extract_svg_portraits.js script to generate all entries\n';
    jsCode += '        };';
    
    return jsCode;
}

// Generate and save the demo code
try {
    const embeddedCode = generateDemoEmbeddedPortraitsCode();
    
    // Save to file
    fs.writeFileSync(path.join(portraitDir, 'demo_embedded_portraits.js'), embeddedCode);
    
    console.log('\nGenerated demo embedded portraits code saved to: demo_embedded_portraits.js');
    console.log('This demonstrates the embedded SVG system with the first 50 portraits.');
    
} catch (error) {
    console.error('Error generating demo embedded code:', error.message);
}