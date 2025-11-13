# SQL_Instructions.md: LMS Database Setup

This document provides concise instructions for setting up the LMS content management database using the single provided SQL dump file. The schema focuses on the **Teacher, Editor, and Admin** content creation workflow.

---

## DB Scope

This database supports:
* **Role-Based Access Control (RBAC):** Permissions for Admin, Teacher, and Editor.
* **Content Lifecycle:** Tracks topics through defined statuses (`Planned`, `Scripted`, `Under Review`, `Published`) using the `workflow_status` ENUM.
* **Teacher Management:** Links Teacher accounts to their assigned courses via the `UserCourseAssignment` table.

## Setup Instructions (MySQL)

The entire database structure and initial user accounts can be fully restored using the single provided SQL dump file.

### Prerequisites

1.  A running instance of **MySQL Server (v8.0+)**.
2.  A MySQL user with privileges to create and modify databases.

### Restoration Steps

1.  **Open Terminal/Git Bash** and navigate to the project root directory where the dump file is located.
2.  **Run the Import Command:** Execute the following command to create the schema and insert all initial data.

    ```bash
    mysql -u [your_mysql_username] -p lms_project < final_project_submission.sql
    ```

    *(The command will prompt you for your MySQL password.)*

### Initial User Accounts for Testing

| Role | Email | Password Hash (Placeholder) |
| :--- | :--- | :--- |
| **Teacher** | `prof.smith@clg.edu` | `teacher_hash` |
| **Editor** | `mike.editor@clg.edu` | `editor_hash` |

## Documentation

The definitive structure is visualized in the **`lms-3.mwb`** file (MySQL Workbench EER Diagram).