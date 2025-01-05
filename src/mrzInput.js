const { validateType1MRZFields, extractType1MRZData } = require('./mrz/type1');
const { validateType3MRZFields, extractType3MRZData } = require('./mrz/type3');

const validateMRZInput = (inputs) => {
    const { firstRow, secondRow, thirdRow } = inputs;

    if (firstRow && secondRow && thirdRow) {
        if (firstRow.length === 30 && secondRow.length === 30 && thirdRow.length === 30) {
            validateType1MRZFields(inputs);
            return extractType1MRZData(inputs);
        } else {
            throw new Error(`For Type 1 documents, each row must be exactly 30 characters long.`);
        }
    } else if (firstRow && secondRow && !thirdRow) {
        if (firstRow.length === 44 && secondRow.length === 44) {
            validateType3MRZFields(inputs);
            return extractType3MRZData(inputs);
        } else {
            throw new Error(`For Type 3 documents, each row must be exactly 44 characters long.`);
        }
    } else {
        throw new Error(`Invalid MRZ input. Must provide either 2 lines of 44 characters each or 3 lines of 30 characters each.`);
    }
};

module.exports = validateMRZInput;
