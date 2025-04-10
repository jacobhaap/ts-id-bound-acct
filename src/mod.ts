/**
 * @fileoverview Entry point for Identity Bound Accounts.
 * Exports a function for creating Identity Bound Accounts, along with types for identity documents and options.
 * Re-exports validation functions for manual input and MRZ input
 * @module
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

import { sha256 } from "npm:@noble/hashes@1.7.1/sha2";
import { type SeedOpts, hbedf } from "npm:@iacobus/hbedf@1.2.0";
import { type Algorithm, toHex } from "npm:@iacobus/hbedf@1.2.0/utils";
import { generateMnemonic } from "npm:@iacobus/bip39@2.1.0/lite";
import { type IdentityDoc, validateManual } from "./manualInput.ts";
import { type Type1, type Type3, validateMRZ } from "./mrzInput.ts";

/** Re-export of 'IdentityDoc' type. */
export type { IdentityDoc } from "./manualInput.ts";

/** Re-export of 'Type1' and 'Type3' types. */
export type { Type1, Type3 } from "./mrzInput.ts";

/** Re-export of 'validateManual' function. */
export { validateManual } from "./manualInput.ts";

/** Re-export of 'validateMRZ' function. */
export { validateMRZ } from "./mrzInput.ts";

/** Type for account options. */
export type AccountOpts = {
    a: Algorithm,
    msLen: number
}

/**
 * Create an Identity Bound Account from a passphrase and an identity document, returning a mnemonic sentence.
 * @example
 * const passphrase: string = "123456";
 * const input: IdentityDoc = {
 *     names: "ERIKA", surname: "MUSTERMANN",
 *     docNum: "L01X00T47", birthDate: "12081983"
 * }
 * const opts: AccountOpts = { a: "sha256", msLen: 12 };
 * const ms = await bindAccount(passphrase, input, opts);
 * // position crush grief noise chest chalk around alley erupt expire wife service
 */
export async function bindAccount(passphrase: string, input: IdentityDoc | Type1 | Type3, opts: AccountOpts): Promise<string> {
    const passNFKD = passphrase.normalize("NFKD"); // NFKD normalize the passphrase
    let identity: string[]; // Initialize 'identity' as an array
    // Type guard to determine if 'input' is of type 'IdentityDoc'
    if ("names" in input) {
        identity = validateManual(input); // Validate 'input' as manual input, assign result to 'identity'
    }
    // If not manual input, assume MRZ data
    else {
        identity = validateMRZ(input); // Validate 'input' as MRZ input, assign result to 'identity'
    }
    const secret = toHex(sha256(identity.join(""))); // Create a secret from 'identity'
    const seedOpts: SeedOpts = {
        a: opts.a, // Hashing algorithm from opts.a
        N: 2 ** 13, // Work factor of 2^13
        r: 8, // Block size of 8
        p: 1 // Parallelization not supported
    }
    const ps = await hbedf(passNFKD, identity, secret, seedOpts); // Derive a HBEDF pseudorandom seed
    const ms = generateMnemonic(opts.msLen, ps); // Generate a mnemonic sentence of 'msLen' words, with ent of 'ps'
    return ms; // Return the mnemonic sentence
}
