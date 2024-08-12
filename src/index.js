const generateEntropy = require('./entropy');
const { seededMnemonic } = require('seeded-mnemonic');

function generateIdentityBoundAccount(inputData, seedLength, chain, options = {}) {
    const { returnEntropySeed = false, returnBits = false } = options;
    try {
        const result = generateEntropy(inputData);

        let mnemonicResult;
        switch (seedLength) {
            case 12:
            case 18:
            case 24:
                mnemonicResult = seededMnemonic.string(
                    result.entropySeed,
                    seedLength,
                    chain,
                    returnBits ? { returnBits: true } : {}
                );
                break;
            default:
                throw new Error('Invalid seed length. Must be 12, 18, or 24.');
        }

        // Ensure seedPhrase is always included in the response
        const response = {
            seedPhrase: mnemonicResult.seedPhrase,
        };

        if (returnEntropySeed) {
            response.entropySeed = result.entropySeed;
        }

        if (returnBits) {
            response.bits = mnemonicResult.bits;
        }

        return response;

    } catch (error) {
        throw error;
    }
}

module.exports = { generateIdentityBoundAccount };
