-- 1. Create SCHOOLS Table (New Top Level)
CREATE TABLE Schools (
    school_id INT PRIMARY KEY AUTO_INCREMENT,
    school_name VARCHAR(255) UNIQUE NOT NULL
) ENGINE=InnoDB;

-- 2. Create PROGRAMS Table (Ref to Schools)
CREATE TABLE Programs (
    program_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    program_name VARCHAR(255) NOT NULL,
    program_code VARCHAR(50) UNIQUE,
    
    FOREIGN KEY (school_id) REFERENCES Schools(school_id)
) ENGINE=InnoDB;

-- 3. Create COURSE_SEMESTERS Table (New Temporal Division)
CREATE TABLE CourseSemesters (
    sem_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    semester_number INT NOT NULL, -- e.g., 1, 2, 3
    year YEAR NOT NULL,
    
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    UNIQUE (course_id, semester_number, year)
) ENGINE=InnoDB;

-- DONE TO SATISF NOT NULL
-- 4. Alter COURSES Table: Add program_id column
ALTER TABLE Courses
ADD COLUMN program_id INT NULL; 

-- 5. Insert Default Data for Migration
-- Assuming School ID 1 is created first
INSERT INTO Schools (school_name) VALUES ('School of Unassigned Studies'); 
INSERT INTO Programs (school_id, program_name, program_code) VALUES 
(1, 'Unassigned Program', 'UNASSIGNED'); 

-- Find the ID for the new 'Unassigned Program'
SET @unassigned_program_id = (SELECT program_id FROM Programs WHERE program_code = 'UNASSIGNED');

-- 6. Update Existing Courses: Link all current courses to the default Program
UPDATE Courses
SET program_id = @unassigned_program_id
WHERE program_id IS NULL; 

-- 7. Enforce NOT NULL and Foreign Key Constraint
ALTER TABLE Courses
MODIFY COLUMN program_id INT NOT NULL,
ADD CONSTRAINT fk_program
    FOREIGN KEY (program_id) REFERENCES Programs(program_id);


