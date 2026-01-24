import pool from "../../config/db.js";



export const addStudent = async (req, res) => {
  
  const {
    full_name, email, phone, gender, class_id, roll_no, blood_group, address, father_name, mother_name, photo
  } = req.body;

  if(!full_name || !email || !phone || !gender || !class_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const emailCheckQuery = `
    SELECT id FROM students WHERE email = $1 AND is_deleted = false
    `;

    const emailCheck = await pool.query(emailCheckQuery, [email]);

    if(emailCheck.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const rollCheckQuery = `
    SELECT id FROM students WHERE roll_no = $1 AND class_id = $2 AND is_deleted = false
    `;
    
    const rollCheck = await pool.query(rollCheckQuery, [roll_no, class_id]);

    if (rollCheck.rows.length > 0) {
      return res.status(409).json({ message: "Roll number already exists in this class" });
    }

        const insertQuery = `
      INSERT INTO students (
        full_name,
        email,
        phone,
        gender,
        blood_group,
        address,
        father_name,
        mother_name,
        roll_no,
        class_id,
        photo,
        is_active,
        is_deleted
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true,false
      )
      RETURNING id
    `;

    const values = [
      full_name.trim(),
      email.toLowerCase().trim(),
      phone.trim(),
      gender,
      blood_group || null,
      address || null,
      father_name || null,
      mother_name || null,
      roll_no,
      class_id,
      photo || null
    ];

    const result = await pool.query(insertQuery, values);

    return res.status(201).json({
      message: "Student added successfully",
      student_id: result.rows[0].id
    });
    
  } catch (error) {
    console.error("Add Student Error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });

  }

}

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

export const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        s.id,
        s.full_name,
        s.email,
        s.phone,
        s.gender,
        s.blood_group,
        s.roll_no,
        s.class_id,
        s.father_name,
        s.mother_name,
        s.address,
        s.photo,
        s.is_active,
        s.created_at,
        c.name AS class_name
      FROM students s
      LEFT JOIN classes c ON c.id = s.class_id
      WHERE s.id = $1 AND s.is_deleted = false
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error("Get student error:", error);
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

export const updateStudent = async (req, res) => {

  const { id } = req.params;

  const {
      full_name,
    email,
    phone,
    gender,
    blood_group,
    class_id,
    roll_no,
    father_name,
    mother_name,
    address,
    photo,
  } = req.body;

    const parsedClassId =
  class_id === "" || class_id === undefined ? null : Number(class_id);

  try {
    const result = await pool.query(
  `
  UPDATE students
  SET
    full_name = $1,
    email = $2,
    phone = $3,
    gender = $4,
    blood_group = $5,
    class_id = $6,
    roll_no = $7,
    father_name = $8,
    mother_name = $9,
    address = $10,
    photo = $11,
    updated_at = NOW()
  WHERE id = $12 AND is_deleted = false
  RETURNING *
  `,
  [
    full_name,
    email,
    phone,
    gender,
    blood_group,
    parsedClassId, 
    roll_no,
    father_name,
    mother_name,
    address,
    photo,
    id,
  ]
);


    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({
      message: "Student updated successfully",
      data: result.rows[0],
    });
    
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE students
      SET
        is_deleted = true,
        is_active = false,
        updated_at = NOW()
      WHERE id = $1 AND is_deleted = false
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
