const validateType1MRZFields = (inputs) => {
    const errors = [];
    const alphaRegex = /^[A-Z]+$/;
    const alphaNumFillerRegex = /^[A-Z0-9<]+$/;
    const alphaFillerRegex = /^[A-Z<]+$/;
    const numericRegex = /^\d+$/;
    const numericFillerRegex = /^[\d<]+$/;

    const { firstRow, secondRow, thirdRow, pin } = inputs;

    if (!firstRow || !secondRow || !thirdRow) {
        throw new Error('All three rows (firstRow, secondRow, thirdRow) must be provided');
    }

    if (firstRow.length !== 30 || secondRow.length !== 30 || thirdRow.length !== 30) {
        throw new Error('Each row must be exactly 30 characters long');
    }

    // Validate first row
    if (!alphaRegex.test(firstRow[0])) {
        errors.push('First row position 1 must be an alpha character indicating a document type');
    }
    if (!alphaNumFillerRegex.test(firstRow[1])) {
        errors.push('First row position 2 must be an alpha+num+< character indicating type of document');
    }
    if (firstRow[1] === 'V') {
        errors.push('First row position 2 cannot be V');
    }
    if (!alphaFillerRegex.test(firstRow.substring(2, 5))) {
        errors.push('First row positions 3-5 must be alpha+< characters indicating issuing country or organization');
    }
    if (!alphaNumFillerRegex.test(firstRow.substring(5, 14))) {
        errors.push('First row positions 6-14 must be alpha+num+< characters indicating document number');
    }
    if (!numericFillerRegex.test(firstRow[14])) {
        errors.push('First row position 15 must be a numeric+< character indicating check digit for document number');
    }
    if (!alphaNumFillerRegex.test(firstRow.substring(15, 30))) {
        errors.push('First row positions 16-30 must be alpha+num+< characters indicating optional data');
    }

    // Validate second row
    if (!numericRegex.test(secondRow.substring(0, 6))) {
        errors.push('Second row positions 1-6 must be numeric characters indicating date of birth (YYMMDD)');
    }
    if (!numericRegex.test(secondRow[6])) {
        errors.push('Second row position 7 must be a numeric character indicating check digit for date of birth');
    }
    if (!alphaFillerRegex.test(secondRow[7])) {
        errors.push('Second row position 8 must be an alpha+< character indicating sex (M, F, or <)');
    }
    if (!numericRegex.test(secondRow.substring(8, 14))) {
        errors.push('Second row positions 9-14 must be numeric characters indicating expiration date (YYMMDD)');
    }
    if (!numericRegex.test(secondRow[14])) {
        errors.push('Second row position 15 must be a numeric character indicating check digit for expiration date');
    }
    if (!alphaFillerRegex.test(secondRow.substring(15, 18))) {
        errors.push('Second row positions 16-18 must be alpha+< characters indicating nationality');
    }
    if (!alphaNumFillerRegex.test(secondRow.substring(18, 29))) {
        errors.push('Second row positions 19-29 must be alpha+num+< characters indicating optional data');
    }
    if (!numericRegex.test(secondRow[29])) {
        errors.push('Second row position 30 must be a numeric character indicating final check digit');
    }

    // Validate third row
    if (!alphaFillerRegex.test(thirdRow.substring(0, 30))) {
        errors.push('Third row positions 1-30 must be alpha+< characters indicating surname and given names');
    }

    // Pin validation
    const pinRegex = /^\d{4,12}$/;
    if (!pinRegex.test(pin)) {
        errors.push('pin must be a numerical string between 4 and 12 digits');
    }

    if (errors.length > 0) {
        throw new Error(errors.join('; '));
    }
};

const removeFillers = (str) => str.replace(/</g, '').replace(/\s+/g, '');

const extractType1MRZData = (inputs) => {
    const { firstRow, secondRow, thirdRow, pin } = inputs;

    return {
        documentType: removeFillers(firstRow[0]),
        type: removeFillers(firstRow[1]),
        issuingCountry: removeFillers(firstRow.substring(2, 5)),
        documentNumber: removeFillers(firstRow.substring(5, 14)),
        documentNumberCheckDigit: removeFillers(firstRow[14]),
        optionalData1: removeFillers(firstRow.substring(15, 30)),
        birthDate: removeFillers(secondRow.substring(0, 6)),
        birthDateCheckDigit: removeFillers(secondRow[6]),
        sex: removeFillers(secondRow[7]),
        expirationDate: removeFillers(secondRow.substring(8, 14)),
        expirationDateCheckDigit: removeFillers(secondRow[14]),
        nationality: removeFillers(secondRow.substring(15, 18)),
        optionalData2: removeFillers(secondRow.substring(18, 29)),
        finalCheckDigit: removeFillers(secondRow[29]),
        surname: removeFillers(thirdRow.split('<<')[0]),
        givenNames: removeFillers(thirdRow.split('<<')[1]),
        pin: pin
    };
};

module.exports = { validateType1MRZFields, extractType1MRZData };
