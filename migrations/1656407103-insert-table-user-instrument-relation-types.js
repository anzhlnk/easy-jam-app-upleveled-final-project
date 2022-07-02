const relationType = [
  { relation_name: 'playing' },
  { relation_name: 'searching' },
];

// //migration start
exports.up = async (sql) => {
  await sql`
INSERT INTO users_instruments_relation
${sql(relationType, 'relation_name')}
`;
};

exports.down = async (sql) => {
  for (const relation of relationType) {
    await sql`
DELETE FROM users_instruments_relation
WHERE
relation_name = ${relation.relation_name}`;
  }
};
// end of migration
