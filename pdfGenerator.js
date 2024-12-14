const PDFDocument = require('pdfkit');
const fs = require('fs');
const mainSortBy = 'status';

const generatePDF = (outputFilePath, present, absent) => {
    return new Promise((resolve, reject) => {
        const absentCount = Object.keys(absent).length;
        const presentCount = Object.keys(present).length;
        const totalCount = absentCount + presentCount
        // Combine and prepare data with status
        const combinedData = [
            ...Object.entries(absent).map(([_, value]) => ({ ...value, status: 'Absent' })),
            ...Object.entries(present).map(([_, value]) => ({ ...value, status: 'Present' })),
        ];

        if (mainSortBy == 'status') {
            // Sort data
            combinedData.sort((a, b) => {
                if (a.status === b.status) {
                    return a.usn.localeCompare(b.usn); // Sort by USN if statuses are the same
                }
                return a.status === 'Absent' ? -1 : 1; // Absent first
            });
        } else {
            // Sort data
            combinedData.sort((a, b) => {
                return a.usn.localeCompare(b.usn); // Sort by USN
            });
        }
        const date = new Date();

        // Formatting Date
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

        const filePath = outputFilePath + String(formattedDate).replace(':', '-') + '.pdf';

        // automatically set the page height
        const docHeight = combinedData.length * 25 + 300;

        // Create PDF and set up stream
        const doc = new PDFDocument({ size: [700, docHeight], margin: 50 });
        const stream = fs.createWriteStream(filePath);

        // Handle stream completion
        stream.on('finish', () => {
            console.log(`PDF successfully written to ${filePath}`);
            resolve(filePath); // Resolve the promise
        });

        stream.on('error', (err) => {
            console.error('Error writing PDF:', err);
            reject(err); // Reject the promise
        });

        // Pipe document to stream
        doc.pipe(stream);

        // Add Title
        doc.fontSize(18).text(`Attendance Report  ${formattedDate}`, { align: 'center' }).moveDown(0.5);

        // Add Table Header
        const startX = 10;
        let y = 100;
        const rowHeight = 25;
        const colWidths = { serialNumber:75,usn: 150, name: 300, status: 100 };

        doc.fillColor("#000000").text(`Total Students: ${totalCount}`, startX + 5, y, { align: 'left' });
        doc.fillColor("#D32F2F").text(`Absent: ${absentCount}`, startX + 5, y + rowHeight, { align: 'left' });
        doc.fillColor("#388E3C").text(`Present: ${presentCount}`, startX + 5, y + rowHeight * 2, { align: 'left' });
        y += rowHeight * 4;

        // Header Row Background and Text
        doc.rect(startX, y, colWidths.usn, rowHeight).fillAndStroke('#D8E6FF', '#B0BEC5');
        doc.rect(startX +colWidths.serialNumber,  y, colWidths.usn, rowHeight).fillAndStroke('#D8E6FF', '#B0BEC5');
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
            const isEvenRow = index % 2 === 0;
            const rowBgColor = student.status === 'Absent' ? '#FFD6D6' : '#D9FBD9';
            const textColor = student.status === 'Absent' ? '#D32F2F' : '#388E3C';

            // Draw row background
            doc.rect(startX, y, colWidths.usn, rowHeight).fillAndStroke(rowBgColor, '#B0BEC5');
            doc.rect(startX + colWidths.serialNumber, y, colWidths.usn, rowHeight).fillAndStroke(rowBgColor, '#B0BEC5');
            doc.rect(startX + colWidths.serialNumber + colWidths.usn, y, colWidths.name, rowHeight).fillAndStroke(rowBgColor, '#B0BEC5');
            doc.rect(startX + colWidths.serialNumber + colWidths.usn + colWidths.name, y, colWidths.status, rowHeight).fillAndStroke(rowBgColor, '#B0BEC5');

            // Write row text
            doc.fillColor(textColor)
                .text(index+1, startX + 5, y + 5)
                .text(student.usn, startX +colWidths.serialNumber + 5, y + 5)
                .text(student.name, startX +colWidths.serialNumber + colWidths.usn + 5, y + 5)
                .text(student.status, startX +colWidths.serialNumber + colWidths.usn + colWidths.name + 5, y + 5);

            y += rowHeight;

        });

        // Finalize PDF
        doc.end();
    });
};

module.exports = generatePDF;