const XLSX = require("xlsx");
const path = require("path");
const { filePaths } = require("../config/env");
const generateExcel = (combinedData, presentCount, absentCount) => {
    // uncomment mainSortBy based on the requirement
    const mainSortBy = "";
    // const mainSortBy = "status";
    return new Promise((resolve, reject) => {
        try {
            const totalCount = absentCount + presentCount
            // Sort data
            if (mainSortBy === "status") {
                combinedData.sort((a, b) => {
                    if (a.status === b.status) {
                        return a.usn.localeCompare(b.usn);
                    }
                    return a.status === "Absent" ? -1 : 1;
                });
            } else {
                combinedData.sort((a, b) => a.usn.localeCompare(b.usn));
            }

            const date = new Date();

            // Formatting Date
            const options = {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            };

            const outputFilePath = filePaths.excelPath;
            const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date).replace(":", "-");
            const fileName = `${formattedDate}.xlsx`;
            const filePath = outputFilePath + '/' + fileName;
            // Prepare data for the sheet
            const sheetData = [
                ["Total Students", totalCount],
                ["Absent", absentCount],
                ["Present", presentCount],
                [], // Empty row
                ["S No.", "USN", "Name", "Status"],
            ];

            combinedData.forEach((student, index) => {
                sheetData.push([index + 1, student.usn, student.name, student.status]);
            });

            // Create a worksheet
            const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

            // Create a workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

            // Write the Excel file
            XLSX.writeFile(workbook, filePath);

            console.log(`Excel file successfully written to ${filePath}`);
            resolve(filePath);
        } catch (err) {
            console.error("Error writing Excel file:", err);
            reject(err);
        }
    });
};

module.exports = generateExcel;