exports.up = async (sql) => {
  await sql`CREATE TABLE users_genres (
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    personal_data_id integer REFERENCES personal_data(id),
    genre_id integer REFERENCES genres (id),
    unique (personal_data_id, genre_id)
  );`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE users_genres`;
};
