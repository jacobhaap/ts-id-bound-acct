const keccak = require('keccak');
const crypto = require('crypto');
const sha512 = require('js-sha512');
const bip39 = require('@scure/bip39');
const { wordlist } = require('@scure/bip39/wordlists/english');

function generateSeed(entropyBits, seedLength, chain) {
    const entropyLength = seedLength === 12 ? 128 : seedLength === 18 ? 192 : 248;
    const checksumBitsLength = seedLength === 12 ? 4 : seedLength === 18 ? 6 : 8;
    
    // Truncate entropy to the specified bits
    const truncatedEntropy = entropyBits.slice(0, entropyLength);

    // Create hash of the truncated entropy based on the chain type
    let hash;
    if (chain === 'ETH') {
        hash = keccak('keccak256').update(truncatedEntropy, 'binary').digest('hex');
    } else if (chain === 'BTC') {
        hash = crypto.createHash('sha256').update(truncatedEntropy, 'binary').digest('hex');
    } else if (chain === 'SOL') {
        hash = sha512.create().update(truncatedEntropy, 'binary').hex();
    } else {
        return;
    }

    // Convert the hash to binary and extract the required bits for checksum
    const binaryHash = hexToBinary(hash);
    const checksumBits = binaryHash.slice(0, checksumBitsLength);

    // Concatenate the truncated entropy and checksum bits
    const seedEC = truncatedEntropy + checksumBits;

    // Divide into segments based on mnemonic length
    const segments = splitBits(seedEC, seedLength);

    // Convert segments to entropy bytes
    const entropyBytes = segmentsToBytes(segments);

    // Convert segments to words using bip39
    const seedPhrase = bip39.entropyToMnemonic(entropyBytes, wordlist);

    // Validate the mnemonic
    if (!bip39.validateMnemonic(seedPhrase, wordlist)) {
        throw new Error(`Invalid mnemonic generated for seed${seedLength}`);
    }

    return seedPhrase;
}

function hexToBinary(hex) {
    return hex.split('').map(hexChar => {
        const binary = parseInt(hexChar, 16).toString(2);
        return binary.padStart(4, '0');
    }).join('');
}

function splitBits(bits, numSegments) {
    const segmentSize = bits.length / numSegments;
    const segments = [];
    for (let i = 0; i < numSegments; i++) {
        segments.push(bits.slice(i * segmentSize, (i + 1) * segmentSize));
    }
    return segments;
}

function segmentsToBytes(segments) {
    const bytes = [];
    let byte = '';
    for (const segment of segments) {
        byte += segment;
        while (byte.length >= 8) {
            bytes.push(parseInt(byte.slice(0, 8), 2));
            byte = byte.slice(8);
        }
    }
    return new Uint8Array(bytes);
}

module.exports = {
    generateSeed
};
