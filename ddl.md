-- DDL for Final Optimized Schem

-- 1. Organizational struct
CREATE TABLE Schools (
    school_id INT PRIMARY KEY AUTO_INCREMENT,
    school_name VARCHAR(255) UNIQUE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE Programs (
    program_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    program_name VARCHAR(255) NOT NULL,
    program_code VARCHAR(50) UNIQUE,
    FOREIGN KEY (school_id) REFERENCES Schools(school_id)
) ENGINE=InnoDB;

-- 2. User & Access Control
CREATE TABLE Roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    can_edit_courses BOOLEAN NOT NULL DEFAULT 0,
    can_manage_system BOOLEAN NOT NULL DEFAULT 0,
    can_upload_content BOOLEAN NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
) ENGINE=InnoDB;

-- 3. Course Structure
CREATE TABLE Courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) UNIQUE,
    status ENUM('Draft', 'Active', 'Archived') NOT NULL DEFAULT 'Draft',
    content_folder_url TEXT, -- NEW: Stores the main Google Drive link (Column 7)
    
    FOREIGN KEY (program_id) REFERENCES Programs(program_id)
) ENGINE=InnoDB;

CREATE TABLE CourseSemesters (
    sem_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    semester_number INT NOT NULL,
    year YEAR NOT NULL,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    UNIQUE (course_id, semester_number, year)
) ENGINE=InnoDB;

CREATE TABLE CourseSections (
    section_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    order_index INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Content and Res
CREATE TABLE ContentItems (
    content_id INT PRIMARY KEY AUTO_INCREMENT,
    section_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    estimated_duration_min INT,
    learning_objectives TEXT,
    
    -- Final ENUM definition based on status report logic
    workflow_status ENUM(
        'Planned', 'Scripted', 'Editing', 'Post-Editing', 
        'Ready_for_Video_Prep', 'Under_Review', 'Published'
    ) NOT NULL DEFAULT 'Planned',
    
    video_link TEXT,
    review_notes TEXT,
    uploaded_by_editor_id INT,
    
    -- NEW RESOURCE COLUMNS
    practice_questions_url TEXT, -- NEW (Column 9)
    reference_material_url TEXT, -- NEW (Column 10)
    
    FOREIGN KEY (section_id) REFERENCES CourseSections(section_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by_editor_id) REFERENCES Users(user_id)
) ENGINE=InnoDB;

CREATE TABLE ContentScripts (
    script_id INT PRIMARY KEY AUTO_INCREMENT,
    content_id INT NOT NULL,
    presentation_file_data LONGBLOB,
    materials_file_data LONGBLOB,
    introduction_script_url TEXT, -- NEW: Stores the specific Intro Script link (Column 8)
    instructions_for_editor TEXT, 
    
    FOREIGN KEY (content_id) REFERENCES ContentItems(content_id) ON DELETE CASCADE,
    UNIQUE (content_id)
) ENGINE=InnoDB;

-- 5. Multi-Teacher Assignment
CREATE TABLE UserCourseAssignment (
    user_course_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    UNIQUE (user_id, course_id)
) ENGINE=InnoDB;