const fs = require('fs');
const path = require('path');

function createFileWithContent(pathToFile, content) {
    // Extract directory path from the file path
    const dir = path.dirname(pathToFile);

    // Ensure the directory exists, create it recursively if necessary
    fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error creating directory: ${err.message}`);
            return;
        }

        // Write content to the file
        fs.writeFile(pathToFile, content, (err) => {
            if (err) {
                console.error(`Error writing to file: ${err.message}`);
            } else {
                console.log(`File created and content written to: ${pathToFile}`);
            }
        });
    });
}

createFileWithContent('./backend/data/studentDetails/info.json', '{}');
createFileWithContent('./backend/data/attendanceDetails/attendance.json', '{}');
createFileWithContent('./.env', `STUDENT_DETAILS_PATH='./backend/data/studentDetails/info.json'
ATTENDANCE_DETAILS_PATH='./backend/data/attendanceDetails/attendance.json'
PORT=80
AUTH_SECRET_KEY='abcdefghijklmnopqrstuvwxyz123456' # replace it 
JWT_SECRET_KEY='abcdefghijklmnopqrstuvwxyz123456789012345678' # replace it 
JWT_EXPIRATION='1h'
REFRESH_TOKEN_SECRET='abcdefghijklmnopqrstuvwxyz123456789012345678' # replace it 
REFRESH_TOKEN_EXPIRATION=2592000 # 30 days
AUTH_PASSWORD='admin' # replace it 
DB_USER='your-user-name' # replace it 
DB_PASSWORD=password # replace it 
DB_HOST='localhost' # replace it 
DB_PORT=5432 # replace it 
DB_NAME='attendance_db' # replace it 
DB_DIALECT='postgres' # replace it 
DOMAIN=
`
);


