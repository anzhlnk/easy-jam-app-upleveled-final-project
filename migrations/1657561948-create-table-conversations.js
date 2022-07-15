exports.up = async (sql) => {
  await sql`
		CREATE TABLE conversations (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			timestamp timestamp NOT NULL DEFAULT NOW()
		)`;
};

exports.down = async (sql) => {
  await sql`
		DROP TABLE conversations
		`;
};
