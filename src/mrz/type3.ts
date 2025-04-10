/**
 * @fileoverview Provides functions for the validation and extraction of Type 3 MRZ data.
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

/** Type for lines of machine-readable zone data from an ICAO 9303 Type 3 document. */
export type Type3 = {
    row1: string,
    row2: string
}

/** Validation function for the machine-readable zone (MRZ) of an ICAO 9303 Type 3 document. */
export function validateType3(mrz: Type3): boolean {
    const errors: string[] = []; // Array to collect errors
    const alphaRegex: RegExp = /^[A-Z]+$/; // Regex for Alphabetic
    const alphaNumFillerRegex: RegExp = /^[A-Z0-9<]+$/; // Regex for Alphanumeric + Filler (<)
    const alphaFillerRegex: RegExp = /^[A-Z<]+$/; // Regex for Alphabetic + Filler (<)
    const numericRegex: RegExp = /^\d+$/; // Regex for Numeric
    const numericFillerRegex: RegExp = /^[\d<]+$/; // Regex for Numeric + Filler (<)

    const { row1, row2 } = mrz; // Extract 'row1' and 'row2' from 'mrz'

    // Check input
    if (!row1 || !row2) throw new Error(`Both row1 and row2 must be provided.`);
    if (row1.length !== 44 || row2.length !== 44) throw new Error(`First row and second row must each be exactly 44 characters long.`);

    // Validate first row
    // If validation fails for a given position/range, push the error to the 'errors' array
    if (!alphaRegex.test(row1[0])) errors.push(`First row position 1 must be an 'alpha' character indicating a passport`);
    if (!alphaFillerRegex.test(row1[1])) errors.push(`First row position 2 must be an 'alpha+<' character indicating type of passport`);
    if (!alphaFillerRegex.test(row1.substring(2, 5))) errors.push(`First row positions 3-5 must be 'alpha+<' characters indicating issuing country or organization`);
    if (!alphaFillerRegex.test(row1.substring(5))) errors.push(`First row positions 6-44 must be 'alpha+<' characters indicating surname and given names`);

    // Validate second row
    // If validation fails for a given position/range, push the error to the 'errors' array
    if (!alphaNumFillerRegex.test(row2.substring(0, 9))) errors.push(`Second row positions 1-9 must be 'alpha+num+<' characters indicating passport number`);
    if (!numericRegex.test(row2[9])) errors.push(`Second row position 10 must be a 'numeric' character indicating check digit for passport number`);
    if (!alphaFillerRegex.test(row2.substring(10, 13))) errors.push(`Second row positions 11-13 must be 'alpha+<' characters indicating nationality`);
    if (!numericRegex.test(row2.substring(13, 19))) errors.push(`Second row positions 14-19 must be 'numeric' characters indicating date of birth (YYMMDD)`);
    if (!numericRegex.test(row2[19])) errors.push(`Second row position 20 must be a 'numeric' character indicating check digit for date of birth`);
    if (!alphaFillerRegex.test(row2[20])) errors.push(`Second row position 21 must be an 'alpha+<' character indicating sex (M, F, or <)`);
    if (!numericRegex.test(row2.substring(21, 27))) errors.push(`Second row positions 22-27 must be 'numeric' characters indicating expiration date (YYMMDD)`);
    if (!numericRegex.test(row2[27])) errors.push(`Second row position 28 must be a 'numeric' character indicating check digit for expiration date`);
    if (!alphaNumFillerRegex.test(row2.substring(28, 42))) errors.push(`Second row positions 29-42 must be 'alpha+num+<' characters indicating personal number`);
    if (!numericFillerRegex.test(row2[42])) errors.push(`Second row position 43 must be a 'numeric+<' character indicating check digit for personal number`);
    if (!numericRegex.test(row2[43])) errors.push(`Second row position 44 must be a 'numeric' character indicating final check digit`);

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

/** Extract data from the MRZ of a {@link Type3} document, removing filler characters using {@link removeFillers}. */
export function extractType3(mrz: Type3): string[] {
    const { row1, row2 } = mrz; // Extract 'row1' and 'row2' from 'mrz'

    const extracted: string[] = [
        removeFillers(row1[0]),                 // passportType
        removeFillers(row1[1]),                 // type
        removeFillers(row1.substring(2, 5)),    // issuingCountry
        removeFillers(row1.substring(5)),       // namePart
        removeFillers(row2.substring(0, 9)),    // passportNumber
        removeFillers(row2[9]),                 // passportNumberCheckDigit
        removeFillers(row2.substring(10, 13)),  // nationality
        removeFillers(row2.substring(13, 19)),  // birthDate
        removeFillers(row2[19]),                // birthDateCheckDigit
        removeFillers(row2[20]),                // sex
        removeFillers(row2.substring(21, 27)),  // expirationDate
        removeFillers(row2[27]),                // expirationDateCheckDigit
        removeFillers(row2.substring(28, 42)),  // personalNumber
        removeFillers(row2[42]),                // personalNumberCheckDigit
        removeFillers(row2[43]),                // finalCheckDigit
    ]

    return extracted.filter(Boolean);
}
