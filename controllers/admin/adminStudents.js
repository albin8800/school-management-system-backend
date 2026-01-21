import pool from "../../config/db.js";

export const getStudents = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search?.trim();
    const classId = req.query.classId;

    const offset = (page - 1) * limit;

    
    let whereConditions = ["s.is_deleted = false"];
    let params = [];

    if (search) {
      params.push(`%${search}%`);
      whereConditions.push(
        `(s.full_name ILIKE $${params.length}
          OR s.email ILIKE $${params.length}
          OR s.phone ILIKE $${params.length})`
      );
    }

    if (classId) {
      params.push(classId);
      whereConditions.push(`s.class_id = $${params.length}`);
    }

    const whereSQL = `WHERE ${whereConditions.join(" AND ")}`;

    const dataParams = [...params, limit, offset];

    const studentsQuery = `
      SELECT
        s.id,
        s.full_name,
        s.roll_no,
        s.phone,
        s.email,
        c.name AS class_name
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      ${whereSQL}
      ORDER BY s.created_at DESC
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `;

    
    const countQuery = `
      SELECT COUNT(*)
      FROM students s
      ${whereSQL}
    `;

    const [studentsResult, countResult] = await Promise.all([
      pool.query(studentsQuery, dataParams),
      pool.query(countQuery, params),
    ]);

    res.json({
      data: studentsResult.rows,
      pagination: {
        page,
        limit,
        total: Number(countResult.rows[0].count),
      },
    });

  } catch (error) {
    console.error("Student listing error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClasses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name
      FROM classes
      WHERE is_deleted = false
      ORDER BY name
    `);

    res.json({
      data: result.rows
    });
  } catch (error) {
    console.error("Get classes error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

