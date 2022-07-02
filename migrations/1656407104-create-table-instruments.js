exports.up = async (sql) => {
  await sql`CREATE TABLE instruments (
  id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
	instrument_name varchar(70) NOT NULL
  )`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE instruments`;
};