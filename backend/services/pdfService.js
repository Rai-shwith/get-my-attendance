const PDFDocument = require('pdfkit');
const { getFormattedDate } = require('../utils/helpers');

const generatePDF = (combinedData, presentCount, absentCount, timestamp) => {
    const mainSortBy = 'status';

    return new Promise((resolve, reject) => {
        const totalCount = absentCount + presentCount;

        // Sort data
        if (mainSortBy === 'status') {
            combinedData.sort((a, b) => {
                if (a.status === b.status) {
                    return a.usn.localeCompare(b.usn); // Sort by USN if statuses are the same
                }
                return a.status === 'Absent' ? -1 : 1; // Absent first
            });
        } else {
            combinedData.sort((a, b) => a.usn.localeCompare(b.usn)); // Sort by USN
        }
        
        const formattedDate = getFormattedDate(timestamp);

        // Automatically set the page height
        const docHeight = combinedData.length * 25 + 300;

        // Create PDF and use a buffer
        const doc = new PDFDocument({ size: [700, docHeight], margin: 50 });
        const buffers = [];

        // Collect data chunks into the buffer
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData); // Resolve with the PDF buffer
        });

        doc.on('error', (err) => {
            console.error('Error generating PDF:', err);
            reject(err); // Reject on error
        });

        // Add Title
        doc.fontSize(18).text(`Attendance Report  ${formattedDate}`, { align: 'center' }).moveDown(0.5);

        // Add Table Header
        const startX = 10;
        let y = 100;
        const rowHeight = 25;
        const colWidths = { serialNumber: 75, usn: 150, name: 300, status: 100 };

        doc.fillColor("#000000").text(`Total Students: ${totalCount}`, startX + 5, y, { align: 'left' });
        doc.fillColor("#D32F2F").text(`Absent: ${absentCount}`, startX + 5, y + rowHeight, { align: 'left' });
        doc.fillColor("#388E3C").text(`Present: ${presentCount}`, startX + 5, y + rowHeight * 2, { align: 'left' });
        y += rowHeight * 4;

        // Header Row Background and Text
        doc.rect(startX, y, colWidths.usn, rowHeight).fillAndStroke('#D8E6FF', '#B0BEC5');
        doc.rect(startX + colWidths.serialNumber, y, colWidths.usn, rowHeight).fillAndStroke('#D8E6FF', '#B0BEC5');
        doc.rect(startX + colWidths.serialNumber + colWidths.usn, y, colWidths.name, rowHeight).fillAndStroke('#D8E6FF', '#B0BEC5');
        doc.rect(startX + colWidths.serialNumber + colWidths.usn + colWidths.name, y, colWidths.status, rowHeight).fillAndStroke('#D8E6FF', '#B0BEC5');
        doc.fillColor('black')
            .text('S no.', startX + 5, y + 5)
            .text('USN', startX + colWidths.serialNumber + 5, y + 5)
            .text('Name', startX + colWidths.serialNumber + colWidths.usn + 5, y + 5)
            .text('Status', startX + colWidths.serialNumber + colWidths.usn + colWidths.name + 5, y + 5);
        y += rowHeight;

        // Add Table Rows with Colors
        combinedData.forEach((student, index) => {
            const rowBgColor = student.status === 'Absent' ? '#FFD6D6' : '#D9FBD9';
            const textColor = student.status === 'Absent' ? '#D32F2F' : '#388E3C';

            // Draw row background
            doc.rect(startX, y, colWidths.usn, rowHeight).fillAndStroke(rowBgColor, '#B0BEC5');
            doc.rect(startX + colWidths.serialNumber, y, colWidths.usn, rowHeight).fillAndStroke(rowBgColor, '#B0BEC5');
            doc.rect(startX + colWidths.serialNumber + colWidths.usn, y, colWidths.name, rowHeight).fillAndStroke(rowBgColor, '#B0BEC5');
            doc.rect(startX + colWidths.serialNumber + colWidths.usn + colWidths.name, y, colWidths.status, rowHeight).fillAndStroke(rowBgColor, '#B0BEC5');

            // Write row text
            doc.fillColor(textColor)
                .text(index + 1, startX + 5, y + 5)
                .text(student.usn, startX + colWidths.serialNumber + 5, y + 5)
                .text(student.name, startX + colWidths.serialNumber + colWidths.usn + 5, y + 5)
                .text(student.status, startX + colWidths.serialNumber + colWidths.usn + colWidths.name + 5, y + 5);

            y += rowHeight;
        });

        // Finalize PDF
        doc.end();
    });
};

module.exports = generatePDF;
