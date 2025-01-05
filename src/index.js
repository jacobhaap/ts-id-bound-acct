const { validateInput, constructEntropySeed } = require('./entropySeed');
const { constructEntropy, generateMnemonic } = require('./mnemonic');

function idBoundAcct() {
    throw new Error(`Function 'idBoundAcct' requires a method.`);
};

idBoundAcct = {
    create: function(input, phraseLength, chain) {
        if (!input) {
            throw new Error(`Parameter 'input' is required.`);
        } if (!phraseLength) {
            throw new Error(`Parameter 'phraseLength' is required.`);
        } if (!chain) {
            throw new Error(`Parameter 'chain' is required.`);
        }

        const validatedInput = validateInput(input);
        const entropySeed = constructEntropySeed(validatedInput.pin, validatedInput.input);
        const entropy = constructEntropy(entropySeed, chain);
        const mnemonic = generateMnemonic(entropy, phraseLength);
        return mnemonic;
    },
    validate: function(input) {
        if (!input) {
            throw new Error(`Parameter 'input' is required.`);
        }

        const result = validateInput(input);
        if (result) {
            return true;
        } if (!result) {
            return false;
        }
    },
    entropySeed: function(input) {
        if (!input) {
            throw new Error(`Parameter 'input' is required.`);
        }

        const validatedInput = validateInput(input);
        const entropySeed = constructEntropySeed(validatedInput.pin, validatedInput.input);
        return entropySeed;
    },
    entropy: function(entropySeed, chain) {
        if (!entropySeed) {
            throw new Error(`Parameter 'entropySeed' is required.`)
        } if (!chain) {
            throw new Error(`Parameter 'chain' is required.`);
        }

        const entropy = constructEntropy(entropySeed, chain);
        return entropy;
    },
    mnemonic: function(entropy, phraseLength) {
        if (!entropy) {
            throw new Error(`Parameter 'entropy' is required.`);
        } if (!phraseLength) {
            throw new Error(`Parameter 'phraseLength' is required.`);
        }

        const mnemonic = generateMnemonic(entropy, phraseLength);
        return mnemonic;
    }
}

module.exports = idBoundAcct;
