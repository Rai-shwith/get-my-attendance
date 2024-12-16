const XLSX = require("xlsx");
const { getFormattedDate } = require("../utils/helpers");

const generateExcel = (combinedData, presentCount, absentCount,timestamp) => {
    // Uncomment `mainSortBy` based on the requirement
    const mainSortBy = "";
    // const mainSortBy = "status";

    return new Promise((resolve, reject) => {
        try {
            const totalCount = absentCount + presentCount;

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

            const formattedDate = getFormattedDate(timestamp);

            // Prepare data for the sheet
            const sheetData = [
                ["Date",formattedDate],
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

            // Write the Excel file to a buffer
            const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

            resolve(buffer); // Resolve with the Excel buffer
        } catch (err) {
            console.error("Error generating Excel file:", err);
            reject(err);
        }
    });
};

module.exports = generateExcel;
