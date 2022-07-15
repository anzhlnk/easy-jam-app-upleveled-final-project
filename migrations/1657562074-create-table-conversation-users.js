exports.up = async (sql) => {
  await sql`
		CREATE TABLE conversation_users (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			personal_data_id integer REFERENCES personal_data (id) ON DELETE CASCADE,
			conversation_id integer REFERENCES conversations (id) ON DELETE CASCADE
		)`;
};

exports.down = async (sql) => {
  await sql`
		DROP TABLE conversation_users
		`;
};
