exports.up = async (sql) => {
  await sql`CREATE TABLE age_requirements(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    personal_data_id integer REFERENCES personal_data (id) ON DELETE CASCADE,
    buddy_age_min integer NOT NULL,
		buddy_age_max integer NOT NULL,
    unique(personal_data_id, 	buddy_age_min, buddy_age_max)

  );`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE age_requirements`;
};
