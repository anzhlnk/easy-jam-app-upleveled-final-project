const practiceLocations = [
  {
    id: 1,
    studio_name: 'beatboxx | Proberaum für Schlagzeuger_innen',
    latitude: 48.22660310198332,
    longitude: 16.387284224122045,
    address: 'Hochstettergasse 8, 1020 Wien',
    preferred_distance: 0,
  },
  {
    id: 2,
    studio_name: 'SOUNDER Entertainment',
    latitude: 48.23686670072116,
    longitude: 16.38040638171273,
    address: 'Universumstraße 52 keller raum 9, 1200',
    preferred_distance: 0,
  },
  {
    id: 3,
    studio_name: 'Musik Raum',
    latitude: 48.19030681567294,
    longitude: 16.332594644971795,
    address: 'Henriettenpl. 1, 1150 Wien',
    preferred_distance: 0,
  },

  {
    id: 4,
    studio_name: 'Rocktiger Proberaum Studios',
    latitude: 48.20445953881609,
    longitude: 16.337758799469775,
    address: 'Burggasse 130, 1070 Wien',
    preferred_distance: 0,
  },

  {
    id: 5,
    studio_name: 'WIENXTRA Soundbase',
    latitude: 48.21145706522204,
    longitude: 16.355065424609645,
    address: 'Friedrich-Schmidt-Platz 5, 1082 Wien',
    preferred_distance: 0,
  },

  {
    id: 6,
    studio_name: 'GAB Music Factory',
    latitude: 48.148987902394836,
    longitude: 16.290954797619683,
    address: 'Endresstraße 18, 1230 Wien',
    preferred_distance: 0,
  },
  {
    id: 7,
    studio_name: 't-on Tonstudio, Proberäume & Kurse',
    latitude: 48.19765160833704,
    longitude: 16.359246939950758,
    address: 'Linke Wienzeile 40, 1060 Wien',
    preferred_distance: 0,
  },
  {
    id: 8,
    studio_name: 'Rockfire Proberäume & Tonstudio | Rockfire OG',
    latitude: 48.21611184474675,
    longitude: 16.369212498991846,
    address: 'Eßlinggasse 4, 1010 Wien',
    preferred_distance: 0,
  },
  {
    id: 9,
    studio_name: 'Proberaum Wien',
    latitude: 48.148113533335895,
    longitude: 16.461333257183654,
    address: 'Baudißgasse 10, 1110 Wien',
    preferred_distance: 0,
  },
  {
    id: 10,
    studio_name: 'mBox Studios',
    latitude: 48.217369455859874,
    longitude: 16.37888974179947,
    address: 'Tandelmarktgasse 5A, 1020 Wien',
    preferred_distance: 0,
  },

  {
    id: 11,
    studio_name: 'Viennasound Studios VRC GesmbH',
    latitude: 48.198393354905086,
    longitude: 16.323881111115337,
    address: 'Holochergasse 24, 1150 Wien',
    preferred_distance: 0,
  },
  {
    id: 12,
    studio_name: 'SoundCube',
    latitude: 48.1848244973987,
    longitude: 16.420650441798113,
    address: 'Guglgasse 12 Gasometer C, 1110 Wien',
    preferred_distance: 0,
  },
];

// //migration start
exports.up = async (sql) => {
  await sql`
INSERT INTO locations
${sql(
  practiceLocations,
  'longitude',
  'latitude',
  'address',
  'preferred_distance',
)}
`;
};

exports.down = async (sql) => {
  for (const practiceLocation of practiceLocations) {
    await sql`
DELETE FROM locations
WHERE
id = ${practiceLocation.id}
`;
  }
};
// end of migration
