let locationResult = await pool.query(
  `
  SELECT id
  FROM locations
  WHERE country = $1
    AND COALESCE(state,'') = COALESCE($2,'')
    AND COALESCE(city,'') = COALESCE($3,'')
    AND COALESCE(district,'') = COALESCE($4,'')
  LIMIT 1
  `,
  [
    country,
    state || null,
    city || null,
    district || null
  ]
);

let location_id;

// ============================================
// Get or Create Location
// ============================================

if (locationResult.rows.length > 0) {
  location_id = locationResult.rows[0].id;
} else {
  const insertLocation = await pool.query(
    `
    INSERT INTO locations (
      country,
      state,
      city,
      district
    )
    VALUES ($1,$2,$3,$4)
    RETURNING id
    `,
    [
      country,
      state || null,
      city || null,
      district || null
    ]
  );

  location_id = insertLocation.rows[0].id;
}
