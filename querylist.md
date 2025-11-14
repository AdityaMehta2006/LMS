-- Check what subject faculty teach
SELECT U.first_name, C.title FROM UserCourseAssignment UCA JOIN Users U ON UCA.user_id = U.user_id JOIN Courses C ON UCA.course_id = C.course_id WHERE C.course_code = 'BCA-OL-101-1';

-- check summary of tasks done
 SELECT
    ->     CS.title AS Unit,
    ->     CI.workflow_status AS Status
    -> FROM ContentItems CI
    -> JOIN CourseSections CS ON CI.section_id = CS.section_id
    -> WHERE CS.course_id = 1002; -- Digital Logic Design

-- course status based on school
SELECT
    P.program_name AS Program,
    C.course_code AS CourseCode,
    C.title AS CourseTitle,
    C.status AS CourseStatus -- Shows if course is 'Draft', 'Active', etc.
FROM Courses C
JOIN Programs P ON C.program_id = P.program_id
JOIN Schools S ON P.school_id = S.school_id
WHERE 
    S.school_name = 'School of Science'
ORDER BY 
    P.program_name, C.title;

-- course status based on program
SELECT
    ->     C.course_code AS CourseCode,
    ->     C.title AS CourseTitle,
    ->     C.status AS CourseStatus,
    ->     C.content_folder_url AS ContentFolder
    -> FROM Courses C
    -> JOIN Programs P ON C.program_id = P.program_id
    -> WHERE
    ->     P.program_code = 'BCA'
    -> ORDER BY
    ->     C.title;

-- content status by coursesection
SELECT
    C.course_code AS CourseCode,
    C.title AS CourseTitle,
    CS.order_index AS UnitIndex,
    CS.title AS UnitTitle
FROM CourseSections CS
JOIN Courses C ON CS.course_id = C.course_id
ORDER BY
    C.course_code, CS.order_index;

