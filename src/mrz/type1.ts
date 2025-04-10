/**
 * @fileoverview Provides functions for the validation and extraction of Type 1 MRZ data.
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

/** Type for lines of machine-readable zone data from an ICAO 9303 Type 1 document. */
export type Type1 = {
    row1: string,
    row2: string,
    row3: string
}

/** Validation function for the machine-readable zone (MRZ) of an ICAO 9303 Type 1 document. */
export function validateType1(mrz: Type1): boolean {
    const errors: string[] = []; // Array to collect errors
    const alphaRegex: RegExp = /^[A-Z]+$/; // Regex for Alphabetic
    const alphaNumFillerRegex: RegExp = /^[A-Z0-9<]+$/; // Regex for Alphanumeric + Filler (<)
    const alphaFillerRegex: RegExp = /^[A-Z<]+$/; // Regex for Alphabetic + Filler (<)
    const numericRegex: RegExp = /^\d+$/; // Regex for Numeric
    const numericFillerRegex: RegExp = /^[\d<]+$/; // Regex for Numeric + Filler (<)

    const { row1, row2, row3 } = mrz; // Extract 'row1', 'row2', and 'row3 from 'mrz'

    // Check input
    if (!row1 || !row2 || !row3) throw new Error(`All three rows (row1, row2, row3) must be provided.`);
    if (row1.length !== 30 || row2.length !== 30 || row3.length !== 30) throw new Error(`Each row must be exactly 30 characters long.`);

    // Validate first row
    // If validation fails for a given position/range, push the error to the 'errors' array
    if (!alphaRegex.test(row1[0])) errors.push(`First row position 1 must be an 'alpha' character indicating a document type`);
    if (!alphaNumFillerRegex.test(row1[1])) errors.push(`First row position 2 must be an 'alpha+num+<' character indicating type of document`);
    if (row1[1] === 'V') errors.push(`First row position 2 cannot be 'V'`);
    if (!alphaFillerRegex.test(row1.substring(2, 5))) errors.push(`First row positions 3-5 must be 'alpha+<' characters indicating issuing country or organization`);
    if (!alphaNumFillerRegex.test(row1.substring(5, 14))) errors.push(`First row positions 6-14 must be 'alpha+num+<' characters indicating document number`);
    if (!numericFillerRegex.test(row1[14])) errors.push(`First row position 15 must be a 'numeric+<' character indicating check digit for document number`);
    if (!alphaNumFillerRegex.test(row1.substring(15, 30))) errors.push(`First row positions 16-30 must be 'alpha+num+<' characters indicating optional data`);

    // Validate second row
    // If validation fails for a given position/range, push the error to the 'errors' array
    if (!numericRegex.test(row2.substring(0, 6))) errors.push(`Second row positions 1-6 must be 'numeric' characters indicating date of birth (YYMMDD)`);
    if (!numericRegex.test(row2[6])) errors.push(`Second row position 7 must be a 'numeric' character indicating check digit for date of birth`);
    if (!alphaFillerRegex.test(row2[7])) errors.push(`Second row position 8 must be an 'alpha+<' character indicating sex (M, F, or <)`);
    if (!numericRegex.test(row2.substring(8, 14))) errors.push(`Second row positions 9-14 must be 'numeric' characters indicating expiration date (YYMMDD)`);
    if (!numericRegex.test(row2[14])) errors.push(`Second row position 15 must be a 'numeric' character indicating check digit for expiration date`);
    if (!alphaFillerRegex.test(row2.substring(15, 18))) errors.push(`Second row positions 16-18 must be 'alpha+<' characters indicating nationality`);
    if (!alphaNumFillerRegex.test(row2.substring(18, 29))) errors.push(`Second row positions 19-29 must be 'alpha+num+<' characters indicating optional data`);
    if (!numericRegex.test(row2[29])) errors.push(`Second row position 30 must be a 'numeric' character indicating final check digit`);

    // Validate third row
    // If validation fails, push the error to the 'errors' array
    if (!alphaFillerRegex.test(row3.substring(0, 30))) errors.push(`Third row positions 1-30 must be 'alpha+<' characters indicating surname and given names`);

    // Return validation
    if (errors.length > 0) {
        throw new Error(errors.join('; ')); // Join 'errors' into a string and throw as an error
    } else {
        return true;
    }
}

/** Function to remove MRZ filler characters `<` from a string. */
function removeFillers(str: string): string {
    return str.replace(/</g, '').replace(/\s+/g, '');
}

/** Extract data from the MRZ of a {@link Type1} document, removing filler characters using {@link removeFillers}. */
export function extractType1(mrz: Type1): string[] {
    const { row1, row2, row3 } = mrz; // Extract 'row1', 'row2', and 'row3 from 'mrz'

    const extracted: string[] = [
        removeFillers(row1[0]),                 // documentType
        removeFillers(row1[1]),                 // type
        removeFillers(row1.substring(2, 5)),    // issuingCountry
        removeFillers(row1.substring(5, 14)),   // documentNumber
        removeFillers(row1[14]),                // documentNumberCheckDigit
        removeFillers(row1.substring(15, 30)),  // optionalData1
        removeFillers(row2.substring(0, 6)),    // birthDate
        removeFillers(row2[6]),                 // birthDateCheckDigit
        removeFillers(row2[7]),                 // sex
        removeFillers(row2.substring(8, 14)),   // expirationDate
        removeFillers(row2[14]),                // expirationDateCheckDigit
        removeFillers(row2.substring(15, 18)),  // nationality
        removeFillers(row2.substring(18, 29)),  // optionalData2
        removeFillers(row2[29]),                // finalCheckDigit
        removeFillers(row3.split('<<')[0]),     // surname
        removeFillers(row3.split('<<')[1]),     // givenNames
    ]

    return extracted.filter(Boolean);
}
