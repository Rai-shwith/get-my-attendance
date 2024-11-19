const PDFDocument = require('pdfkit');
const fs = require('fs');
const generatePDF = (outputFilePath, present, absent) => {
    return new Promise((resolve, reject) => {
        // Combine and prepare data with status
        const combinedData = [
            ...Object.entries(absent).map(([_, value]) => ({ ...value, status: 'Absent' })),
            ...Object.entries(present).map(([_, value]) => ({ ...value, status: 'Present' })),
        ];

        // Sort data
        combinedData.sort((a, b) => {
            if (a.status === b.status) {
                return a.usn.localeCompare(b.usn); // Sort by USN if statuses are the same
            }
            return a.status === 'Absent' ? -1 : 1; // Absent first
        });

        const date = new Date();

        // Formatting Date
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

        const filePath = `${outputFilePath.split('.pdf')[0]}${String(formattedDate).replace(':','-')}.pdf`

        // Create PDF and set up stream
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filePath);

        // Handle stream completion
        stream.on('finish', () => {
            console.log(`PDF successfully written to ${filePath}`);
            resolve(); // Resolve the promise
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
        const startX = 50;
        let y = 100;
        const rowHeight = 20;
        const colWidths = { usn: 120, name: 300, status: 100 };

        // Header Row Background and Text
        doc.rect(startX, y, colWidths.usn, rowHeight).fillAndStroke('#D8E6FF', '#B0BEC5');
        doc.rect(startX + colWidths.usn, y, colWidths.name, rowHeight).fillAndStroke('#D8E6FF', '#B0BEC5');
        doc.rect(startX + colWidths.usn + colWidths.name, y, colWidths.status, rowHeight).fillAndStroke('#D8E6FF', '#B0BEC5');
        doc.fillColor('black')
            .text('USN', startX + 5, y + 5)
            .text('Name', startX + colWidths.usn + 5, y + 5)
            .text('Status', startX + colWidths.usn + colWidths.name + 5, y + 5);
        y += rowHeight;

        // Add Table Rows with Colors
        combinedData.forEach((student, index) => {
            const isEvenRow = index % 2 === 0;
            const rowBgColor = student.status === 'Absent' ? '#FFD6D6' : '#D9FBD9';
            const textColor = student.status === 'Absent' ? '#D32F2F' : '#388E3C';

            // Draw row background
            doc.rect(startX, y, colWidths.usn, rowHeight).fillAndStroke(rowBgColor, '#B0BEC5');
            doc.rect(startX + colWidths.usn, y, colWidths.name, rowHeight).fillAndStroke(rowBgColor, '#B0BEC5');
            doc.rect(startX + colWidths.usn + colWidths.name, y, colWidths.status, rowHeight).fillAndStroke(rowBgColor, '#B0BEC5');

            // Write row text
            doc.fillColor(textColor)
                .text(student.usn, startX + 5, y + 5)
                .text(student.name, startX + colWidths.usn + 5, y + 5)
                .text(student.status, startX + colWidths.usn + colWidths.name + 5, y + 5);

            y += rowHeight;

            // Handle page breaks
            if (y > doc.page.height - 50) {
                doc.addPage();
                y = 50;
            }
        });

        // Finalize PDF
        doc.end();
    });
};

module.exports = generatePDF;