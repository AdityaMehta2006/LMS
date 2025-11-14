# DB_Setup_Guide.md: Final LMS Database Setup

This file is the single source for the complete LMS database structure and sample data.

---

##  Current Schema Version

The final schema supports the full academic hierarchy (School > Program > Course) and the three content management roles (Admin, Teacher, Editor).

## Restoration Instructions (MySQL)

### Prerequisites

1.  A running instance of **MySQL Server (v8.0+)**.
2.  A valid MySQL user with privileges to create and modify databases.

### Restoration Steps

1.  **Open Terminal/Git Bash** and navigate to this project folder where the dump file is located.
2.  **Run the Import Command:** Execute the following command. It will create the full schema, all academic records, and all user accounts (Roles 1, 2, 3).

    ```bash
    mysql -u [your_mysql_username] -p lms_master < final_lms_master_export.sql
    ```

    *(The command will prompt you for your MySQL password.)*

### Initial User Accounts for Testing

| Role | Email | User ID (Check Dump) |
| :--- | :--- | :--- |
| **Admin** | `admin@clg.edu` | (Check dump file) |
| **Teacher** | `prof.smith@clg.edu` | (Check dump file) |
| **Editor** | `mike.editor@clg.edu` | (Check dump file) |