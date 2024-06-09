const generateEntropy = require('./entropy');
const { generateSeed } = require('./seed');

function generateIdentityBoundAccount(inputData, seedLength, chain, options = {}) {
    const { returnEntropySeed = false, returnBits = false } = options;
    try {
        const result = generateEntropy(inputData, chain);
        
        let seedPhrase;
        switch (seedLength) {
            case 12:
            case 18:
            case 24:
                seedPhrase = generateSeed(result.bits, seedLength, chain);
                break;
            default:
                throw new Error('Invalid seed length. Must be 12, 18, or 24.');
        }

        const response = {
            seedPhrase
        };

        if (returnEntropySeed) {
            response.entropySeed = result.entropySeed;
            response.preEntropySeed = result.preEntropySeed;
        }

        if (returnBits) {
            response.bits = result.bits;
        }

        return response;

    } catch (error) {
        throw error;
    }
}

module.exports = { generateIdentityBoundAccount };
