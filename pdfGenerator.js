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

        // Create PDF and set up stream
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(outputFilePath);

        // Handle stream completion
        stream.on('finish', () => {
            console.log(`PDF successfully written to ${outputFilePath}`);
            resolve(); // Resolve the promise
        });

        stream.on('error', (err) => {
            console.error('Error writing PDF:', err);
            reject(err); // Reject the promise
        });

        // Pipe document to stream
        doc.pipe(stream);

        // Add Title
        doc.fontSize(18).text('Attendance Report', { align: 'center' }).moveDown(1);

        // Add Table Header
        const startX = 50;
        let y = 100;
        const rowHeight = 20;
        const colWidths = { usn: 120, name: 200, status: 100 };

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

// const present = {
//     "172.21.123.2": { "name": "John Doe", "usn": "1MS23EC002" },
//     "172.25.231.4": { "name": "Alice Brown", "usn": "1MS23EC004" },
//     "172.23.150.6": { "name": "Liam Anderson", "usn": "1MS23EC006" },
//     "172.24.120.8": { "name": "Sophia Taylor", "usn": "1MS23EC008" },
//     "172.22.101.10": { "name": "Ella Wilson", "usn": "1MS23EC010" },
//     "172.28.142.12": { "name": "Chris Davis", "usn": "1MS23EC012" },
//     "172.26.187.14": { "name": "Bob Johnson", "usn": "1MS23EC014" },
//     "172.30.243.16": { "name": "Jane Smith", "usn": "1MS23EC016" },
//     "172.29.198.18": { "name": "Daniel Moore", "usn": "1MS23EC018" },
//     "172.27.210.20": { "name": "Ashwith Rai N", "usn": "1MS23EC020" }
// };

// const absent = {
//     "172.21.231.1": { "name": "Absent Student A", "usn": "1MS23EC001" },
//     "172.25.210.3": { "name": "Absent Student B", "usn": "1MS23EC003" },
//     "172.23.134.5": { "name": "Absent Student C", "usn": "1MS23EC005" },
//     "172.24.188.7": { "name": "Absent Student D", "usn": "1MS23EC007" },
//     "172.22.209.9": { "name": "Absent Student E", "usn": "1MS23EC009" },
//     "172.28.175.11": { "name": "Absent Student F", "usn": "1MS23EC011" },
//     "172.26.143.13": { "name": "Absent Student G", "usn": "1MS23EC013" },
//     "172.30.156.15": { "name": "Absent Student H", "usn": "1MS23EC015" },
//     "172.29.121.17": { "name": "Absent Student I", "usn": "1MS23EC017" },
//     "172.27.134.19": { "name": "Absent Student J", "usn": "1MS23EC019" }
// };

// const outputFilePath = 'a.pdf';
// const a = generatePDF(outputFilePath, present, absent);
// a.then(() => {
//     console.log("done");
// });