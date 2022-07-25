const genderDatabase = [
  {
    gender_name: 'female',
  },
  {
    gender_name: 'male',
  },
  {
    gender_name: 'other',
  },
];

exports.up = async (sql) => {
  await sql`
INSERT INTO genders
${sql(genderDatabase, 'gender_name')}
`;
};

exports.down = async (sql) => {
  for (const gender of genderDatabase) {
    await sql`
DELETE FROM genders
WHERE
gender_name = ${gender.gender_name}`;
  }
};
