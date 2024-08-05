# Identity Bound Accounts
Identity Bound Accounts are a method of web3 wallet seed phrase/mnemonic phrase generation, with seeded-random number generation (RNG) based on information extracted from identity documents, rather than traditional RNG methods standardly used. This library, `js-iba`, is a JavaScript implementation of Identity Bound Accounts, currently supporting seed phrase generation for Ethereum, Bitcoin, and Solana wallets, at lengths of 12, 18, and 24 words.

## Usage
The library can be installed with the following command:

    npm install js-iba

Then the library must be required using:

    const { generateIdentityBoundAccount } =  require('js-iba');

The `generateIdentityBoundAccount` function requires that `inputData`, a `seedLength`, and `chain` be provided. A `returnEntropySeed` option exists to return the `entropySeed` and `preEntropySeed`, and a `returnBits` option exists to return the `bits` obtained from the seeded entropy.

    generateIdentityBoundAccount(inputData, 12, 'ETH', { returnEntropySeed: true, returnBits: true });

### Example Usage
A complete JavaScript module using the `js-iba` library to generate a 12-word Ethereum seed phrase would resemble the following example:

    const { generateIdentityBoundAccount } =  require('js-iba');
    
    const inputData = {
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
        
    const result = generateIdentityBoundAccount(inputData, 12, 'ETH');
        console.log(`Seed Phrase:`, result.seedPhrase);

It is also possible to generate multiple seed phrases from different sets of input data at the same time, as long as they are all for the same number of words and the same chain (e.g.. generate a set of 12-word Ethereum Wallets):

    const { generateIdentityBoundAccount } =  require('js-iba');
    
    const inputData = [
        {
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
        },
        {
            firstRow: 'P<D<<MUSTERMANN<<ERIKA<<<<<<<<<<<<<<<<<<<<<<',
            secondRow: 'C01X00T478D<<6408125F2702283<<<<<<<<<<<<<<<4',
            pin: '123456'
        },
        {
            firstRow: 'IDD<<T220001293<<<<<<<<<<<<<<<',
            secondRow: '6408125<2010315D<<<<<<<<<<<<<4',
            thirdRow: 'MUSTERMANN<<ERIKA<<<<<<<<<<<<<',
            pin: '123456'
        }
    ];
    
    inputData.forEach((inputData, index) => {
        try {
            const result = generateIdentityBoundAccount(inputData, 12, 'ETH', { returnEntropySeed: true, returnBits: true });
            console.log(`${index + 1} - Seed Phrase:`, result.seedPhrase);
            console.log(`${index + 1} - Pre-Entropy Seed:`, result.preEntropySeed);
            console.log(`${index + 1} - Entropy Seed:`, result.entropySeed);
            console.log(`${index + 1} - Bits:`, result.bits);
        } catch (error) {
            console.log(`${index + 1} - Error:`, error.message);
        }
    });


### Command-Line Interface
Included in this library is the `js-iba` command for the creation of Identity Bound Accounts via the Manual Input method using [Commander](https://www.npmjs.com/package/commander), executable via the command as defined in `package.json`, or by executing the `src/cli.js` module. This supports the creation of seed phrases via a an interactive guided process using [Readline](https://nodejs.org/api/readline.html), or using flags to directly specify options for input data.

    Usage: js-iba [options]
    
    Generate an Identity Bound Account. Use flags to specify options directly or run without flags to start an interactive guided process.
    
    Options:
      --DOB <DOB>                      Date of Birth (DDMMYYYY)
      --DOE <DOE>                      Date of Expiry (DDMMYYYY)
      --DOI <DOI>                      Date of Issue (DDMMYYYY)
      --pin <pin>                      PIN (4-12 digits)
      --nationality <nationality>      Nationality
      --sex <sex>                      Sex
      --birthplace <birthplace>        Birthplace
      --origin <origin>                Origin
      --authority <authority>          Authority
      --eyeColor <eyeColor>            Eye Color
      --hairColor <hairColor>          Hair Color
      --name <name>                    Name
      --surname <surname>              Surname
      --motherName <motherName>        Mother's Name
      --motherSurname <motherSurname>  Mother's Surname
      --fatherName <fatherName>        Father's Name
      --fatherSurname <fatherSurname>  Father's Surname
      --height <height>                Height
      --weight <weight>                Weight
      --docNum <docNum>                Document Number
      --address <address>              Address
      --misc1 <misc1>                  Miscellaneous Field 1
      --misc2 <misc2>                  Miscellaneous Field 2
      --misc3 <misc3>                  Miscellaneous Field 3
      --chain <chain>                  Blockchain (ETH, BTC, SOL) (default: "ETH")
      --seedLength <seedLength>        Seed Phrase Length (12, 18, 24) (default: "12")
      --returnEntropySeed              Return the entropy seed in the output (default: false)
      --returnBits                     Return the bits in the output (default: false)
      -h, --help                       display help for command

## Overview
Identity Bound Accounts are designed to work where any identity document (Passport, National ID Card, Residence Permit, Driver's License, Birth Certificate) can be paired with a pin code (any length between 4 and 12 digits) to securely generate a seed phrase, where the same identity document + pin pairing will always result in the same seed phrase. The goal is providing a method to abstract seed phrase storage & protection to improve user friendliness, especially around non-web3 natives and onboarding new users, while keeping accounts non-custodial. The average person already knows how to keep track of/safely store their vital identity documents and memorize pin codes (e.g.. bankcard pins), so by relying upon already known skills/behavior to secure accounts rather than trying to introduce new methods/require new practices be learned (e.g.. the requirement to safely & securely remember or store a 12-24 word seed phrase), creating and securing accounts becomes a simplified and more user-friendly process.

### Seeding Entropy
Let's take the following example as input data obtained from an identity document:

    Name: Real
    Surname: Human
    Nationality: Earth
    Date of Birth: 04042004
    Document Number: A123456

Paired with this identity data is the 6-digit pin code `890123`. The first step in seeding entropy is creating a single string containing all this data, the `preEntropySeed`. The order in which the individual pieces of input data (e.g.. name, surname, nationality) are entered in the string is determined by [seeded random number generation](https://www.npmjs.com/package/seedrandom), seeded by the pin, shuffling the pieces of input data based on the Fisher-Yates Shuffle Algorithm. The shuffled data has the pin affixed at the end, and this string becomes the `preEntropySeed`:

    04042004EarthA123456RealHuman890123

For added security, this string undergoes another shuffle. First, a checksum is generated by taking the decimal conversion of the sha256 hash of the `preEntropySeed`, and extracting the first 6 numbers. Those 6 numbers are used to seed the random number generator used in the second shuffle using the same shuffle algorithm, only this time shuffling every character in the string. After the completed shuffle, the checksum is affixed to the end of the string, becoming the `entropySeed`:

    Reha20a2Hm5n9uA64330204a18r0l404tE1847288

### Seed Phrase Generation
Depending on if an Ethereum, Bitcoin, or Solana seed phrase is desired, the `entropySeed` is hashed with either [keccak256](https://www.npmjs.com/package/keccak), sha256, or [sha512](https://www.npmjs.com/package/js-sha512) respectively. While the seed phrase obtained from any of these methods can be used to access wallets on any of the given blockchains (e.g.. a seed phrase generated for Ethereum could be used to access a Bitcoin wallet), different hashing algorithms were selected to avoid collisions between the different chains, ensuring the seed phrase generated by any set of input data will differ between if Ethereum, Bitcoin, or Solana is selected.

The hash of the `entropySeed` is converted to binary to obtain `bits`, with the number of bits required differing based on the length of the seed phrase desired. For 12-word seed phrases this is truncated to 128 bits, 18-word phrases truncated to 192 bits, and 24-word phrases truncated to 248 bits. A checksum is generated by taking a hash of the bits (hashing algorithm based on the blockchain, explained previously) converting it to binary, and taking the first 4, 6, or 8 bits as a checksum, affixed to the end of `bits`, resulting in a total of either 132, 198, or 256 bits. From here, the [BIP39 wordlist](https://www.npmjs.com/package/@scure/bip39) is used to create the seed phrase, dividing `bits` into 11-bit segments, with each segment mapping to a word in the wordlist, becoming either a 12, 18, or 24 word seed phrase. This newly generated seed phrase is then validated before being returned.

## Identity Documents
This library currently supports two methods of inputting data from identity documents. The first method, Manual Input, is intended for either manually or automatically entering information (via a process like document scanning) that visually appears printed on identity documents. The second method, Machine-Readable Zone Input, is intended for taking lines of data from machine readable zones of identity documents. Both are required to be paired with a 4 to 12-digit numerical pin code.

### Manual Input
Manual Input supports a variety of different pieces of information that can be included in the `inputData`. None of the information is mandatory, the only requirement is at least one be provided, along with the pin:

 - `DOB`: Date of Birth
 - `DOE`: Date of Document Expiration
 - `DOI`: Date of Document Issuance
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
 - `height`: Bearer's Height (cm)
 - `weight`: Bearer's Weight (kg)
 - `docNum`: Document Number
 - `address`: Address listed on the Document
 - `misc1`: Miscellaneous 1
 - `misc2`: Miscellaneous 2
 - `misc3`: Miscellaneous 3

Example Input:

	{
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

### Machine-Readable Zone Input
Machine-Readable Zone Input supports passing lines of machine-readable data following the **ICAO 9303** Standard for **ISO/IEC 7810** Type 3 and Type 2 documents. Type 3 documents, typically passports, contain 2 lines of data with 44 characters each, while Type 1 documents, typically ID cards, contain 3 lines of data with 30 characters each. Each line of the machine-readable data is passed along with the pin in the `inputData`.

Example for a Passport:

	{
        firstRow: 'P<D<<MUSTERMANN<<ERIKA<<<<<<<<<<<<<<<<<<<<<<',
        secondRow: 'C01X00T478D<<6408125F2702283<<<<<<<<<<<<<<<4',
        pin: '123456'
	}

Example for an ID Card:

	{
        firstRow: 'IDD<<T220001293<<<<<<<<<<<<<<<',
        secondRow: '6408125<2010315D<<<<<<<<<<<<<4',
        thirdRow: 'MUSTERMANN<<ERIKA<<<<<<<<<<<<<',
        pin: '123456'
	}

