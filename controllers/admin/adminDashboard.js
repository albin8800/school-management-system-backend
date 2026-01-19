import pool from '../../config/db.js';

export const getDashboardSummary = async (req, res) => {
    try {
        const studentsQuery = `
        SELECT COUNT(*) AS total_students
        FROM students
        WHERE is_deleted = FALSE AND is_active = TRUE
        `;

        const teachersQuery = `
        SELECT COUNT(*) AS total_teachers
        FROM teachers
        WHERE is_deleted = FALSE AND is_active = TRUE
        `;

        const classQuery = `
        SELECT COUNT(*) AS total_classes
        FROM classes
        WHERE is_deleted = FALSE AND is_active = TRUE
        `;

        const attendanceQuery = `
        SELECT
        ROUND(
        (COUNT(*) FILTER (WHERE status = TRUE) * 100.0)
        / NULLIF(COUNT(*), 0),
        2
        ) AS attendance_percentage
         FROM attendance
         WHERE is_deleted = FALSE
        `;

        const [
            studentResult,
            teachersResult,
            classesResult,
            attendanceResult,
        ] = await Promise.all([
            pool.query(studentsQuery),
            pool.query(teachersQuery),
            pool.query(classQuery),
            pool.query(attendanceQuery),
        ]);

        res.status(200).json({
            totalStudents: Number(studentResult.rows[0].total_students),
            totalTeachers: Number(teachersResult.rows[0].total_teachers),
            totalClasses: Number(classesResult.rows[0].total_classes),
            attendancePercentage: attendanceResult.rows[0].attendance_percentage || 0,
        })
    } catch (error) {
        console.error("Dashboard summary error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}


export const getClassAttendance = async (req, res) => {
  try {
    const query = `
      SELECT
        c.name AS class_name,
        ROUND(
          (COUNT(a.id) FILTER (WHERE a.status = TRUE) * 100.0)
          / NULLIF(COUNT(a.id), 0),
          2
        ) AS attendance_percentage
      FROM classes c
      LEFT JOIN attendance a
        ON a.class_id = c.id
        AND a.is_deleted = FALSE
      WHERE c.is_deleted = FALSE
      GROUP BY c.id
      ORDER BY c.name
    `;

    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Class attendance error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserDistribution = async (req, res) => {
  try {
    const query = `
      SELECT 'students' AS role, COUNT(*) AS count
      FROM students WHERE is_deleted = FALSE
      UNION ALL
      SELECT 'teachers', COUNT(*) FROM teachers WHERE is_deleted = FALSE
      UNION ALL
      SELECT 'admins', COUNT(*) FROM admins WHERE is_deleted = FALSE
    `;

    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("User distribution error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};