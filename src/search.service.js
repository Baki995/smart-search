const { pool } = require("./config");

exports.extractEntities = async (searchTerm) => {
    try {
        const query = 'SELECT * FROM search_data($1)';
        const values = [prepareTsquery(searchTerm)];

        const { rows } = await pool.query(query, values);
        return formatResults(rows);
    } catch (err) {
        console.error('Error executing stored procedure:', err);
        throw err;
    }
}

function prepareTsquery(inputSentence) {
    const stopWords = new Set(['in', 'the', 'a', 'of', 'and', 'or', 'not']);
    let sanitizedSentence = inputSentence.replace(/'/g, "''");
    let words = sanitizedSentence.split(/\s+/);

    // Construct the tsquery parts
    let tsqueryParts = words.map(word => {
        let lowerWord = word.toLowerCase();
        if (!stopWords.has(lowerWord)) {
            // Include the word if it's not a stop word
            return word;
        }
        // Return null for stop words (to be filtered out later)
        return null;
    }).filter(part => part !== null); // Filter out null values

    // Join the parts into a tsquery string
    let tsqueryString = tsqueryParts.join(' | ');

    // Handle edge cases where tsqueryString is empty
    if (!tsqueryString) {
        return ''; // Return an empty string if no valid terms are found
    }

    return tsqueryString;
}

function formatResults(sqlResult) {
    // Create a map to categorize entities by their source type
    const categorizedData = sqlResult.reduce((acc, item) => {
        if (!acc[item.source]) {
            acc[item.source] = [];
        }
        acc[item.source].push({ id: item.id, name: item.name });
        return acc;
    }, {});

    // Extract keys from the categorized data
    const keys = Object.keys(categorizedData);

    // Function to generate all possible combinations
    const generateCombinations = (keys, index, currentCombination) => {
        // Base case: if we've processed all keys, store the combination
        if (index === keys.length) {
            formattedCombinations.push({ ...currentCombination });
            return;
        }

        // Get the current key and its corresponding entities
        const key = keys[index];
        const entities = categorizedData[key];

        // Recursively generate combinations for the next key
        for (const entity of entities) {
            currentCombination[key] = entity;
            generateCombinations(keys, index + 1, currentCombination);
        }
    };

    // Array to store the formatted combinations
    const formattedCombinations = [];

    // Generate combinations starting from the first key
    generateCombinations(keys, 0, {});

    return formattedCombinations;
}