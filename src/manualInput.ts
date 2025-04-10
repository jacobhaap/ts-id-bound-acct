/**
 * @fileoverview Provides a function to validate and extract manual input of an identity document.
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

/** Type for an object containing manual input from an identity document. */
export type IdentityDoc = {
    names: string,          // Given Names
    surname?: string,       // Surname
    birthDate?: string,     // Date of Birth
    expireDate?: string,    // Date of Expiration
    issueDate?: string,     // Date of Issue
    nationality?: string,   // Nationality
    sex?: string,           // Sex
    birthplace?: string,    // Birthplace
    origin?: string,        // Place of Origin
    authority?: string,     // Document Authority
    eyeColor?: string,      // Eye Color
    hairColor?: string,     // Hair Color
    motherNames?: string,   // Mother's Given Names
    motherSurname?: string, // Mother's Surname
    fatherNames?: string,   // Father's Given Names
    fatherSurname?: string, // Father's Surname
    height?: string,        // Height
    weight?: string,        // Weight
    docNum?: string,        // Document Number
    address?: string,       // Address
    misc1?: string,         // Miscellaneous 1
    misc2?: string,         // Miscellaneous 2
    misc3?: string          // Miscellaneous 3
}

/**
 * Validates all defined properties of an {@link IdentityDoc} object for the manual input of an identity
 * document, then constructs an array of all elements based on a predefined order, if validation passes.
 * @example
 * const input: IdentityDoc = {
 *     docNum: "L01X00T47", names: "ERIKA",
 *     birthDate: "12081983", surname: "MUSTERMANN",
 * }
 * const identity = validateManual(input); // [ "ERIKA", "MUSTERMANN", "12081983", "L01X00T47" ]
 */
export function validateManual(input: IdentityDoc): string[] {
    const errors: string[] = []; // Array to collect errors
    const dateRegex: RegExp = /^\d{2}\d{2}\d{4}$/; // Regex for DDMMYYYY dates
    const latinRegex: RegExp = /^[A-Za-z]+$/; // Regex for Latin characters
    const numericRegex: RegExp = /^\d+$/; // Regex for Numeric
    const alphanumericRegex: RegExp = /^[A-Za-z0-9]+$/; // Regex for Alphanumeric

    // Define an order that elements in an array parsed from an 'IdentityDoc' object should follow
    const elementsOrder: (keyof IdentityDoc)[] = [
        'names', 'surname', 'birthDate', 'expireDate', 'issueDate', 'nationality',
        'sex', 'birthplace', 'origin', 'authority', 'eyeColor', 'hairColor', 
        'motherNames', 'motherSurname', 'fatherNames', 'fatherSurname', 
        'height', 'weight', 'docNum', 'address', 'misc1', 'misc2', 'misc3'
    ]

    // Date validation function
    // If date validation fails, push an error to the 'errors' array
    function validateDate(date: string, fieldName: string): boolean {
        if (date && !dateRegex.test(date)) {
            errors.push(`${fieldName} must be in the format DDMMYYYY`);
        } else {
            const day = parseInt(date.slice(0, 2), 10); // Isolate day from date
            const month = parseInt(date.slice(2, 4), 10); // Isolate month from date
            if (day < 1 || day > 31) errors.push(`${fieldName} day must be between 01 and 31`);
            if (month < 1 || month > 12) errors.push(`${fieldName} month must be between 01 and 12`);
            return true;
        }
        return false;
    }

    // Latin character validation function
    // If Latin character validation fails, push an error to the 'errors' array
    function validateLatin(str: string, fieldName: string): boolean {
        if (str && !latinRegex.test(str)) {
            errors.push(`${fieldName} must only contain Latin characters`);
            return false;
        }
        return true;
    }

    // Numeric validation function
    // If numeric validation fails, push an error to the 'errors' array
    function validateNumeric(num: string, fieldName: string): boolean {
        if (num && !numericRegex.test(num)) {
            errors.push(`${fieldName} must only contain numbers`);
            return false;
        }
        return true;
    }

    // Alphanumeric validation function
    // If alphanumeric validation fails, push an error to the 'errors' array
    function validateAlphanumeric(str: string, fieldName: string): boolean {
        if (str && !alphanumericRegex.test(str)) {
            errors.push(`${fieldName} must be a non-empty alphanumeric string`);
            return false;
        }
        return true;
    }

    // Validation of date formats
    if (input.birthDate) validateDate(input.birthDate, 'birthDate');
    if (input.expireDate) validateDate(input.expireDate, 'expireDate');
    if (input.issueDate) validateDate(input.issueDate, 'issueDate');

    // Validation of Latin input
    if (input.names) validateLatin(input.names, 'name');
    if (input.surname) validateLatin(input.surname, 'surname');
    if (input.nationality) validateLatin(input.nationality, 'nationality');
    if (input.sex) validateLatin(input.sex, 'sex');
    if (input.birthplace) validateLatin(input.birthplace, 'birthplace');
    if (input.origin) validateLatin(input.origin, 'origin');
    if (input.authority) validateLatin(input.authority, 'authority');
    if (input.eyeColor) validateLatin(input.eyeColor, 'eyeColor');
    if (input.hairColor) validateLatin(input.hairColor, 'hairColor');
    if (input.motherNames) validateLatin(input.motherNames, 'motherNames');
    if (input.motherSurname) validateLatin(input.motherSurname, 'motherSurname');
    if (input.fatherNames) validateLatin(input.fatherNames, 'fatherNames');
    if (input.fatherSurname) validateLatin(input.fatherSurname, 'fatherSurname');

    // Validation of numeric input
    if (input.height) validateNumeric(input.height, 'height');
    if (input.weight) validateNumeric(input.weight, 'weight');

    // Validation of alphanumeric input
    if (input.docNum) validateAlphanumeric(input.docNum, 'docNum');
    if (input.address) validateAlphanumeric(input.address, 'address');
    if (input.misc1) validateAlphanumeric(input.misc1, 'misc1');
    if (input.misc2) validateAlphanumeric(input.misc2, 'misc2');
    if (input.misc3) validateAlphanumeric(input.misc3, 'misc3');

    // Check for pushed errors
    if (errors.length > 0) {
        throw new Error(errors.join('; ')); // Join 'errors' into a string and throw as an error
    }

    // Construct 'elements' array, enforcing 'elementsOrder'
    const elements = elementsOrder
        .filter(element => input[element] !== undefined)
        .map(element => input[element] as string);
    
    return elements;
}
