exports.up = async (sql) => {
  await sql`
		CREATE TABLE messages (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			personal_data_id integer REFERENCES personal_data (id),
			conversation_id integer REFERENCES conversations (id),
			timestamp timestamp NOT NULL DEFAULT NOW(),
			content varchar(600) NOT NULL
		)`;
};

exports.down = async (sql) => {
  await sql`
		DROP TABLE messages
		`;
};
