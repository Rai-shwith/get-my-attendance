-- Drop existing tables if they exist
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS backlogs CASCADE;
DROP TABLE IF EXISTS section_courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS teacher_sections CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_usn;
DROP INDEX IF EXISTS idx_email;
DROP INDEX IF EXISTS idx_attendance_date;
DROP INDEX IF EXISTS idx_department_name;  -- Drop department name index if it exists

-- Create ENUM type for attendance status
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN 
        CREATE TYPE attendance_status AS ENUM ('present', 'absent'); 
    END IF; 
END $$;

-- Department table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL  -- e.g., "Computer Science", "Mechanical Engineering"
);

-- Create Sections table
CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    department_id INT REFERENCES departments(id) ON DELETE CASCADE,  -- Added department_id
    semester INT NOT NULL,
    section TEXT NOT NULL,
    academic_year INT NOT NULL,  -- Academic year for this section
    UNIQUE(department_id, semester, section, academic_year)  -- Prevent duplicate entries for the same year
);

-- Create Courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,  -- Name of the course (e.g., "MAE11")
    department_id INT REFERENCES departments(id) ON DELETE CASCADE,  -- Added department_id
    title TEXT     -- Description of the course
);

-- Create Teachers table
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,  -- Store hashed password
    department_id INT REFERENCES departments(id) ON DELETE CASCADE,  -- Added department_id
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    usn TEXT UNIQUE NOT NULL,   -- USN is unique and not NULL
    password TEXT NOT NULL,     -- Store hashed password
    mac_address TEXT UNIQUE,        -- MAC address of the student's device (optional initially)
    email VARCHAR(255) UNIQUE NOT NULL,     -- Email is unique and not NULL
    section_id INT REFERENCES sections(id) ON DELETE SET NULL,  -- Reference section with flexibility
    department_id INT REFERENCES departments(id) ON DELETE CASCADE,  -- Added department_id
    academic_year INT,          -- Track academic year for the student
    registered_under INT REFERENCES teachers(id) ON DELETE RESTRICT, -- Prevent deletion of teacher if students are registered by them set the values before deleting the teacher
    session_key TEXT UNIQUE,           -- Session key for the student so that they can login in only one device at a time
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Teacher-Sections table (Many-to-Many relationship)
CREATE TABLE teacher_sections (
    teacher_id INT REFERENCES teachers(id) ON DELETE SET NULL,
    section_id INT REFERENCES sections(id) ON DELETE SET NULL,
    academic_year INT,           -- Academic year for the teacher-section relationship
    PRIMARY KEY (teacher_id, section_id)
);

-- Create Attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE SET NULL,  -- Reference student and set NULL on delete
    teacher_id INT REFERENCES teachers(id) ON DELETE SET NULL,  -- Reference teacher and set NULL on delete
    section_id INT REFERENCES sections(id) ON DELETE SET NULL,  -- Reference section and set NULL on delete
    course_id INT REFERENCES courses(id) ON DELETE SET NULL,
    date TIMESTAMP NOT NULL,
    status attendance_status DEFAULT 'absent', -- ENUM 'present' or 'absent'
    is_manual BOOLEAN DEFAULT FALSE,           -- True if marked manually
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Section-Courses table
CREATE TABLE section_courses (
    section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (section_id, course_id)
);

-- Create Backlogs table
CREATE TABLE backlogs (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    academic_year INT NOT NULL,
    reason TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- Create indexes
CREATE INDEX IF NOT EXISTS idx_usn ON students(usn);
CREATE INDEX IF NOT EXISTS idx_email ON teachers(email);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_department_name ON departments(name);