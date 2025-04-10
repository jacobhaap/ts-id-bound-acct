# TypeScript | Identity Bound Accounts
> Deterministic Mnemonic Sentences from Identity Documents.

This is an implementation of **Identity Bound Accounts**, a deterministic method of mnemonic sentence generation from identity documents. [BIP39 mnemonic sentences](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) are generated based on a provided Human Identity (genuine or fictitious), from [HBEDF](https://gist.github.com/jacobhaap/e8305533628be06fc09754d41a17ee5b) pseudorandom seeds.

Natively in **TypeScript**, with **ESM** and **CommonJS** compatibility. To get started, install the library:
```bash
# Deno
deno add jsr:@jacobhaap/id-bound-acct

# Node.js
npm install id-bound-acct
```

## Providing an Identity
An identity may be provided for the creation of an Identity Bound Account on the basis of either **Manual** input, or **Machine Readable Zone** (MRZ) input. For manual input, items relating to an identity (*e.g. name, date of birth, nationality*) are provided as key-value pairs, while for MRZ input, rows from the machine readable zone of a document are provided as key-value pairs. The compatible MRZ formats are **ICAO 9303** Type 1 and Type 3 documents.

Manual input is provided as an *IdentityDoc* object. All key-value pairs are optional except for *names*.
```ts
type IdentityDoc = {
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
```

Machine Readable Zone input is provided as either a *Type1* or *Type3* object.
```ts
// ICAO 9303 Type 1
type Type1 = {
    row1: string,
    row2: string,
    row3: string
}

// ICAO 9303 Type 3
type Type3 = {
    row1: string,
    row2: string
}
```

## Creating an Account
A mnemonic sentence can be deterministically generated using the `bindAccount` function.

The *bindAccount* function has three input parameters:
```js
async function bindAccount(passphrase, input, opts) {};
```
Where:
 - ***passphrase*** is a password or PIN.
 - ***input*** is an identity input.
 - ***opts*** contains options for the HBEDF seed and mnemonic sentence generation.
	 - ***a*** is the hashing algorithm for the HBEDF seed.
	 - ***msLen*** is the mnemonic sentence length.

The ***passphrase*** parameter is expected as a *string* (*NFKD normalization is applied internally*), the ***input*** parameter is expected as an *IdentityDoc*, *Type1*, or *Type3* object, and the ***opts*** parameter is expected as an *AccountOpts* object. The *bindAccount* function is asynchronous, and returns a Promise that resolves to a *string*.

*AccountOpts Type:*
```ts
type AccountOpts = {
    a: Algorithm,
    msLen: number
}
```

The *SeedOpts* passed to HBEDF for deriving the pseudorandom seed use the hashing algorithm from ***opts***, with the *N*, *r*, and *p* based on the lowest cost recommended by [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt) for *scrypt*, without parallelization (not supported).
```
N=2^13 (8 MiB), r=8 (1024 bytes), p=1
```


Internally, a *secret* for the HBEDF seed derivation is created by taking a *sha256* hash of the extracted ***input***, joined to a string. The hexadecimal string of this hash is used as the *secret*.

*Example use, generating a 12 word mnemonic sentence from manual input:*
```ts
import { type IdentityDoc, type AccountOpts, bindAccount } from "@jacobhaap/id-bound-acct";

const passphrase: string = "123456";
const input: IdentityDoc = {
    names: "ERIKA", surname: "MUSTERMANN",
    docNum: "L01X00T47", birthDate: "12081983"
}
const opts: AccountOpts = { a: "sha256", msLen: 12 };
const ms = await bindAccount(passphrase, input, opts);
// position crush grief noise chest chalk around alley erupt expire wife service
```

## Validating and Extracting Input
The Manual and Machine Readable Zone input of identities can be validated using the `validateManual` and `validateMRZ` functions. The *validateManual* function expects an ***input*** parameter of type *IdentityDoc*, and returns an *array (string[])* extracted from the input if validation passes. The *validateMRZ* function expects an ***input*** parameter of type *Type1* or *Type3*, and returns an *array (string[])* extracted from the input if validation passes. Both functions are synchronous.

*Example use, for manual input:*
```ts
import { type IdentityDoc, validateManual } from "@jacobhaap/id-bound-acct";

const input: IdentityDoc = {
    docNum: "L01X00T47", names: "ERIKA",
    birthDate: "12081983", surname: "MUSTERMANN",
}
const identity = validateManual(input); // [ "ERIKA", "MUSTERMANN", "12081983", "L01X00T47" ]
```

*Example use, for MRZ input:*
```ts
import { type Type3, validateMRZ } from "@jacobhaap/id-bound-acct";

const input: Type3 = {
    row1: 'P<D<<MUSTERMANN<<ERIKA<<<<<<<<<<<<<<<<<<<<<<',
    row2: 'C01X00T478D<<6408125F2702283<<<<<<<<<<<<<<<4'
}
const identity = validateMRZ(input);
// [ "P", "D", "MUSTERMANNERIKA", "C01X00T47", "8", "D", "640812", "5", "F", "270228", "3", "4" ]
```
