const validateManualInput = (inputs) => {
    const errors = [];
    const dateRegex = /^\d{2}\d{2}\d{4}$/;
    const pinRegex = /^\d{4,12}$/;
    const latinRegex = /^[A-Za-z]+$/;
    const numericRegex = /^\d+$/;
    const alphanumericRegex = /^[A-Za-z0-9]+$/;

    const fieldsOrder = [
        'DOB', 'DOE', 'DOI', 'pin', 'nationality', 'sex', 'birthplace', 
        'origin', 'authority', 'eyeColor', 'hairColor', 'name', 'surname', 
        'motherName', 'motherSurname', 'fatherName', 'fatherSurname', 
        'height', 'weight', 'docNum', 'address', 'misc1', 'misc2', 'misc3'
    ];

    // DDMMYYYY validation method.
    const validateDate = (date, fieldName) => {
        if (date && !dateRegex.test(date)) {
            errors.push(`${fieldName} must be in the format DDMMYYYY`);
        } else if (date) {
            const day = parseInt(date.slice(0, 2), 10);
            const month = parseInt(date.slice(2, 4), 10);
            if (day < 1 || day > 31) {
                errors.push(`${fieldName} day must be between 01 and 31`);
            }
            if (month < 1 || month > 12) {
                errors.push(`${fieldName} month must be between 01 and 12`);
            }
        }
    };

    // Latin validation method
    const validateLatin = (str, fieldName) => {
        if (str && !latinRegex.test(str)) {
            errors.push(`${fieldName} must only contain characters in the Latin alphabet`);
        }
    };

    // Numeric validation method
    const validateNumeric = (num, fieldName) => {
        if (num && !numericRegex.test(num)) {
            errors.push(`${fieldName} must only contain numbers`);
        }
    };

    // Alphanumeric validation method
    const validateAlphanumeric = (str, fieldName) => {
        if (str && !alphanumericRegex.test(str)) {
            errors.push(`${fieldName} must be a non-empty alphanumeric string`);
        }
    };

    // Date validation
    validateDate(inputs.DOB, 'DOB');
    validateDate(inputs.DOE, 'DOE');
    validateDate(inputs.DOI, 'DOI');
    
    // Pin validation
    if (inputs.pin && !pinRegex.test(inputs.pin)) {
        errors.push('pin must be a numerical string between 4 and 12 digits');
    }

    // Validation of latin input
    validateLatin(inputs.nationality, 'nationality');
    validateLatin(inputs.sex, 'sex');
    validateLatin(inputs.birthplace, 'birthplace');
    validateLatin(inputs.origin, 'origin');
    validateLatin(inputs.authority, 'authority');
    validateLatin(inputs.eyeColor, 'eyeColor');
    validateLatin(inputs.hairColor, 'hairColor');
    validateLatin(inputs.name, 'name');
    validateLatin(inputs.surname, 'surname');
    validateLatin(inputs.motherName, 'motherName');
    validateLatin(inputs.motherSurname, 'motherSurname');
    validateLatin(inputs.fatherName, 'fatherName');
    validateLatin(inputs.fatherSurname, 'fatherSurname');

    // Validation of numeric input
    validateNumeric(inputs.height, 'height');
    validateNumeric(inputs.weight, 'weight');

    // Validation of alphanumeric input
    validateAlphanumeric(inputs.docNum, 'docNum');
    validateAlphanumeric(inputs.address, 'address');
    validateAlphanumeric(inputs.misc1, 'misc1');
    validateAlphanumeric(inputs.misc2, 'misc2');
    validateAlphanumeric(inputs.misc3, 'misc3');

    if (errors.length > 0) {
        throw new Error(errors.join('; '));
    }

    // Create a new object with properties in the desired order
    const orderedInputs = {};
    fieldsOrder.forEach(field => {
        if (inputs[field] !== undefined) {
            orderedInputs[field] = inputs[field];
        }
    });

    return orderedInputs;
};

module.exports = validateManualInput;
