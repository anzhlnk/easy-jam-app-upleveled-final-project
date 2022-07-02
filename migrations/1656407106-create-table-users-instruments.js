exports.up = async (sql) => {
  await sql`
    CREATE TABLE users_instruments (
      id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
			personal_data_id integer REFERENCES personal_data (id),
			instrument_id integer REFERENCES instruments (id),
			relation_type_id integer REFERENCES users_instruments_relation (id),
      unique(personal_data_id, instrument_id, relation_type_id)
    )
  `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE users_instruments
  `;
};