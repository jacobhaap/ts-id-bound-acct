const validateType3MRZFields = (inputs) => {
    const errors = [];
    const alphaRegex = /^[A-Z]+$/;
    const alphaNumFillerRegex = /^[A-Z0-9<]+$/;
    const alphaFillerRegex = /^[A-Z<]+$/;
    const numericRegex = /^\d+$/;
    const numericFillerRegex = /^[\d<]+$/;

    const { firstRow, secondRow, pin } = inputs;

    if (!firstRow || !secondRow) {
        throw new Error('Both firstRow and secondRow must be provided');
    }

    if (firstRow.length !== 44 || secondRow.length !== 44) {
        throw new Error('First row and second row must each be exactly 44 characters long');
    }

    // Validate first row
    if (!alphaRegex.test(firstRow[0])) {
        errors.push('First row position 1 must be an alpha character indicating a passport');
    }
    if (!alphaFillerRegex.test(firstRow[1])) {
        errors.push('First row position 2 must be an alpha+< character indicating type of passport');
    }
    if (!alphaFillerRegex.test(firstRow.substring(2, 5))) {
        errors.push('First row positions 3-5 must be alpha+< characters indicating issuing country or organization');
    }
    if (!alphaFillerRegex.test(firstRow.substring(5))) {
        errors.push('First row positions 6-44 must be alpha+< characters indicating surname and given names');
    }

    // Extract and validate second row
    const passportNumber = secondRow.substring(0, 9);
    const passportNumberCheckDigit = secondRow[9];
    const nationality = secondRow.substring(10, 13);
    const birthDate = secondRow.substring(13, 19);
    const birthDateCheckDigit = secondRow[19];
    const sex = secondRow[20];
    const expirationDate = secondRow.substring(21, 27);
    const expirationDateCheckDigit = secondRow[27];
    const personalNumber = secondRow.substring(28, 42);
    const personalNumberCheckDigit = secondRow[42];
    const finalCheckDigit = secondRow[43];

    if (!alphaNumFillerRegex.test(passportNumber)) {
        errors.push('Second row positions 1-9 must be alpha+num+< characters indicating passport number');
    }
    if (!numericRegex.test(passportNumberCheckDigit)) {
        errors.push('Second row position 10 must be a numeric character indicating check digit for passport number');
    }
    if (!alphaFillerRegex.test(nationality)) {
        errors.push('Second row positions 11-13 must be alpha+< characters indicating nationality');
    }
    if (!numericRegex.test(birthDate)) {
        errors.push('Second row positions 14-19 must be numeric characters indicating date of birth (YYMMDD)');
    }
    if (!numericRegex.test(birthDateCheckDigit)) {
        errors.push('Second row position 20 must be a numeric character indicating check digit for date of birth');
    }
    if (!alphaFillerRegex.test(sex)) {
        errors.push('Second row position 21 must be an alpha+< character indicating sex (M, F, or <)');
    }
    if (!numericRegex.test(expirationDate)) {
        errors.push('Second row positions 22-27 must be numeric characters indicating expiration date (YYMMDD)');
    }
    if (!numericRegex.test(expirationDateCheckDigit)) {
        errors.push('Second row position 28 must be a numeric character indicating check digit for expiration date');
    }
    if (!alphaNumFillerRegex.test(personalNumber)) {
        errors.push('Second row positions 29-42 must be alpha+num+< characters indicating personal number');
    }
    if (!numericFillerRegex.test(personalNumberCheckDigit)) {
        errors.push('Second row position 43 must be a numeric+< character indicating check digit for personal number');
    }
    if (!numericRegex.test(finalCheckDigit)) {
        errors.push('Second row position 44 must be a numeric character indicating final check digit');
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

const extractType3MRZData = (inputs) => {
    const { firstRow, secondRow, pin } = inputs;

    const passportNumber = secondRow.substring(0, 9);
    const passportNumberCheckDigit = secondRow[9];
    const nationality = secondRow.substring(10, 13);
    const birthDate = secondRow.substring(13, 19);
    const birthDateCheckDigit = secondRow[19];
    const sex = secondRow[20];
    const expirationDate = secondRow.substring(21, 27);
    const expirationDateCheckDigit = secondRow[27];
    const personalNumber = secondRow.substring(28, 42);
    const personalNumberCheckDigit = secondRow[42];
    const finalCheckDigit = secondRow[43];

    return {
        passportType: removeFillers(firstRow[0]),
        type: removeFillers(firstRow[1]),
        issuingCountry: removeFillers(firstRow.substring(2, 5)),
        namePart: removeFillers(firstRow.substring(5)),
        passportNumber: removeFillers(passportNumber),
        passportNumberCheckDigit: removeFillers(passportNumberCheckDigit),
        nationality: removeFillers(nationality),
        birthDate: removeFillers(birthDate),
        birthDateCheckDigit: removeFillers(birthDateCheckDigit),
        sex: removeFillers(sex),
        expirationDate: removeFillers(expirationDate),
        expirationDateCheckDigit: removeFillers(expirationDateCheckDigit),
        personalNumber: removeFillers(personalNumber),
        personalNumberCheckDigit: removeFillers(personalNumberCheckDigit),
        finalCheckDigit: removeFillers(finalCheckDigit),
        pin: pin
    };
};

module.exports = { validateType3MRZFields, extractType3MRZData };
