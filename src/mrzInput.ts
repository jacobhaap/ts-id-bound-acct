/**
 * @fileoverview Provides re-exports of MRZ types, and a function to validate and extract MRZ data.
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

import { type Type1, validateType1, extractType1 } from "./mrz/type1.ts";
import { type Type3, validateType3, extractType3 } from "./mrz/type3.ts";

/** Re-export of 'Type1' type. */
export type { Type1 } from "./mrz/type1.ts";

/** Re-export of 'Type3' type. */
export type { Type3 } from "./mrz/type3.ts";

/**
 * Validates the Machine Readable Zone (MRZ) of an ICAO 9303 {@link Type1} or {@link Type3} document,
 * extracting and returning data from the MRZ if validation passes.
 * @example
 * const input: Type3 = {
 *     row1: 'P<D<<MUSTERMANN<<ERIKA<<<<<<<<<<<<<<<<<<<<<<',
 *     row2: 'C01X00T478D<<6408125F2702283<<<<<<<<<<<<<<<4'
 * }
 * const identity = validateMRZ(input);
 * // [ "P", "D", "MUSTERMANNERIKA", "C01X00T47", "8", "D", "640812", "5", "F", "270228", "3", "4" ]
 */
export function validateMRZ(mrz: Type1 | Type3): string[] {
    let result: string[]; // Initialize 'result' let as an array

    // Check if the input contains a third row (indicates Type 1)
    if ("row3" in mrz) {
        const { row1, row2, row3 } = mrz; // Extract MRZ rows frm input
        // Check if the rows of MRZ data meet the lengths expected for Type 1
        if (row1.length === 30 && row2.length === 30 && row3.length === 30) {
            validateType1(mrz); // Validate with Type 1 validation function
            result = extractType1(mrz); // Assign extracted data to 'result'
        } else {
            // Throw an error if MRZ data extraction failed
            throw new Error(`For Type 1 documents, each row must be exactly 30 characters long.`);
        }
    }
    // If the input lacks a third row, assume Type 3
    else {
        const { row1, row2 } = mrz; // Extract MRZ rows frm input
        // Check if the rows of MRZ data meet the lengths expected for Type 3
        if (row1.length === 44 && row2.length === 44) {
            validateType3(mrz); // Validate with Type 3 validation function
            result = extractType3(mrz); // Assign extracted data to 'result'
        } else {
            // Throw an error if MRZ data extraction failed
            throw new Error(`For Type 3 documents, each row must be exactly 44 characters long.`);
        }
    }
    return result;
}
