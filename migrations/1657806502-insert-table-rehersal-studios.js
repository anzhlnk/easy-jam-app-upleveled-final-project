const practiceLocations = [
  {
    studio_name: 'beatboxx',
    latitude: 48.22660310198332,
    longitude: 16.387284224122045,
  },
  {
    studio_name: 'Universumstrasse',
    latitude: 48.236735249573364,
    longitude: 16.377017028354395,
  },
  {
    studio_name: 'Musik Raum',
    latitude: 48.19001,
    longitude: 16.33282,
  },
  {
    studio_name: 'Rocktiger Proberaum Studios',
    latitude: 48.20435,
    longitude: 16.33776,
  },
  {
    studio_name: 'WIENXTRA Soundbase',
    latitude: 48.211201,
    longitude: 16.355089,
  },
  {
    studio_name: 'GAB Music Factory',
    latitude: 48.148885996075684,
    longitude: 16.290977517222668,
  },
  {
    studio_name: 't-on Tonstudio, Proberäume & Kurse',
    latitude: 48.19786865456942,
    longitude: 16.359286592806757,
  },
  {
    studio_name: 'Rockfire Proberäume & Tonstudio | Rockfire OG',
    latitude: 48.21604041214373,
    longitude: 16.368583394522545,
  },
  {
    studio_name: 'Proberaum Wien',
    latitude: 48.150327752514386,
    longitude: 16.46017782719784,
  },
  {
    studio_name: 'mBox Studios',
    latitude: 48.217668288306506,
    longitude: 16.378883912055887,
  },

  {
    studio_name: 'Viennasound Studios VRC GesmbH',
    latitude: 48.20039687995971,
    longitude: 16.32343700706888,
  },
  {
    studio_name: 'SoundCube',
    latitude: 48.19235802441037,
    longitude: 16.42060024092168,
  },
];

// //migration start
exports.up = async (sql) => {
  await sql`
INSERT INTO rehearsal_studios
${sql(practiceLocations, 'studio_name')}
`;
};

exports.down = async (sql) => {
  for (const practiceLocation of practiceLocations) {
    await sql`
DELETE FROM rehearsal_studios
WHERE
studio_name = ${practiceLocation.studio_name}`;
  }
};
// end of migration
