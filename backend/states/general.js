// variable to keep track of generated pdf output
let outputPdfPath = '';
// variable to keep track of generated Excel output
let outputExcelPath = '';

// Function update the outputPdfPath
const updateOutputPdfPath = (path) => {
    outputPdfPath = path;
};

// Function update the outputExcelPath
const updateOutputExcelPath = (path) => {
    outputExcelPath = path;
};

// Function to get the outputPdfPath
const getOutputPdfPath = () => {
    return outputPdfPath;
};

// Function to get the outputExcelPath
const getOutputExcelPath = () => {
    return outputExcelPath;
};

module.exports = { updateOutputPdfPath, updateOutputExcelPath, getOutputPdfPath, getOutputExcelPath };