-- Create ENUM type for attendance status
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN 
        CREATE TYPE attendance_status AS ENUM ('present', 'absent'); 
    END IF; 
END $$;

-- Create Students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    usn TEXT UNIQUE NOT NULL, -- USN is unique and not NULL
    password TEXT NOT NULL,   -- Store hashed password
    branch TEXT NOT NULL,
    section TEXT NOT NULL,
    semester INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Teachers table
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,  -- Store hashed password
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Sections table
CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    branch_name TEXT NOT NULL,
    semester INT NOT NULL,
    section TEXT NOT NULL,
    UNIQUE(branch_name, semester, section)  -- Prevent duplicate entries
);

-- Create Teacher-Sections table (Many-to-Many relationship)
CREATE TABLE teacher_sections (
    teacher_id INT REFERENCES teachers(id) ON DELETE CASCADE,
    section_id INT REFERENCES sections(id) ON DELETE CASCADE,
    PRIMARY KEY (teacher_id, section_id)
);

-- Create Attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    teacher_id INT REFERENCES teachers(id) ON DELETE CASCADE,
    section_id INT REFERENCES sections(id) ON DELETE CASCADE,
    date DATE NOT NULL,  -- Attendance date
    status attendance_status DEFAULT 'absent', -- ENUM 'present' or 'absent'
    is_manual BOOLEAN DEFAULT FALSE,          -- True if marked manually
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for frequently used columns
CREATE INDEX idx_usn ON students(usn);
CREATE INDEX idx_email ON teachers(email);
CREATE INDEX idx_attendance_date ON attendance(date);
