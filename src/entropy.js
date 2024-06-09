const keccak = require('keccak');
const crypto = require('crypto');
const sha512 = require('js-sha512');
const seedrandom = require('seedrandom');
const validateManualInput = require('./manualInput');
const validateMRZInput = require('./mrzInput');

function generateEntropy(inputs, chain) {
    let validatedInputs;

    // Check the type of input and validate accordingly
    if (inputs.firstRow && inputs.secondRow) {
        validatedInputs = validateMRZInput(inputs);
    } else {
        validatedInputs = validateManualInput(inputs);
    }

    // Destructure the pin from the validated inputs
    const { pin, ...otherInputs } = validatedInputs;

    // Ensure at least one other input variable is provided
    if (Object.keys(otherInputs).length === 0) {
        throw new Error('At least one variable (paired with pin) must be provided');
    }

    // Create a seeded pseudorandom number generator
    const firstRng = seedrandom(pin);

    // Get the keys of the input variables and shuffle them using the PRNG
    const inputKeys = Object.keys(otherInputs).filter(key => otherInputs[key]);
    for (let i = inputKeys.length - 1; i > 0; i--) {
        const j = Math.floor(firstRng() * (i + 1));
        [inputKeys[i], inputKeys[j]] = [inputKeys[j], inputKeys[i]];
    }

    // Concatenate the shuffled variables into a single "entropy seed" string
    let preEntropySeed = inputKeys.map(key => otherInputs[key]).join('') + pin;

    // Hash the entropy seed with sha256 and convert to decimal
    const sha256Hash = crypto.createHash('sha256').update(preEntropySeed).digest('hex');
    const decimalRepresentation = BigInt('0x' + sha256Hash).toString();

    // Extract the first 6 digits for the second RNG
    const checksum = decimalRepresentation.substring(0, 6);

    // Create a new seeded RNG with the checksum
    const secondRng = seedrandom(checksum);

    // Convert the entropy seed string to an array of characters
    const entropyArray = preEntropySeed.split('');

    // Shuffle the array of characters using the second RNG
    for (let i = entropyArray.length - 1; i > 0; i--) {
        const j = Math.floor(secondRng() * (i + 1));
        [entropyArray[i], entropyArray[j]] = [entropyArray[j], entropyArray[i]];
    }

    // Join the shuffled array back into a string and append the checksum
    entropySeed = entropyArray.join('') + checksum;

    // Hash the final entropy seed based on the chain type
    let hash;
    if (chain === 'ETH') {
        hash = keccak('keccak256').update(entropySeed).digest('hex');
    } else if (chain === 'BTC') {
        hash = crypto.createHash('sha256').update(entropySeed).digest('hex');
    } else if (chain === 'SOL') {
        hash = sha512.create().update(entropySeed).hex();
    } else {
        throw new Error('Invalid chain, available options: ETH, BTC, SOL');
    }

    // Convert the hash to bits
    const bits = hexToBinary(hash);

    return { preEntropySeed, entropySeed, bits };
}

function hexToBinary(hex) {
    return hex.split('').map(hexChar => {
        const binary = parseInt(hexChar, 16).toString(2);
        return binary.padStart(4, '0');
    }).join('');
}

module.exports = generateEntropy;
