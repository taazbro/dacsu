const fs = require('fs');
const path = require('path');

// Read first 10 portrait SVG files and create sample embedded code
function createSampleEmbedded() {
    const portraitDir = '/Users/tanjim/Downloads/Vezran/DACSU';
    const samplePortraits = {};
    
    // Process first 10 portraits
    for (let i = 1; i <= 10; i++) {
        const filename = `portrait_${String(i).padStart(4, '0')}.svg`;
        const filePath = path.join(portraitDir, filename);
        
        try {
            if (fs.existsSync(filePath)) {
                const svgContent = fs.readFileSync(filePath, 'utf8').trim();
                const voterNumber = `এক-${String(i).padStart(5, '0')}`;
                
                // Escape for JavaScript
                const escapedSVG = svgContent
                    .replace(/\\/g, '\\\\')
                    .replace(/`/g, '\\`')
                    .replace(/\${/g, '\\${');
                
                samplePortraits[voterNumber] = escapedSVG;
                samplePortraits[`portrait_${i}`] = escapedSVG;
            }
        } catch (error) {
            console.error(`Error processing ${filename}:`, error.message);
        }
    }
    
    // Generate the embedded code
    let jsCode = '        // Embedded SVG portraits data - Sample with first 10 real portraits\n';
    jsCode += '        // Replace this with full data using extract_svg_portraits.js for all 1291 portraits\n';
    jsCode += '        const embeddedPortraits = {\n';
    
    const entries = Object.entries(samplePortraits);
    entries.forEach(([key, svgContent], index) => {
        jsCode += `            "${key}": \`${svgContent}\``;
        if (index < entries.length - 1) {
            jsCode += ',';
        }
        jsCode += '\n';
    });
    
    jsCode += '            // TODO: Add remaining 1281 portraits here\n';
    jsCode += '            // Use: node extract_svg_portraits.js to generate all entries\n';
    jsCode += '        };';
    
    return jsCode;
}

try {
    const sampleCode = createSampleEmbedded();
    fs.writeFileSync('/Users/tanjim/Downloads/Vezran/DACSU/sample_embedded.js', sampleCode);
    console.log('Sample embedded code created successfully!');
    console.log('Contains first 10 real portrait SVGs for demonstration.');
} catch (error) {
    console.error('Error creating sample:', error.message);
}