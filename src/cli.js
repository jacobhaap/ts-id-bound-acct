#!/usr/bin/env node

const { Command } = require('commander');
const readline = require('readline');
const { generateIdentityBoundAccount } = require('./index');

const program = new Command();

program
    .name('js-iba')
    .description('Generate an Identity Bound Account. Use flags to specify options directly or run without flags to start an interactive guided process.')
    .option('--DOB <DOB>', 'Date of Birth (DDMMYYYY)')
    .option('--DOE <DOE>', 'Date of Expiry (DDMMYYYY)')
    .option('--DOI <DOI>', 'Date of Issue (DDMMYYYY)')
    .option('--pin <pin>', 'PIN (4-12 digits)')
    .option('--nationality <nationality>', 'Nationality')
    .option('--sex <sex>', 'Sex')
    .option('--birthplace <birthplace>', 'Birthplace')
    .option('--origin <origin>', 'Origin')
    .option('--authority <authority>', 'Authority')
    .option('--eyeColor <eyeColor>', 'Eye Color')
    .option('--hairColor <hairColor>', 'Hair Color')
    .option('--name <name>', 'Name')
    .option('--surname <surname>', 'Surname')
    .option('--motherName <motherName>', 'Mother\'s Name')
    .option('--motherSurname <motherSurname>', 'Mother\'s Surname')
    .option('--fatherName <fatherName>', 'Father\'s Name')
    .option('--fatherSurname <fatherSurname>', 'Father\'s Surname')
    .option('--height <height>', 'Height')
    .option('--weight <weight>', 'Weight')
    .option('--docNum <docNum>', 'Document Number')
    .option('--address <address>', 'Address')
    .option('--misc1 <misc1>', 'Miscellaneous Field 1')
    .option('--misc2 <misc2>', 'Miscellaneous Field 2')
    .option('--misc3 <misc3>', 'Miscellaneous Field 3')
    .option('--chain <chain>', 'Blockchain (ETH, BTC, SOL)', 'ETH')
    .option('--seedLength <seedLength>', 'Seed Phrase Length (12, 18, 24)', '12')
    .option('--returnEntropySeed', 'Return the entropy seed in the output', false)
    .option('--returnBits', 'Return the bits in the output', false)
    .action((options) => {
        if (process.argv.length > 2) {
            const inputData = {
                DOB: options.DOB,
                DOE: options.DOE,
                DOI: options.DOI,
                pin: options.pin,
                nationality: options.nationality,
                sex: options.sex,
                birthplace: options.birthplace,
                origin: options.origin,
                authority: options.authority,
                eyeColor: options.eyeColor,
                hairColor: options.hairColor,
                name: options.name,
                surname: options.surname,
                motherName: options.motherName,
                motherSurname: options.motherSurname,
                fatherName: options.fatherName,
                fatherSurname: options.fatherSurname,
                height: options.height,
                weight: options.weight,
                docNum: options.docNum,
                address: options.address,
                misc1: options.misc1,
                misc2: options.misc2,
                misc3: options.misc3
            };

            // Filter out undefined values from inputData
            const filteredInputData = Object.fromEntries(Object.entries(inputData).filter(([_, v]) => v !== undefined));

            // Ensure pin is provided and at least one other input variable is present
            const { pin, ...otherInputs } = filteredInputData;
            if (!pin || Object.keys(otherInputs).length === 0) {
                console.error('Error: pin and at least one other variable must be provided');
                process.exit(1);
            }

            try {
                const result = generateIdentityBoundAccount(filteredInputData, parseInt(options.seedLength), options.chain, {
                    returnEntropySeed: options.returnEntropySeed,
                    returnBits: options.returnBits
                });

                console.log(result);
            } catch (error) {
                console.error('Error:', error.message);
            }
        } else {
            // Trigger the readline interface
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            console.log('Generate an Identity Bound Account.\nProvide the input data based on your identity document, leave blank to skip:');

            const questions = [
                { key: 'pin', question: 'PIN (4-12 digits, required): ', required: true },
                { key: 'name', question: 'Name: ' },
                { key: 'surname', question: 'Surname: ' },
                { key: 'sex', question: 'Sex: ' },
                { key: 'DOB', question: 'Date of Birth (DDMMYYYY): ' },
                { key: 'birthplace', question: 'Birthplace: ' },
                { key: 'origin', question: 'Origin: ' },
                { key: 'nationality', question: 'Nationality: ' },
                { key: 'docNum', question: 'Document Number: ' },
                { key: 'authority', question: 'Authority: ' },
                { key: 'DOI', question: 'Date of Issue (DDMMYYYY): ' },
                { key: 'DOE', question: 'Date of Expiry (DDMMYYYY): ' },
                { key: 'address', question: 'Address: ' },
                { key: 'height', question: 'Height: ' },
                { key: 'weight', question: 'Weight: ' },
                { key: 'eyeColor', question: 'Eye Color: ' },
                { key: 'hairColor', question: 'Hair Color: ' },
                { key: 'motherName', question: 'Mother\'s Name: ' },
                { key: 'motherSurname', question: 'Mother\'s Surname: ' },
                { key: 'fatherName', question: 'Father\'s Name: ' },
                { key: 'fatherSurname', question: 'Father\'s Surname: ' },
                { key: 'misc1', question: 'Miscellaneous Field 1: ' },
                { key: 'misc2', question: 'Miscellaneous Field 2: ' },
                { key: 'misc3', question: 'Miscellaneous Field 3: ' },
                { key: 'chain', question: 'Blockchain ([ETH]/BTC/SOL): ' },
                { key: 'seedLength', question: 'Seed Phrase Length ([12]/18/24): ' },
                { key: 'returnEntropySeed', question: 'Return the entropy seed in the output (y/N): ' },
                { key: 'returnBits', question: 'Return the bits in the output (y/N): ' },
            ];

            const askQuestion = (rl, question) => {
                return new Promise(resolve => rl.question(question, answer => resolve(answer)));
            };

            const getAnswers = async () => {
                const answers = {};
                for (const question of questions) {
                    const answer = await askQuestion(rl, question.question);
                    if (answer.trim() || question.required) {
                        answers[question.key] = answer.trim() || undefined;
                    }
                }
                rl.close();
                return answers;
            };

            getAnswers().then(answers => {
                answers.chain = answers.chain || 'ETH';
                answers.seedLength = answers.seedLength || '12';
                answers.returnEntropySeed = answers.returnEntropySeed === 'y';
                answers.returnBits = answers.returnBits === 'y';

                // Filter out undefined values from answers
                const filteredInputData = Object.fromEntries(Object.entries(answers).filter(([_, v]) => v !== undefined));

                // Ensure pin is provided and at least one other input variable is present
                const { pin, ...otherInputs } = filteredInputData;
                if (!pin || Object.keys(otherInputs).length === 0) {
                    console.error('Error: pin and at least one other variable must be provided');
                    process.exit(1);
                }

                try {
                    const result = generateIdentityBoundAccount(filteredInputData, parseInt(answers.seedLength), answers.chain, {
                        returnEntropySeed: answers.returnEntropySeed,
                        returnBits: answers.returnBits
                    });

                    console.log(result);
                } catch (error) {
                    console.error('Error:', error.message);
                }
            });
        }
    });

program.parse(process.argv);
