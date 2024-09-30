const fs = require('fs');

// Function to read and parse a JSON file
function loadJSON(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

// Function to convert y values from a specified base to a decimal number
function convertYValue(base, value) {
    return parseInt(value, base);
}

// Function to compute the constant term using Lagrange interpolation
function computeConstantTerm(dataPoints, requiredPoints) {
    let result = 0;
    for (let j = 0; j < requiredPoints; j++) {
        let x_j = dataPoints[j][0];
        let y_j = dataPoints[j][1];

        // Calculate the Lagrange basis polynomial
        let lj = 1;
        for (let m = 0; m < requiredPoints; m++) {
            if (m !== j) {
                let x_m = dataPoints[m][0];
                lj *= (0 - x_m) / (x_j - x_m);
            }
        }

        // Aggregate the contributions of each Lagrange polynomial
        result += y_j * lj;
    }
    return result;
}

// Function to determine if a given point lies on the polynomial
function isValidPoint(dataPoints, requiredPoints, x, y) {
    let computedY = 0;
    for (let j = 0; j < requiredPoints; j++) {
        let x_j = dataPoints[j][0];
        let y_j = dataPoints[j][1];

        // Calculate the Lagrange basis polynomial
        let lj = 1;
        for (let m = 0; m < requiredPoints; m++) {
            if (m !== j) {
                let x_m = dataPoints[m][0];
                lj *= (x - x_m) / (x_j - x_m);
            }
        }

        // Accumulate the contribution to computedY
        computedY += y_j * lj;
    }
    return Math.round(computedY) === y;
}

// Main function to handle the test case processing
function analyzeTestCase(filePath) {
    const jsonData = loadJSON(filePath);
    console.log("Loaded JSON data:", jsonData); // Debugging output

    const { n, k } = jsonData.keys;

    // Extract and decode the points
    const dataPoints = [];
    for (let i = 1; i <= n; i++) {
        const pointInfo = jsonData[i.toString()];
        if (!pointInfo) {
            console.error(`No data available for key ${i}`); // Debugging output
            continue;
        }

        const base = pointInfo.base;
        const encodedY = pointInfo.value;
        const yValue = convertYValue(base, encodedY);
        dataPoints.push([i, yValue]); // Collecting point as [x, y]
    }

    // Calculate the constant term using the first k points
    const secret = computeConstantTerm(dataPoints.slice(0, k), k);
    console.log(`Secret for the test case in file '${filePath}': ${secret}`);

    // For the second test case, identify any erroneous points
    if (filePath.includes('second')) {
        const incorrectPoints = [];
        for (let i = 0; i < dataPoints.length; i++) {
            const [x, y] = dataPoints[i];
            if (!isValidPoint(dataPoints.slice(0, k), k, x, y)) {
                incorrectPoints.push(`(${x}, ${y})`);
            }
        }

        console.log(`Erroneous points for the second test case: ${incorrectPoints.length > 0 ? incorrectPoints.join(', ') : 'None'}`);
    }
}

// Execute the function for both test cases
analyzeTestCase('testcase1.json');
analyzeTestCase('testcase2.json');
