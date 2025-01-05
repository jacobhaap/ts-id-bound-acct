const crypto = require('crypto');
const validateManualInput = require('./manualInput');
const validateMRZInput = require('./mrzInput');

function validateInput(input) {
    let validatedInput;

    // Check the type of input and validate accordingly
    if (input.firstRow && input.secondRow) {
        validatedInput = validateMRZInput(input);
    } else {
        validatedInput = validateManualInput(input);
    }

    // Destructure the pin from the validated input
    const { pin, ...inputData } = validatedInput;

    // Ensure at least one other input key-value pair is provided
    if (!pin) {
        throw new Error(`A 4 to 12-digit pin is required.`);
    } if (Object.keys(inputData).length === 0) {
        throw new Error('At least one key-value pair (and a pin) must be provided.');
    }

    const result = {
        pin: pin,
        input: inputData
    }

    return result;
}

function createHmacRng(secret, data, counter) {
    const hmac = crypto.createHmac('sha256', secret)
        .update(data)
        .update(counter.toString())
        .digest('hex');
    const intValue = parseInt(hmac.substring(0, 12), 16);
    return intValue / 0xffffffffffff;
}

function constructEntropySeed(pin, input) {
    // First RNG using pin and input to derive HMAC for each iteration
    // Get the keys of the input variables and shuffle them using the firstRng
    const inputBuffer = Buffer.from(Object.values(input).join(''), 'utf-8');
    const inputKeys = Object.keys(input).filter(key => input[key]);
    for (let i = inputKeys.length - 1; i > 0; i--) {
        const firstRng = createHmacRng(pin, inputBuffer, i);
        const j = Math.floor(firstRng * (i + 1));
        [inputKeys[i], inputKeys[j]] = [inputKeys[j], inputKeys[i]];
    }

    // Concatenate the shuffled variables into a single "pre-entropy seed" string
    const preEntropySeed = inputKeys.map(key => input[key]).join('') + pin;
    console.log(preEntropySeed);

    // Hash the pre-entropy seed with sha256 and convert to decimal
    const sha256Hash = crypto.createHash('sha256').update(preEntropySeed).digest('hex');
    const decimalRepresentation = BigInt('0x' + sha256Hash).toString();

    // Extract the first 6 digits as a checksum
    const checksum = decimalRepresentation.substring(0, 6);

    // Second RNG using checksum and pre-entropy seed to derive HMAC
    // Convert the pre-entropy seed string to an array of characters
    // Shuffle the array of characters using the secondRng
    const preEntropySeedBuffer = Buffer.from(preEntropySeed, 'utf-8');
    const entropyArray = preEntropySeed.split('');
    for (let i = entropyArray.length - 1; i > 0; i--) {
        const secondRng = createHmacRng(checksum, preEntropySeedBuffer, i);
        const j = Math.floor(secondRng * (i + 1));
        [entropyArray[i], entropyArray[j]] = [entropyArray[j], entropyArray[i]];
    }

    // Join the shuffled array back into a string and append the checksum
    const entropySeed = entropyArray.join('') + checksum;

    return entropySeed;
}

module.exports = { validateInput, constructEntropySeed };
