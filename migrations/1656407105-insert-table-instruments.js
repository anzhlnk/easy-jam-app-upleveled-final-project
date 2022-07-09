const instrumentDatabase = [
  { instrument_name: 'electric guitar' },
  { instrument_name: 'piano' },
  { instrument_name: 'violin' },
  { instrument_name: 'drums' },
  { instrument_name: 'saxophone' },
  { instrument_name: 'flute' },
  { instrument_name: 'trumpet' },
  { instrument_name: 'harp' },
  { instrument_name: 'synthesizer' },
  { instrument_name: 'vocal' },
  { instrument_name: 'acoustic guitar ' },
  { instrument_name: 'bass guitar' },
  { instrument_name: 'accordion' },
];

// //migration start
exports.up = async (sql) => {
  await sql`
INSERT INTO instruments
${sql(instrumentDatabase, 'instrument_name')}
`;
};

exports.down = async (sql) => {
  for (const instrument of instrumentDatabase) {
    await sql`
DELETE FROM instruments
WHERE
instrument_name = ${instrument.instrument_name}`;
  }
};
// end of migration
