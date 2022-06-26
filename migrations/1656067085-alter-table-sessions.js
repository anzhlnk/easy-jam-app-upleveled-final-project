exports.up = async (sql) => {
  await sql`ALTER TABLE sessions
  ADD csrf_secret varchar;
  `;
};

exports.down = async (sql) => {
  await sql`ALTER TABLE sessions
    DROP COLUMN csrf_secret;`;
};
