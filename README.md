# Identity Bound Accounts
![NPM Version](https://img.shields.io/npm/v/js-iba) ![NPM License](https://img.shields.io/npm/l/js-iba) ![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/js-iba)

> Deterministic Mnemonic Phrases from Identity Documents.

This library supports a JavaScript implementation of **Identity Bound Accounts**, a deterministic method to derive cryptocurrency wallet mnemonic phrases based on identity documents. To get started, install the library:
```bash
npm install js-iba
```
This library provides an `idBoundAcct` function for the generation of Identity Bound Accounts. This supports the generation of mnemonic phrases for **Ethereum**, **Bitcoin**, and **Solana**, at phrase lengths of 12, 18, and 24 words. To create an Identity Bound Account, the `.create` method of is used.
```js
idBoundAcct.create(input, phraseLength, chain);
```
The `input` parameter expects information extracted from an identity document, provided via the Manual Input or Machine-Readable Zone (MRZ) input methods. The `phraseLength` parameter expects a number corresponding to the desired length of the mnemonic phrase (12, 18, or 24). The `chain` parameter corresponds to the type of account desired, `'ETH'` for Ethereum, `'BTC'` for Bitcoin, and `'SOL'` for Solana.

# Example Use
In addition to the `.create` method, `idBoundAcct` contains four other methods: `.validate`, `.entropySeed`, `.entropy`, and `.mnemonic`. These are used to validate input from identity documents, construct an entropy seed, obtain seeded entropy, and generate a mnemonic phrase respectively.

## Creating an Identity Bound Account
An Identity Bound Account is created using the `.create` method. In this first example, a 12-word mnemonic phrase for an Ethereum account is created from an identity document via the Manual Input method.
```js
const idBoundAcct =  require('js-iba');

const input = {
    docNum: 'L01X00T47',
    surname: 'MUSTERMANN',
    name: 'ERIKA',
    DOB: '12081983',
    nationality: 'DEUTSCH',
    birthplace: 'BERLIN',
    eyeColor: 'GREEN',
    height: '160',
    address: 'HEIDESTRASSE17',
    pin: '123456'
}

const mnemonic = idBoundAcct.create(input, 12, 'ETH');
console.log(mnemonic);

// Sample Output:
// minute sing aisle comic grass valid ivory despair olympic trade buddy work

```

In this second example, a 24-word mnemonic phrase for a Solana account is created from an identity document via the Machine-Readable Zone input construction method.
```js
const idBoundAcct =  require('js-iba');

const input = {
    firstRow: 'P<D<<MUSTERMANN<<ERIKA<<<<<<<<<<<<<<<<<<<<<<',
    secondRow: 'C01X00T478D<<6408125F2702283<<<<<<<<<<<<<<<4',
    pin: '123456'
}

const mnemonic = idBoundAcct.create(input, 24, 'SOL');
console.log(mnemonic);

// Sample Output:
// black artist cause sail captain identify hair fancy involve equip witness fancy miss arctic script coast firm panther whale asset hawk equal safe power

```

## Other Methods
### Validate
The `.validate` method is used to validate that input received complies with the requirements of a permitted input constructed method. A single `input` parameter is expected, which should contain input extracted from an identity document. This method returns a true value if validation passes, and a false value if validation fails. When validation fails, a false value does not return if errors are thrown. Errors are likely to be thrown that highlight the exact issue with the received input in these cases.
```js
idBoundAcct.validate(input);
```
*Sample Output:*
```
true
```


### Entropy Seed
To obtain an entropy seed, the `.entropySeed` method is used. A single `input` parameter is expected, which should contain input extracted from an identity document. An entropy seed is returned in the output, derived from the provided input.
```js
idBoundAcct.entropySeed(input);
```
*Sample Output:* 
```
HXDCT34RRBM1TE931A6USNSD40EE017N1ATK5SU0RNH217E6RESR8TEN1GMAIISE0EELIL082605656
```


### Entropy
The `.entropy` method expects an `entropySeed` parameter, which should should contain an entropy seed, and a `chain` parameter, which should contain either 'ETH', 'BTC', or 'SOL', depending on the type of account desired. The output will contain the hexadecimal digest of the hash of the entropy seed.
```js
idBoundAcct.entropy(entropySeed, chain);
```
*Sample Output:* 
```
8d59281697265fe19db9e09a5cd475fedf9680aa5ea26fef743abb1372b2c44b
```

### Mnemonic
A mnemonic phrase can be generated using the `.mnemonic` method that expects an `entropy` parameter, which should contain entropy in hexadecimal, and a `phraseLength` parameter, which should be the number 12, 18, or 24 (the number of words in length). The output contains a mnemonic phrase, generated from the provided entropy at the requested length.
```js
idBoundAcct.mnemonic(entropy, phraseLength);
```
*Sample Output:*
```
minute sing aisle comic grass valid ivory despair olympic trade buddy work
```

# Constructing Input
The basis for constructing input from an identity document is based on either providing a **Manual Input**, or providing lines from a **Machine-Readable Zone (MRZ)**. Both methods require input be paired with a 4 to 12-digit pin code.

## Manual Input
When constructing input via Manual Input, individual pieces of information extracted from an identity document are supplied as key-value pairs. Any combination of pairs may be used in this input method, and they may be passed in any order. The minimum requirement is that at least one key-value pair be provided, along with a pin. Possible options:

 - `DOB`: Date of Birth (DDMMYYYY)
 - `DOE`: Date of Document Expiration (DDMMYYYY)
 - `DOI`: Date of Document Issuance (DDMMYYYY)
 - `pin`: PIN (4-12 digits)
 - `nationality`: Bearer's Nationality
 - `sex`: Bearer's Sex
 - `birthplace`: Bearer's Birthplace
 - `origin`: Bearer's Place of Origin
 - `authority`: Document Authority/Issuing Authority
 - `eyeColor`: Bearer's Eye Color
 - `hairColor`: Bearer's Hair Color
 - `name`: Bearer's Given Name(s)
 - `surname`: Bearer's Last Name
 - `motherName`: Bearer's Mother's Given Name(s)
 - `motherSurname`: Bearer's Mother's Last Name
 - `fatherName`: Bearer's Father's Given Name(s)
 - `fatherSurname`: Bearer's Father's Last Name
 - `height`: Bearer's Height
 - `weight`: Bearer's Weight
 - `docNum`: Document Number
 - `address`: Address
 - `misc1`: Miscellaneous 1
 - `misc2`: Miscellaneous 2
 - `misc3`: Miscellaneous 3

*Sample input constructed from a set of key-value pairs:*
```js
const input = {
    docNum: 'L01X00T47',
    surname: 'MUSTERMANN',
    name: 'ERIKA',
    DOB: '12081983',
    nationality: 'DEUTSCH',
    birthplace: 'BERLIN',
    eyeColor: 'GREEN',
    height: '160',
    address: 'HEIDESTRASSE17',
    pin: '123456'
}

```

## Machine-Readable Zone (MRZ)
When constructing input from a Machine-Readable Zone, lines of MRZ data following the **ICAO 9303** Standard for **ISO/IEC 7810** Type 3 and Type 2 documents may be provided. Type 3 documents, typically passports, contain 2 lines of data with 44 characters each, while Type 1 documents, typically ID cards, contain 3 lines of data with 30 characters each. Each line of MRZ data is provided as a key-value pair. The valid keys are `firstRow`, `secondRow`, and `thirdRow`, which correspond to the row/line numbers of MRZ data from an identity document. All lines from any identity document must be provided, along with a pin.

*Sample MRZ input from a Passport:*
```js
const input = {
    firstRow: 'P<D<<MUSTERMANN<<ERIKA<<<<<<<<<<<<<<<<<<<<<<',
    secondRow: 'C01X00T478D<<6408125F2702283<<<<<<<<<<<<<<<4',
    pin: '123456'
}

```

*Sample MRZ input from an ID Card:*
```js
const input = {
    firstRow: 'IDD<<T220001293<<<<<<<<<<<<<<<',
    secondRow: '6408125<2010315D<<<<<<<<<<<<<4',
    thirdRow: 'MUSTERMANN<<ERIKA<<<<<<<<<<<<<',
    pin: '123456'
}

```

# Seeding Entropy
Take the following sample as input extracted from an identity document:
```
Name: Real
Surname: Human
Nationality: Earth
Date of Birth: 04042004
Document Number: A123456
```
Paired with this identity data is a 6-digit pin, `890123`. The first step in seeding entropy involves creating a single string, the `preEntropySeed`, which contains all this data. The order of individual pieces of information (e.g., name, surname, nationality) is determined by HMAC-based random number generation. This process uses the pin and a Buffer of the object containing the remaining input key-value pairs to seed the RNG, which then shuffles the input using the **Fisher-Yates Shuffle Algorithm**. The resulting shuffled data forms the string, with the pin appended at the end.
```
EarthHumanA12345604042004Real890123
```
For added security/increased randomness, this string undergoes a second shuffle. First, a checksum is generated by taking the decimal conversion of the *sha256* hash of the `preEntropySeed`, and extracting the first 6 digits. These digits, along with a Buffer of the pre-entropy seed are then used to seed the random number generator for the second shuffle, using the same algorithm, shuffling every character in the string. When the shuffle is complete, the checksum is affixed to the end of the string, forming the `entropySeed`.
```
aR9003a8e42A3t64Hh4u205401m2n1ra0lE314108
```

# Mnemonic Phrase Generation
In generating mnemonic phrases, entropy is derived from a hash taken of the `entropySeed`. To avoid collisions between account types, mnemonic generation for Ethereum is based on *keccak256* ([keccak](https://www.npmjs.com/package/keccak)), Bitcoin on *sha256*, and Solana on *sha512*. This hash is then converted to a binary string (bits), and truncated based on the desired length of mnemonic phrase.

To derive the mnemonic phrase, entropy is processed with [@iacobus/bip39](https://www.npmjs.com/package/@iacobus/bip39), using the English wordlist. The resulting mnemonic phrase is then validated, returning the phrase if validation passed, and throwing an error if validation failed.
