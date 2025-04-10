/**
 * @fileoverview Test script for the exports of Identity Bound Accounts (src/mod.ts).
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

import {
    type IdentityDoc, type Type1, type Type3, type AccountOpts,
    validateManual, validateMRZ, bindAccount
} from "../src/mod.ts"

/** Manual Input. */
const input1: IdentityDoc = {
    docNum: 'L01X00T47',
    surname: 'MUSTERMANN',
    names: 'ERIKA',
    birthDate: '12081983',
    nationality: 'DEUTSCH',
    birthplace: 'BERLIN',
    eyeColor: 'GREEN',
    height: '160',
    address: 'HEIDESTRASSE17'
}

/** Type 1 MRZ Input. */
const input2: Type1 = {
    row1: 'IDD<<T220001293<<<<<<<<<<<<<<<',
    row2: '6408125<2010315D<<<<<<<<<<<<<4',
    row3: 'MUSTERMANN<<ERIKA<<<<<<<<<<<<<',
}

/** Type 3 MRZ Input. */
const input3: Type3 = {
    row1: 'P<D<<MUSTERMANN<<ERIKA<<<<<<<<<<<<<<<<<<<<<<',
    row2: 'C01X00T478D<<6408125F2702283<<<<<<<<<<<<<<<4',
}

/** Checks that two arrays are the same length, and that each element at the same index is equal. */
function checkArray(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((val, i) => val === b[i]);
}

// Test for 'validateManual' function.
// Validates and extracts the manual input 'input1'. Assigns the expected result to a 'control' const.
// console.assert calls 'checkArray' to check that the extracted 'input1' and 'control' arrays match.
Deno.test(`Function 'validateManual' validates and extracts the manual input of an identity document`, () => {
    const identity = validateManual(input1); // Validate 'input1' manual input and assign extracted array to 'identity'
    const control = [ "ERIKA", "MUSTERMANN", "12081983", "DEUTSCH", "BERLIN", "GREEN", "160", "L01X00T47", "HEIDESTRASSE17" ]; // Expected array as the control
    console.assert(checkArray(identity, control), `Function 'validateManual' failed to validate and extract the manual input of an identity document`);
});

// Test for 'validateMRZ' function.
// Validates and extracts the Type 1 MRZ input 'input2'. Assigns the expected result to a 'control' const.
// console.assert calls 'checkArray' to check that the extracted 'input2' and 'control' arrays match.
Deno.test(`Function 'validateMRZ' validates and extracts the MRZ of an ICAO 9303 Type 1 document`, () => {
    const identity = validateMRZ(input2); // Validate 'input2' MRZ and assign extracted array to 'identity'
    const control = [ "I", "D", "D", "T22000129", "3", "640812", "5", "201031", "5", "D", "4", "MUSTERMANN", "ERIKA" ]; // Expected array as the control
    console.assert(checkArray(identity, control), `Function 'validateMRZ' failed to validate and extract the MRZ of an ICAO 9303 Type 1 document`);
});

// Test for 'validateMRZ' function.
// Validates and extracts the Type 3 MRZ input 'input3'. Assigns the expected result to a 'control' const.
// console.assert calls 'checkArray' to check that the extracted 'input3' and 'control' arrays match.
Deno.test(`Function 'validateMRZ' validates and extracts the MRZ of an ICAO 9303 Type 3 document`, () => {
    const identity = validateMRZ(input3); // Validate 'input3' MRZ and assign extracted array to 'identity'
    const control = [ "P", "D", "MUSTERMANNERIKA", "C01X00T47", "8", "D", "640812", "5", "F", "270228", "3", "4" ]; // Expected array as the control
    console.assert(checkArray(identity, control), `Function 'validateMRZ' failed to validate and extract the MRZ of an ICAO 9303 Type 3 document`);
});

// Test for 'bindAccount' function
// Uses a PIN for the 'passphrase', manual input for the 'input'.
// Uses 'sha256' as the output transformation algorithm, uses a 'msLen' of 12.
// Creates a mnemonic sentence 'ms' from the identity. Assigns the expected result to a 'control' const.
// console.assert checks that the mnemonic sentences 'ms' and 'control' match.
Deno.test(`Function 'bindAccount' creates an Identity Bound Account from a passphrase and identity`, async () => {
    const passphrase: string = "123456"; // 6 digit numerical PIN as the passphrase
    // Use the manual input of an identity document as 'identity'
    const input: IdentityDoc = {
        names: "ERIKA", surname: "MUSTERMANN", // Given name and surname
        docNum: "L01X00T47", birthDate: "12081983" // Document number and date of birth
    }
    const opts: AccountOpts = {
        a: "sha256", // Use 'sha256' as the hashing algorithm
        msLen: 12 // Obtain a mnemonic sentence with a length of 12 words
    }
    const ms = await bindAccount(passphrase, input, opts); // Create the identity bound account
    const control = "position crush grief noise chest chalk around alley erupt expire wife service"; // Expected mnemonic sentence as the control
    console.assert(ms === control, `Function 'bindAccount' failed to create an Identity Bound Account from a passphrase and identity`);
});
