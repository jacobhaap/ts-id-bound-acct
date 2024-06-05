const crypto = require('crypto');

function generateEntropy(DOB, docNum, DOE, pin) {
    // Concatenate the variables into a single string
    const concatenatedString = `${DOB}${docNum}${DOE}${pin}`;
    
    // Hash the concatenated string with SHA-256
    const hash = crypto.createHash('sha256').update(concatenatedString).digest('hex');
    
    // Convert the hash to bits
    const bits = hexToBinary(hash);

    return bits;
}

function hexToBinary(hex) {
    return hex.split('').map(hexChar => {
        const binary = parseInt(hexChar, 16).toString(2);
        return binary.padStart(4, '0');
    }).join('');
}

module.exports = generateEntropy;
